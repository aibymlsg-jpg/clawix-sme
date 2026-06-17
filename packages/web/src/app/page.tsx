import { SmeHeader } from '@/components/landing/sme/header';
import { SmeHero } from '@/components/landing/sme/hero';
import { SmeContextStrip } from '@/components/landing/sme/context-strip';
import { SmeHowItWorks } from '@/components/landing/sme/how-it-works';
import { SmeSectorGrid } from '@/components/landing/sme/sector-grid';
import { SmeAgentShowcase } from '@/components/landing/sme/agent-showcase';
import { SmeSkillsBrowser } from '@/components/landing/sme/skills-browser';
import { SmeTrustSection } from '@/components/landing/sme/trust-section';
import { SmeConversationPreview } from '@/components/landing/sme/conversation-preview';
import { SmeCtaBanner } from '@/components/landing/sme/cta-banner';
import { SmeFooter } from '@/components/landing/sme/footer';

export default function LandingPage() {
  return (
    <div className="brand-sme flex min-h-svh flex-col bg-background text-foreground">
      <SmeHeader />
      <main className="flex-1">
        <SmeHero />
        <SmeContextStrip />
        <SmeHowItWorks />
        <SmeSectorGrid />
        <SmeAgentShowcase />
        <SmeSkillsBrowser />
        <SmeTrustSection />
        <SmeConversationPreview />
        <SmeCtaBanner />
      </main>
      <SmeFooter />
    </div>
  );
}
