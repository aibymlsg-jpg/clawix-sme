/**
 * Clawix SME — static showcase data for the marketing landing page.
 *
 * These arrays power the landing sections (sectors, agent showcase, skills
 * browser, hero task stream). They are illustrative product data, intentionally
 * English-only — agent/skill names are brand identifiers, not translatable copy.
 * The live, runnable equivalents ship as Clawix packs under `skills/packs/`.
 */

export type SectorId =
  | 'builder'
  | 'property-agency'
  | 'property-mgmt'
  | 'restaurant'
  | 'accounting';

export interface Sector {
  emoji: string;
  name: string;
  handle: string[];
  /** Live pack id this sector maps to in the dashboard Explore page. */
  agentPack: string;
  accent: string;
}

export const sectors: Sector[] = [
  {
    emoji: '🏗',
    name: 'Small Builders & Contractors',
    handle: [
      'Quote drafting from scope of works',
      'Subcontractor scheduling & reminders',
      'Variation order tracking',
      'Invoice generation & follow-up',
    ],
    agentPack: 'builder',
    accent: 'var(--clr-amber)',
  },
  {
    emoji: '🏠',
    name: 'Property Agency',
    handle: [
      'Listing copy & photo brief',
      'Tenancy agreement drafting',
      'Viewing schedule coordination',
      'Commission & pipeline tracking',
    ],
    agentPack: 'property-agency',
    accent: 'var(--clr-jade)',
  },
  {
    emoji: '🏢',
    name: 'Property Management',
    handle: [
      'Maintenance fault logging & routing',
      'Contractor assignment & follow-up',
      'Tenant communication drafts',
      'Service charge reconciliation',
    ],
    agentPack: 'property-mgmt',
    accent: '#7C9EF5',
  },
  {
    emoji: '🍜',
    name: 'Restaurant & F&B',
    handle: [
      'Daily stock reconciliation',
      'Supplier reorder drafts',
      'Reservation management',
      'Petty cash & daily takings log',
    ],
    agentPack: 'restaurant',
    accent: 'var(--clr-coral)',
  },
  {
    emoji: '📊',
    name: 'Accounting Practice',
    handle: [
      'Journal entry drafting from documents',
      'Bank reconciliation',
      'Month-end close pack',
      'AP/AR aging & collection notes',
    ],
    agentPack: 'fin',
    accent: 'var(--clr-amber)',
  },
];

export interface ShowcaseAgent {
  id: string;
  sector: SectorId;
  emoji: string;
  name: string;
  does: string;
  skills: string[];
}

export const agents: ShowcaseAgent[] = [
  // ── BUILDER PACK ──
  {
    id: 'quoter',
    sector: 'builder',
    emoji: '📋',
    name: 'QuoteCraft',
    does: 'Drafts itemised quotes from your scope of works — materials, labour, margins — ready for your sign-off.',
    skills: ['document-reader', 'pricing-db', 'template-writer'],
  },
  {
    id: 'scheduler',
    sector: 'builder',
    emoji: '📅',
    name: 'SiteSync',
    does: 'Builds subcontractor schedules, sends reminders, and surfaces conflicts before they become delays.',
    skills: ['calendar-mcp', 'sms-notify', 'gantt-builder'],
  },
  {
    id: 'invoice',
    sector: 'builder',
    emoji: '🧾',
    name: 'InvoiceBot',
    does: 'Generates invoices from completed works, chases outstanding payments, and logs receipts.',
    skills: ['template-writer', 'email-drafter', 'ledger-writer'],
  },

  // ── PROPERTY AGENCY PACK ──
  {
    id: 'listing',
    sector: 'property-agency',
    emoji: '✍️',
    name: 'ListingPro',
    does: 'Writes listing copy, recommends photo angles, and prepares the MLS-ready data sheet from your property notes.',
    skills: ['copywriter', 'photo-brief', 'portal-formatter'],
  },
  {
    id: 'tenancy',
    sector: 'property-agency',
    emoji: '📄',
    name: 'TenancyDrafter',
    does: 'Drafts tenancy agreements from standard templates, flags non-standard clauses, and prepares stamp duty notes.',
    skills: ['legal-template', 'clause-checker', 'pdf-builder'],
  },
  {
    id: 'viewing',
    sector: 'property-agency',
    emoji: '🗓',
    name: 'ViewingSync',
    does: 'Coordinates viewing slots, confirms with prospects, and updates your pipeline without double-booking.',
    skills: ['calendar-mcp', 'email-drafter', 'crm-writer'],
  },

  // ── PROPERTY MANAGEMENT PACK ──
  {
    id: 'faultlog',
    sector: 'property-mgmt',
    emoji: '🔧',
    name: 'FaultLogger',
    does: 'Logs maintenance faults, classifies urgency, assigns to the right contractor, and notifies the tenant.',
    skills: ['form-reader', 'urgency-classifier', 'sms-notify'],
  },
  {
    id: 'contractor',
    sector: 'property-mgmt',
    emoji: '🏗',
    name: 'ContractorMatch',
    does: 'Matches faults to your approved contractor list, drafts the work order, and follows up on completion.',
    skills: ['contractor-db', 'email-drafter', 'work-order-writer'],
  },
  {
    id: 'servicecharge',
    sector: 'property-mgmt',
    emoji: '💰',
    name: 'ChargeReconciler',
    does: 'Reconciles service charge receipts against budgets, flags shortfalls, and drafts the annual statement.',
    skills: ['ledger-reader', 'reconciler', 'report-builder'],
  },

  // ── RESTAURANT PACK ──
  {
    id: 'stock',
    sector: 'restaurant',
    emoji: '📦',
    name: 'StockSense',
    does: 'Reads your POS and delivery notes, computes daily variance, and flags what to reorder before you run out.',
    skills: ['pos-reader', 'stock-calc', 'reorder-drafter'],
  },
  {
    id: 'supplier',
    sector: 'restaurant',
    emoji: '🚚',
    name: 'SupplierRelay',
    does: 'Drafts reorder messages to each supplier in their preferred format — WhatsApp, email, or fax template.',
    skills: ['email-drafter', 'whatsapp-notify', 'supplier-db'],
  },
  {
    id: 'reservation',
    sector: 'restaurant',
    emoji: '🍽',
    name: 'TableSync',
    does: 'Manages reservations, sends confirmation messages, and updates the floor plan without clashes.',
    skills: ['calendar-mcp', 'sms-notify', 'floor-planner'],
  },

  // ── ACCOUNTING PACK ──
  {
    id: 'bookkeeping',
    sector: 'accounting',
    emoji: '📚',
    name: 'BookBot',
    does: 'Drafts journal entries from invoices, receipts, and bank lines — coded to your chart of accounts.',
    skills: ['ocr-reader', 'gl-coder', 'journal-writer'],
  },
  {
    id: 'reconciler',
    sector: 'accounting',
    emoji: '🔁',
    name: 'Reconciler',
    does: 'Matches bank transactions to ledger entries, flags unmatched lines, and builds the reconciliation schedule.',
    skills: ['bank-reader', 'ledger-reader', 'match-engine'],
  },
  {
    id: 'reporter',
    sector: 'accounting',
    emoji: '📊',
    name: 'CloseBuilder',
    does: 'Assembles the month-end pack — trial balance, P&L, and cash-flow — with every figure traced to a source.',
    skills: ['report-builder', 'tb-compiler', 'pdf-builder'],
  },
];

export const orchestrator = {
  emoji: '🧠',
  name: 'NEXUS · SME Orchestrator',
  tagline:
    'Reads your intent → plans the work → routes to specialists → assembles the draft → holds for your review.',
  skills: [
    'intent-parsing',
    'task-routing',
    'confidence-scoring',
    'source-tracing',
    'HITL gate management',
  ],
};

export type SkillCategory = 'documents' | 'communication' | 'finance' | 'calendar' | 'notify';

export interface Skill {
  emoji: string;
  name: string;
  category: SkillCategory;
}

export const skills: Skill[] = [
  { emoji: '📄', name: 'document-reader', category: 'documents' },
  { emoji: '🔍', name: 'ocr-reader', category: 'documents' },
  { emoji: '📋', name: 'template-writer', category: 'documents' },
  { emoji: '⚖️', name: 'clause-checker', category: 'documents' },
  { emoji: '✉️', name: 'email-drafter', category: 'communication' },
  { emoji: '📱', name: 'sms-notify', category: 'notify' },
  { emoji: '💬', name: 'whatsapp-notify', category: 'notify' },
  { emoji: '🔔', name: 'portal-formatter', category: 'communication' },
  { emoji: '📊', name: 'report-builder', category: 'finance' },
  { emoji: '🔁', name: 'reconciler', category: 'finance' },
  { emoji: '🗂', name: 'ledger-reader', category: 'finance' },
  { emoji: '🧮', name: 'stock-calc', category: 'finance' },
  { emoji: '📅', name: 'calendar-mcp', category: 'calendar' },
  { emoji: '🗓', name: 'gantt-builder', category: 'calendar' },
  { emoji: '🍽', name: 'floor-planner', category: 'calendar' },
];

/** Hero "live task stream" rotating scenarios. */
export interface HeroScenario {
  label: string;
  request: string;
  rows: { agent: string; task: string; status: 'done' | 'running' | 'queued' }[];
  confidence: 'High' | 'Medium' | 'Low';
}

export const heroScenarios: HeroScenario[] = [
  {
    label: '🏗 Builder · Quote',
    request: 'Draft the quote for the Kowloon Tong renovation — materials, labour, margin.',
    rows: [
      { agent: 'quoting', task: 'material costs', status: 'done' },
      { agent: 'quoting', task: 'labour schedule', status: 'done' },
      { agent: 'quoting', task: 'margin check', status: 'running' },
      { agent: 'quote-renderer', task: 'assemble draft', status: 'queued' },
    ],
    confidence: 'Medium',
  },
  {
    label: '🏠 Property Agency · Listing',
    request: 'Prepare the listing for Unit 12B, photos sorted, tenancy terms drafted.',
    rows: [
      { agent: 'listing-writer', task: 'draft copy', status: 'done' },
      { agent: 'photo-brief', task: 'shot list', status: 'done' },
      { agent: 'tenancy-drafter', task: 'draft terms', status: 'running' },
      { agent: 'portal-formatter', task: 'format sheet', status: 'queued' },
    ],
    confidence: 'High',
  },
  {
    label: '🏢 Property Mgmt · Maintenance',
    request: 'Log the plumbing fault at Block C, assign contractor, notify tenant.',
    rows: [
      { agent: 'fault-logger', task: 'log + classify', status: 'done' },
      { agent: 'contractor-match', task: 'assign vendor', status: 'done' },
      { agent: 'tenant-notify', task: 'draft notice', status: 'running' },
      { agent: 'deadline-watcher', task: 'set follow-up', status: 'queued' },
    ],
    confidence: 'High',
  },
  {
    label: '🍜 Restaurant · Orders',
    request: "Reconcile today's orders with stock, flag what to reorder before Saturday.",
    rows: [
      { agent: 'pos-reader', task: 'read takings', status: 'done' },
      { agent: 'stock-check', task: 'compute variance', status: 'done' },
      { agent: 'reorder-draft', task: 'draft orders', status: 'running' },
      { agent: 'supplier-relay', task: 'queue messages', status: 'queued' },
    ],
    confidence: 'Medium',
  },
  {
    label: '📊 Accounting · Month-end',
    request: 'Close April — draft the entries, reconcile the bank, build the pack.',
    rows: [
      { agent: 'bookkeeping', task: 'draft entries', status: 'done' },
      { agent: 'reconciliation', task: 'match bank', status: 'done' },
      { agent: 'reporting', task: 'build pack', status: 'running' },
      { agent: 'close-builder', task: 'trace figures', status: 'queued' },
    ],
    confidence: 'Medium',
  },
];
