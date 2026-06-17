'use client';

/**
 * Compact, themed "how it works" flow diagram + illustration shown at the top of
 * the Create Skill and Create Agent dialogs. Two variants:
 *   - "agent" — the orchestration pipeline a primary agent runs through.
 *   - "skill" — the lifecycle of a skill from authoring to use in a run.
 * Pure presentational; no data deps. Uses the app theme tokens.
 */

import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  FileText,
  MessageSquare,
  Search,
  ShieldCheck,
  UserCheck,
  Workflow,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node {
  icon: LucideIcon;
  title: string;
  sub: string;
  accent: 'amber' | 'jade' | 'coral' | 'blue';
}

const AGENT_NODES: Node[] = [
  { icon: MessageSquare, title: 'You ask', sub: 'plain English', accent: 'blue' },
  { icon: Workflow, title: 'Coordinator', sub: 'plans & routes', accent: 'amber' },
  { icon: Boxes, title: 'Specialists', sub: 'run in parallel', accent: 'amber' },
  { icon: Wrench, title: 'Sub-agents', sub: 'OCR · pricing · …', accent: 'jade' },
  { icon: ShieldCheck, title: 'Review gate', sub: 'human approves', accent: 'coral' },
  { icon: UserCheck, title: 'You act', sub: 'send · post · sign', accent: 'blue' },
];

const SKILL_NODES: Node[] = [
  { icon: FileText, title: 'SKILL.md', sub: 'you author it', accent: 'amber' },
  { icon: Search, title: 'Indexed', sub: 'loader scans', accent: 'jade' },
  { icon: Boxes, title: 'Discovered', sub: 'agent picks it', accent: 'amber' },
  { icon: Workflow, title: 'Composed', sub: 'used in a run', accent: 'jade' },
  { icon: CheckCircle2, title: 'Output', sub: 'draft for review', accent: 'coral' },
];

const ACCENT: Record<Node['accent'], string> = {
  amber: 'text-sme-amber border-sme-amber/40',
  jade: 'text-sme-jade border-sme-jade/40',
  coral: 'text-sme-coral border-sme-coral/40',
  blue: 'text-foreground border-border',
};

function FlowNode({ node }: { node: Node }) {
  const Icon = node.icon;
  return (
    <div className="flex min-w-[84px] flex-col items-center text-center">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-full border bg-card',
          ACCENT[node.accent],
        )}
      >
        <Icon className="size-5" />
      </div>
      <span className="mt-1.5 text-xs font-semibold text-foreground">{node.title}</span>
      <span className="text-[10px] leading-tight text-muted-foreground">{node.sub}</span>
    </div>
  );
}

export function OrchestrationFlow({
  variant,
  className,
}: {
  variant: 'agent' | 'skill';
  className?: string;
}) {
  const nodes = variant === 'agent' ? AGENT_NODES : SKILL_NODES;
  const heading =
    variant === 'agent' ? 'How your agent fits the flow' : 'How a skill flows through a run';
  const blurb =
    variant === 'agent'
      ? 'A coordinator routes the task to specialists and sub-agents, then holds the draft at a human-review gate — agents never act alone.'
      : 'Skills are plain-text capabilities. The loader indexes them; agents discover and compose them in a run; every output waits for your review.';

  return (
    <div
      className={cn(
        'rounded-[var(--radius-card,12px)] border border-border bg-gradient-to-br from-card to-[var(--clr-midnight,#0f1523)] p-4',
        className,
      )}
    >
      <p className="text-sm font-semibold text-foreground">{heading}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{blurb}</p>

      <div className="mt-3 flex flex-wrap items-start gap-x-1 gap-y-3">
        {nodes.map((node, i) => (
          <div key={node.title} className="flex items-start gap-1">
            <FlowNode node={node} />
            {i < nodes.length - 1 && (
              <ArrowRight className="mt-2.5 size-4 shrink-0 text-muted-foreground/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
