'use client';

import { useLanguage } from '@/i18n';
import { agents, orchestrator } from '@/lib/sme-data';

function SkillBadge({ label }: { label: string }) {
  return (
    <span className="rounded-[var(--radius-badge)] border border-border bg-[var(--clr-midnight)] px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
      {label}
    </span>
  );
}

export function SmeAgentShowcase() {
  const { t } = useLanguage();

  return (
    <section id="agents" className="scroll-mt-16 border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('home.sme.agents.heading')}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">{t('home.sme.agents.sub')}</p>
        </div>

        {/* Orchestrator hero card */}
        <div className="mt-12 rounded-[var(--radius-card)] border border-sme-amber/40 bg-gradient-to-br from-card to-[var(--clr-midnight)] p-7">
          <div className="flex items-start gap-4">
            <span className="text-3xl">{orchestrator.emoji}</span>
            <div>
              <h3 className="text-lg font-bold text-foreground">{orchestrator.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{orchestrator.tagline}</p>
              <div className="mt-4">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t('home.sme.agents.orchestratorSkillsLabel')}{' '}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {orchestrator.skills.map((s) => (
                    <SkillBadge key={s} label={s} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-agent grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col rounded-[var(--radius-card)] border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{agent.emoji}</span>
                <h4 className="text-base font-bold text-foreground">{agent.name}</h4>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {agent.does}
              </p>
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t('home.sme.agents.skillsLabel')}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {agent.skills.map((s) => (
                    <SkillBadge key={s} label={s} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
