import { Inject, Injectable } from '@nestjs/common';

import { createLogger } from '@clawix/shared';

import { PrismaService } from '../prisma/prisma.service.js';
import { ContainerPoolService } from './container-pool.service.js';
import { ContainerRunner } from './container-runner.js';
import type { IContainerRunner } from './container-runner.js';

const logger = createLogger('engine:agent-run-registry');

/** Container handle attached once a run's container/pool entry is known. */
interface ContainerHandle {
  readonly containerId: string | null;
  readonly sessionId: string | null;
  readonly usePool: boolean;
}

/**
 * Tracks AbortControllers for active agent runs in this process.
 *
 * Single-replica deployment: all running runs hold a controller here.
 * On process restart, controllers are lost; the StaleRunReaperService
 * sweeps orphaned `running` rows after 10 minutes.
 *
 * abort() only requests cancellation — if the run is hung somewhere that
 * doesn't honor the AbortSignal (e.g. a stuck provider call), the run's own
 * cleanup (which releases/stops its container) may never execute. Callers
 * that need a hard guarantee the container is gone — namely the stale-run
 * reaper — should also call forceStopContainer().
 */
@Injectable()
export class AgentRunRegistry {
  private readonly controllers = new Map<string, AbortController>();
  private readonly containers = new Map<string, ContainerHandle>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly containerPool: ContainerPoolService,
    @Inject(ContainerRunner) private readonly containerRunner: IContainerRunner,
  ) {}

  register(agentRunId: string, controller: AbortController): void {
    this.controllers.set(agentRunId, controller);
  }

  unregister(agentRunId: string): void {
    this.controllers.delete(agentRunId);
    this.containers.delete(agentRunId);
  }

  /** Record the container handle for a run, once acquired, so it can be force-stopped later. */
  attachContainer(agentRunId: string, handle: ContainerHandle): void {
    this.containers.set(agentRunId, handle);
  }

  /**
   * Directly stop/evict the container for a run, bypassing the run's own
   * promise chain entirely. Safe to call even if the run is still mid-flight
   * or has already cleaned up itself — both pool eviction and container stop
   * are no-ops when there's nothing left to remove.
   */
  async forceStopContainer(agentRunId: string): Promise<void> {
    const handle = this.containers.get(agentRunId);
    if (handle === undefined) return;

    try {
      if (handle.usePool && handle.sessionId !== null) {
        await this.containerPool.evict(handle.sessionId);
      } else if (handle.containerId !== null) {
        await this.containerRunner.stop(handle.containerId);
      }
    } catch (err: unknown) {
      logger.warn({ agentRunId, err }, 'Failed to force-stop container for stale run');
    } finally {
      this.containers.delete(agentRunId);
    }
  }

  /**
   * Abort the controller for a specific run.
   * Returns true if a controller was found and aborted, false otherwise.
   */
  abort(agentRunId: string, reason: string): boolean {
    const controller = this.controllers.get(agentRunId);
    if (!controller) return false;
    controller.abort(reason);
    return true;
  }

  /**
   * Abort all running agent runs for a user. Fires in-memory aborts for
   * runs registered on this process and writes status='cancelled' to all
   * matching rows (including any that aren't in this process's registry).
   *
   * Uses `WHERE status='running'` to lose the race against a concurrent
   * legitimate completion — runs already in `completed`/`failed`/`cancelled`
   * are not touched.
   */
  async abortAllForUser(userId: string): Promise<{ stopped: number }> {
    const rows = await this.prisma.agentRun.findMany({
      where: { status: 'running', session: { userId } },
      select: { id: true },
    });

    if (rows.length === 0) return { stopped: 0 };

    const ids = rows.map((r) => r.id);

    for (const id of ids) {
      const controller = this.controllers.get(id);
      if (controller) controller.abort('user_stop');
    }

    const result = await this.prisma.agentRun.updateMany({
      where: { id: { in: ids }, status: 'running' },
      data: {
        status: 'cancelled',
        error: 'Stopped by user',
        completedAt: new Date(),
      },
    });

    logger.info({ userId, stopped: result.count }, 'Stopped agent runs for user');
    return { stopped: result.count };
  }
}
