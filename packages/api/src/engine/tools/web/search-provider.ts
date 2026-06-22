/**
 * Search provider interface and ordered fallback registry.
 *
 * Pluggable search backend — providers are tried in chain order.
 * The first provider to succeed wins; failures fall through to the
 * next provider. Includes a concurrency semaphore to prevent
 * rate-limiting from upstream search services.
 */
import { createLogger } from '@clawix/shared';

const logger = createLogger('engine:tools:web:search-provider');

/** Maximum concurrent search requests. */
const MAX_CONCURRENT_SEARCHES = 3;

/** Fallback bound for providers that don't declare their own `timeoutMs`. */
const DEFAULT_PROVIDER_TIMEOUT_MS = 10_000;

/**
 * Independent backstop added above each provider's own timeout. Mirrors the
 * web_fetch hard-timeout fix: a provider's `AbortSignal.timeout()` can fail
 * to unblock `fetch()` if the hang is below the promise (e.g. dispatcher
 * teardown not wired to the signal), so the chain can't rely on a provider's
 * internal timeout firing on its own.
 */
const HARD_TIMEOUT_MARGIN_MS = 10_000;

/** A single search result. */
export interface SearchResult {
  readonly title: string;
  readonly url: string;
  readonly snippet: string;
}

/** Interface for pluggable search backends. */
export interface SearchProvider {
  readonly name: string;
  /** Provider's own request timeout (ms); sizes the registry's hard-timeout backstop. Defaults to 10s if omitted. */
  readonly timeoutMs?: number;
  search(query: string, count: number): Promise<readonly SearchResult[]>;
}

/**
 * Ordered fallback registry for search providers.
 *
 * Providers are tried in the order they were added. The first
 * successful response is returned. If all providers fail, an error
 * is thrown with the last failure message.
 *
 * A counting semaphore limits concurrent search attempts to
 * {@link MAX_CONCURRENT_SEARCHES}.
 *
 * Not decorated with @Injectable() — instantiated via useFactory in EngineModule
 * to configure providers from env vars at startup.
 */
export class SearchProviderRegistry {
  private readonly chain: SearchProvider[] = [];

  // ── Concurrency semaphore ──────────────────────────────────────────
  private inFlight = 0;
  private readonly waitQueue: (() => void)[] = [];

  /** Append a search provider to the end of the fallback chain. */
  addProvider(provider: SearchProvider): void {
    this.chain.push(provider);
    logger.info({ provider: provider.name }, 'Search provider added to chain');
  }

  /**
   * Execute a search, trying each provider in chain order.
   *
   * On the first successful response, returns results immediately.
   * If a provider throws, logs a warning and tries the next one.
   * If all providers fail, throws with the last error message.
   * If no providers are configured, throws immediately.
   */
  async search(query: string, count: number): Promise<readonly SearchResult[]> {
    if (this.chain.length === 0) {
      throw new Error('No search providers configured');
    }

    // Acquire semaphore before trying the chain
    await this.acquire();

    try {
      return await this.tryChain(query, count);
    } finally {
      this.release();
    }
  }

  // ── Chain execution ────────────────────────────────────────────────

  private async tryChain(query: string, count: number): Promise<readonly SearchResult[]> {
    let lastError: Error | undefined;

    for (const provider of this.chain) {
      try {
        const results = await this.raceHardTimeout(provider, query, count);
        return results;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        logger.warn(
          { provider: provider.name, error: lastError.message },
          'Search provider failed, trying next',
        );
      }
    }

    throw new Error(`All search providers failed. Last error: ${lastError?.message ?? 'unknown'}`);
  }

  /**
   * Race a provider's search() against an independent hard timer above its
   * own declared timeout. A provider stuck below its own timeout's promise
   * would otherwise block the whole chain — and the reasoning loop — until
   * the stale-run reaper's 10-minute sweep. Abandoning the still-pending
   * call here lets the chain fall through to the next provider instead;
   * its eventual settlement is swallowed since nothing awaits it anymore.
   */
  private raceHardTimeout(
    provider: SearchProvider,
    query: string,
    count: number,
  ): Promise<readonly SearchResult[]> {
    const timeoutMs = (provider.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS) + HARD_TIMEOUT_MARGIN_MS;

    return new Promise<readonly SearchResult[]>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Provider "${provider.name}" did not complete within ${timeoutMs}ms`));
      }, timeoutMs);

      provider
        .search(query, count)
        .then(resolve, reject)
        .finally(() => clearTimeout(timer));
    });
  }

  // ── Semaphore internals ────────────────────────────────────────────

  private async acquire(): Promise<void> {
    if (this.inFlight < MAX_CONCURRENT_SEARCHES) {
      this.inFlight++;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waitQueue.push(() => {
        this.inFlight++;
        resolve();
      });
    });
  }

  private release(): void {
    this.inFlight--;
    const next = this.waitQueue.shift();
    if (next) {
      next();
    }
  }
}
