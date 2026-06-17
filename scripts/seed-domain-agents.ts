/**
 * Seed the designated SME domain primary agents into a RUNNING Clawix instance
 * via the admin API (idempotent — skips any agent whose name already exists).
 *
 * Single source of truth: packages/api/src/domain-agents.ts. The same list is
 * seeded at container start by bootstrap.ts; this script lets you apply it to an
 * already-running instance without a rebuild.
 *
 *   API_URL=http://localhost:3001 tsx scripts/seed-domain-agents.ts
 *
 * Admin credentials + provider/model are read from the repo .env
 * (INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD / DEFAULT_PROVIDER / DEFAULT_LLM_MODEL).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DOMAIN_AGENTS } from '../packages/api/src/domain-agents.ts';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

function readEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  let raw = '';
  try {
    raw = readFileSync(join(root, '.env'), 'utf8');
  } catch {
    return out;
  }
  for (const line of raw.split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && m[1] && m[2] !== undefined) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

async function main() {
  const env = readEnv();
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3001';
  const email = env['INITIAL_ADMIN_EMAIL'];
  const password = env['INITIAL_ADMIN_PASSWORD'];
  const provider = env['DEFAULT_PROVIDER'] ?? 'openai';
  const model = env['DEFAULT_LLM_MODEL'] ?? 'gpt-4o';

  if (!email || !password) {
    throw new Error('INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD not found in .env');
  }

  const login = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!login.ok) throw new Error(`Login failed: ${login.status} ${await login.text()}`);
  const { accessToken } = (await login.json()) as { accessToken: string };
  const auth = { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' };

  const existingRes = await fetch(`${apiUrl}/api/v1/agents`, { headers: auth });
  const existingJson: unknown = existingRes.ok ? await existingRes.json() : [];
  const existing = (
    Array.isArray(existingJson)
      ? existingJson
      : ((existingJson as Record<string, unknown>)['data'] ??
        (existingJson as Record<string, unknown>)['items'] ??
        (existingJson as Record<string, unknown>)['agents'] ??
        [])
  ) as Array<{ name: string }>;
  const existingNames = new Set(existing.map((a) => a.name));

  for (const agent of DOMAIN_AGENTS) {
    if (existingNames.has(agent.name)) {
      console.log(`= exists, skipped: ${agent.name}`);
      continue;
    }
    const res = await fetch(`${apiUrl}/api/v1/agents`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        name: agent.name,
        description: agent.description,
        systemPrompt: agent.systemPrompt,
        role: 'primary',
        provider,
        model,
        maxTokensPerRun: agent.maxTokensPerRun,
        isOfficial: true,
      }),
    });
    if (!res.ok) throw new Error(`Create failed for ${agent.name}: ${res.status} ${await res.text()}`);
    console.log(`+ created: ${agent.name}  [${agent.pack}]`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
