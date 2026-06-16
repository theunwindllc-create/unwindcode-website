import type { MirrorMotionCell } from '@/components/mirror/MirrorChapterMotion.client';
import { infinityMirrorAssets } from './infinityMirrorAssets';

type MirrorChapter = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  cells: readonly MirrorMotionCell[];
};

export type DesireTranslationRoute = {
  id: string;
  label: string;
  title: string;
  description: string;
  organismRoute: string;
  proofGate: string;
  authorityStop: string;
};

export type ScrollChoreographyAct = {
  id: string;
  label: string;
  title: string;
  focus: string;
  motion: string;
  proofReturn: string;
};

export type InfinitySymbolState = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type MotionContract = {
  id: string;
  label: string;
  title: string;
  trigger: string;
  animation: string;
  timing: string;
  duration: string;
  easing: string;
  performance: string;
};

export type BrainCellNode = {
  id: string;
  label: string;
  title: string;
  signal: string;
  path: string;
  proof: string;
  authorityStop: string;
};

export type BrainRouteField = 'signal' | 'cells' | 'authority' | 'proof';

export type RecursiveBrainTunnelStep = {
  id: string;
  index: string;
  title: string;
  description: string;
  cell: string;
};

export type BrainRouteStage = {
  id: BrainRouteField;
  index: string;
  title: string;
  stateLabel: string;
};

export type BrainSignalHandoffPacket = {
  id: string;
  tab: string;
  tabDescription: string;
  signal: string;
  cells: string;
  authority: string;
  proof: string;
};

export type OrganismVisualizerNode = {
  id: string;
  label: string;
  title: string;
  href: string;
  signal: string;
  memory: string;
  authority: string;
  proof: string;
};

export type RecursiveGrowthGate = {
  id: string;
  index: string;
  title: string;
  signal: string;
  verification: string;
  authorityStop: string;
};

export type CognitiveEvolutionTraceStep = {
  id: string;
  index: string;
  title: string;
  evolves: string;
  proofLock: string;
};

export type ArchitectureMapPane = {
  id: string;
  index: string;
  title: string;
  route: string;
  proves: string;
  boundary: string;
};

export type ProofCascadeStep = {
  id: string;
  index: string;
  title: string;
  claim: string;
  evidence: string;
  artifact: string;
  boundary: string;
};

export type PhaseProofLedgerEntry = {
  id: string;
  label: string;
  title: string;
  evidence: string;
  surfaceLabel: string;
  surfaceHref: string;
  boundary: string;
};

export type MirrorStoryAnchor = {
  id: string;
  index: string;
  title: string;
  href: string;
  focus: string;
};

export type MirrorStateSequencerPacket = {
  id: string;
  index: string;
  tab: string;
  href: string;
  signal: string;
  response: string;
  proof: string;
  boundary: string;
  linkLabel: string;
};

export type ReflectionNavigatorLens = {
  id: string;
  title: string;
  route: string;
  proof: string;
  boundary: string;
};

export type EvolutionEntryProtocolStep = {
  id: string;
  label: string;
  title: string;
  input: string;
  proofOutput: string;
};

export type JoinEvolutionRoute = {
  role: string;
  title: string;
  next: string;
  proof: string;
  boundary: string;
  href: string;
};

export type FirstArtifactRoute = {
  id: string;
  label: string;
  title: string;
  bring: string;
  firstArtifact: string;
  proofRoute: string;
  approvalBoundary: string;
  href: string;
  cta: string;
};

export type MirrorRouteCompassEntry = {
  id: string;
  label: string;
  title: string;
  description: string;
  chapter: string;
  proofReturn: string;
  authorityStop: string;
  href: string;
  cta: string;
};

export type MirrorSignalPacket = {
  id: string;
  tab: string;
  tabDescription: string;
  signal: string;
  lens: string;
  artifact: string;
  boundary: string;
  proofPath: string;
  brainCells: string;
  authorityLock: string;
};

export type MemoryConsentState = {
  id: string;
  label: string;
  title: string;
  canHold: string;
  proofRequired: string;
  humanControl: string;
};

export type MirrorEmotionalProgressionPacket = {
  id: string;
  tab: string;
  tabDescription: string;
  feeling: string;
  organism: string;
  proof: string;
  boundary: string;
};

export type MirrorProofObservatoryPacket = {
  id: string;
  tab: string;
  tabDescription: string;
  evidence: string;
  signal: string;
  boundary: string;
  href: string;
  linkLabel: string;
};

export type AuthorityGradientRung = {
  id: string;
  label: string;
  title: string;
  canDo: string;
  proofRequired: string;
};

export type AdaptiveMirrorLens = {
  id: string;
  label: string;
  description: string;
  capture: string;
  translate: string;
  keep: string;
  boundary: string;
};

export type MirrorShellRule = {
  id: string;
  index: string;
  label: string;
  title: string;
  description: string;
};

export type MirrorProductLoopStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type ReturnedArtifactField = {
  id: string;
  label: string;
  value: string;
};

export type ArtifactRepairStep = {
  id: string;
  index: string;
  description: string;
};

export type MirrorDescentStage = {
  id: string;
  index: string;
  title: string;
  description: string;
  boundary: string;
};

export type ExperienceAuditLens = {
  id: string;
  index: string;
  title: string;
  purpose: string;
  works: string;
  reinterpret: string;
};

export type SourceTranslationLedgerEntry = {
  id: string;
  label: string;
  sourcePattern: string;
  unwindTranslation: string;
  boundary: string;
};

export type EngineTranslationLedgerEntry = {
  id: string;
  label: string;
  concept: string;
  decision: 'adopt_now' | 'prototype_next' | 'block_until_proof';
  translation: string;
  guard: string;
};

export type InterfaceBuildStage = {
  id: string;
  label: string;
  title: string;
  description: string;
  artifact: string;
  boundary: string;
};

export type RuntimeHandoffLane = {
  id: string;
  label: string;
  owner: string;
  job: string;
  fallback: string;
  stopCondition: string;
};

export type MirrorDepthGateLane = {
  id: string;
  label: string;
  title: string;
  trigger: string;
  allowed: string;
  proofNeeded: string;
  fallback: string;
  killSwitch: string;
};

export const mirrorChapters = [
  {
    id: 'mirror-reflection-title',
    kicker: '02 / Reflection',
    title: 'Traditional software answers. AI organisms metabolize.',
    description:
      'The comparison is not app versus app. It is static interface versus living loop: signal, memory, cells, immune boundary, proof.',
    cells: [
      { id: 'traditional', label: 'Traditional', proof: 'Feature waits for command.', boundary: 'State is local and brittle.' },
      { id: 'organism', label: 'Organism', proof: 'Signal routes through a proof loop.', boundary: 'Authority stays visible.' },
      { id: 'memory', label: 'Memory', proof: 'Context survives only when reviewed.', boundary: 'No hidden identity claims.' },
      { id: 'artifact', label: 'Artifact', proof: 'Every reflection returns something inspectable.', boundary: 'Human keeps, corrects, or refuses.' },
    ],
  },
  {
    id: 'mirror-brain-title',
    kicker: '03 / The Brain',
    title: 'Brain cells specialize without becoming a black box.',
    description:
      'A visitor should see the living intelligence route: signal enters, cells compete, immune gates constrain, proof exits.',
    cells: [
      { id: 'gateway', label: 'Gateway', proof: 'Intake becomes typed signal.', boundary: 'No risky action starts here.' },
      { id: 'cortex', label: 'Cortex', proof: 'Reasoning chooses a route.', boundary: 'Claims remain provisional.' },
      { id: 'cells', label: 'Cells', proof: 'Specialists do narrow work.', boundary: 'Generated capability is sandboxed.' },
      { id: 'proof', label: 'Proof', proof: 'Result leaves tests and metadata.', boundary: 'Deployment waits for approval.' },
    ],
  },
  {
    id: 'mirror-organisms-title',
    kicker: '04 / Organisms',
    title: 'The ecosystem becomes understandable as product paths.',
    description:
      'Visual Cortex, Infinity Mirror, Financial Organisms, and Research Organisms share one spine but expose different proof routes.',
    cells: [
      { id: 'visual', label: 'Visual Cortex', proof: 'Turns strategy into reviewable media packets.', boundary: 'Publishing remains human-gated.' },
      { id: 'mirror', label: 'Infinity Mirror', proof: 'Turns reflection into a returned artifact.', boundary: 'No therapy or identity authority.' },
      { id: 'financial', label: 'Financial Organism', proof: 'Simulates Web3 trust before motion.', boundary: 'No transaction without approval.' },
      { id: 'research', label: 'Research Organisms', proof: 'Convert complexity into inspectable maps.', boundary: 'Speculation is labeled.' },
    ],
  },
  {
    id: 'mirror-growth-title',
    kicker: '05 / Recursive Growth',
    title: 'Capability grows only through proof.',
    description:
      'Recursive intelligence is not a magic loop. It is a sequence of candidate, sandbox, approval, integration, and public evidence.',
    cells: [
      { id: 'pattern', label: 'Pattern', proof: 'A repeated need becomes a candidate.', boundary: 'No new authority yet.' },
      { id: 'sandbox', label: 'Sandbox', proof: 'The candidate runs away from production.', boundary: 'Host effects are blocked.' },
      { id: 'approval', label: 'Approval', proof: 'Human reviews the risky edge.', boundary: 'Money, files, posting, and broadcast pause.' },
      { id: 'integration', label: 'Integration', proof: 'Passing cells become durable routes.', boundary: 'Tests and docs move together.' },
    ],
  },
] satisfies readonly MirrorChapter[];

export const mirrorStoryAnchors = [
  {
    id: 'mirror',
    index: '01',
    title: 'The Mirror',
    href: '#mirror-experience-hero',
    focus: 'The question enters a threshold that names signal, proof, and authority.',
  },
  {
    id: 'reflection',
    index: '02',
    title: 'Reflection',
    href: '#mirror-reflection-title',
    focus: 'Traditional software becomes a comparison against living organism loops.',
  },
  {
    id: 'brain',
    index: '03',
    title: 'The Brain',
    href: '#mirror-brain-title',
    focus: 'Gateway, cortex, memory, immune, and proof cells make routing visible.',
  },
  {
    id: 'organisms',
    index: '04',
    title: 'Organisms',
    href: '#mirror-organisms-title',
    focus: 'Product paths share one governed spine instead of becoming disconnected apps.',
  },
  {
    id: 'growth',
    index: '05',
    title: 'Recursive Growth',
    href: '#mirror-growth-title',
    focus: 'Capability expands only through pattern, sandbox, approval, integration, and proof.',
  },
  {
    id: 'proof',
    index: '06',
    title: 'Proof',
    href: '#mirror-proof-routes-title',
    focus: 'Architecture, metrics, deployments, and status replace vague trust.',
  },
  {
    id: 'join',
    index: '07',
    title: 'Join Evolution',
    href: '#mirror-join-title',
    focus: 'Builders, investors, researchers, and partners choose bounded next routes.',
  },
] satisfies readonly MirrorStoryAnchor[];

export const mirrorStateSequencerPackets = [
  {
    id: 'mirror',
    index: '01',
    tab: 'Mirror',
    href: '#mirror-question-title',
    signal: 'A question enters the reflective threshold.',
    response: 'Gateway listens before any cell claims work.',
    proof: 'The threshold readout names signal, boundary, and proof.',
    boundary: 'No authority grows before evidence is visible.',
    linkLabel: 'Open Mirror chapter',
  },
  {
    id: 'reflection',
    index: '02',
    tab: 'Reflect',
    href: '#mirror-reflection-title',
    signal: 'The visitor compares app flow with organism continuity.',
    response: 'Memory, context, and authority boundaries become visible.',
    proof: 'The reflection plane turns command into state, context, boundary, and proof.',
    boundary: 'The mirror reflects structure; it does not claim identity.',
    linkLabel: 'Open Reflection chapter',
  },
  {
    id: 'brain',
    index: '03',
    tab: 'Brain',
    href: '#mirror-brain-title',
    signal: 'A signal moves from question into the Brain route.',
    response: 'Gateway, Cortex, Memory, Immune Gate, Cells, and Proof Loop take roles.',
    proof: 'Tunnel, cell network, route console, and handoff show the path.',
    boundary: 'Generated capability stays inert until tests and approval.',
    linkLabel: 'Open Brain chapter',
  },
  {
    id: 'organisms',
    index: '04',
    tab: 'Organisms',
    href: '#mirror-organisms-title',
    signal: 'The single brain becomes product paths.',
    response: 'Visual Cortex, Infinity Mirror, Financial Organism, and Research Organisms share a governed spine.',
    proof: 'Each organism names route, memory, authority stop, and proof.',
    boundary: 'No hidden spend, broadcast, posting, or public commitment.',
    linkLabel: 'Open Organisms chapter',
  },
  {
    id: 'growth',
    index: '05',
    tab: 'Growth',
    href: '#mirror-growth-title',
    signal: 'A repeated failure or pattern asks for a new cell.',
    response: 'Pattern, candidate, sandbox, approval, integration, and proof form the loop.',
    proof: 'Growth gates show verification before capability joins.',
    boundary: 'No self-evolution enters production without tests and human approval.',
    linkLabel: 'Open Recursive Growth chapter',
  },
  {
    id: 'proof',
    index: '06',
    tab: 'Proof',
    href: '#mirror-proof-title',
    signal: 'Wonder asks for evidence.',
    response: 'Architecture, metrics, deployments, status, sources, and handoff files become inspectable.',
    proof: 'The observatory and ledgers route every claim to an artifact.',
    boundary: 'Claims freeze when the evidence path is missing.',
    linkLabel: 'Open Proof chapter',
  },
  {
    id: 'join',
    index: '07',
    tab: 'Join',
    href: '#mirror-join-title',
    signal: 'A visitor chooses why they came.',
    response: 'Builder, investor, researcher, and partner paths split by proof need.',
    proof: 'Each doorway names next artifact, owner, and boundary.',
    boundary: 'Collaboration starts with scope and consent, not hidden authority.',
    linkLabel: 'Open Join chapter',
  },
] satisfies readonly MirrorStateSequencerPacket[];

export const reflectionNavigatorLenses = [
  {
    id: 'human-signal',
    title: 'Human Signal',
    route: 'Desire -> organism path',
    proof: 'Source-backed desire translation before product promise.',
    boundary: 'No fake quotes, hidden persona, or identity verdict.',
  },
  {
    id: 'brain-route',
    title: 'Brain Route',
    route: 'Signal -> cells -> immune gate',
    proof: 'Brain network and route console expose how action is chosen.',
    boundary: 'No risky action starts silently.',
  },
  {
    id: 'proof-route',
    title: 'Proof Route',
    route: 'Claim -> evidence -> artifact',
    proof: 'Architecture maps and proof cascade return inspectable evidence.',
    boundary: 'Ambition stays separate from capability.',
  },
  {
    id: 'build-route',
    title: 'Build Route',
    route: 'Role -> next action',
    proof: 'Builder, investor, researcher, and partner paths name a concrete artifact.',
    boundary: 'Conversion remains explicit and human-owned.',
  },
] satisfies readonly ReflectionNavigatorLens[];

export const adaptiveMirrorLenses = [
  {
    id: 'architect',
    label: 'Architect',
    description: 'Turns feeling into a structured readout.',
    capture: 'Name the raw signal and where it is putting pressure on the system.',
    translate: 'Separate structure, missing component, proof gate, and next slice.',
    keep: 'Return a plan the human can accept, correct, or refuse.',
    boundary: 'Structure is not identity authority.',
  },
  {
    id: 'cartographer',
    label: 'Cartographer',
    description: 'Turns recurrence into a signal map.',
    capture: 'Locate repeated patterns without pretending the map is the person.',
    translate: 'Trace signal, memory, route, friction, and next inspection point.',
    keep: 'Return a map with uncertainty labels and a deletion path.',
    boundary: 'No hidden memory geography or private-life inference.',
  },
  {
    id: 'translator',
    label: 'Translator',
    description: 'Turns confusion into language the user can answer.',
    capture: 'Listen for the phrase that needs to become clearer.',
    translate: 'Rewrite the signal into one question, one assumption, and one next word.',
    keep: 'Return language that can be kept, edited, or discarded.',
    boundary: 'No diagnosis, identity verdict, or forced interpretation.',
  },
  {
    id: 'ritualist',
    label: 'Ritualist',
    description: 'Turns insight into one grounded practice.',
    capture: 'Find the smallest human-owned action that lowers pressure.',
    translate: 'Convert insight into a practice, pause, or quiet-listen state.',
    keep: 'Return one repeatable move with no pressure to store it.',
    boundary: 'Listening can be complete without artifact or growth claim.',
  },
] satisfies readonly AdaptiveMirrorLens[];

export const signalComposerPackets = [
  {
    id: 'mental-room',
    tab: 'Mental room',
    tabDescription: 'I need the next question to feel calmer.',
    signal: 'Mental room request',
    lens: 'Translator + Ritualist',
    artifact: 'One calmer question, one grounded next action, and no hidden memory update.',
    boundary: 'No diagnosis, no identity claim, no forced growth label.',
    proofPath: 'Question, assumption, boundary, and review choice are named.',
    brainCells: 'Gateway, Memory, Reflection, Pattern, Proof',
    authorityLock: 'No diagnosis or identity label can enter memory.',
  },
  {
    id: 'build-stuck',
    tab: 'Build stuck',
    tabDescription: 'I need a path from idea to artifact.',
    signal: 'Build stuck request',
    lens: 'Architect + Cartographer',
    artifact: 'A build path with route, cell, proof requirement, and first safe slice.',
    boundary: 'No code execution, file write, or deployment is implied by this demo.',
    proofPath: 'Implementation path stays local until tests and human approval pass.',
    brainCells: 'Gateway, Cortex, Reflection, Immune, Proof',
    authorityLock: 'Files, code execution, deployments, and spend remain approval-gated.',
  },
  {
    id: 'trust-proof',
    tab: 'Trust proof',
    tabDescription: 'I need evidence before I believe the system.',
    signal: 'Trust proof request',
    lens: 'Cartographer + Architect',
    artifact: 'A claim-to-proof route that names source, status, boundary, and next evidence.',
    boundary: 'If the claim lacks an artifact, the mirror must say so.',
    proofPath: 'Architecture, tests, metadata, deployment status, or transmission record.',
    brainCells: 'Gateway, Cortex, Memory, Pattern, Immune, Proof',
    authorityLock: 'Claims freeze until an inspectable artifact exists.',
  },
  {
    id: 'quiet-listen',
    tab: 'Quiet listen',
    tabDescription: 'I need the mirror to hold the session without tagging me.',
    signal: 'Quiet listen request',
    lens: 'Ritualist',
    artifact: 'Listening mode stays valid: no tag, no artifact, no growth claim unless requested.',
    boundary: 'Refusal remains a product path, not a failure state.',
    proofPath: 'No artifact is stored unless the person asks for one.',
    brainCells: 'Gateway, Reflection, Immune, Proof',
    authorityLock: 'Listening can be complete without memory, label, or growth claim.',
  },
] satisfies readonly MirrorSignalPacket[];

export const memoryConsentStates = [
  {
    id: 'ephemeral',
    label: '01 / Ephemeral',
    title: 'Session-only reflection',
    canHold: 'Visible prompt context while the session is open.',
    proofRequired: 'The interface says nothing will be stored.',
    humanControl: 'Close the loop with no artifact and no growth claim.',
  },
  {
    id: 'proposed',
    label: '02 / Proposed',
    title: 'Artifact asks to be kept',
    canHold: 'Signal, lens, assumption, boundary, and proof path.',
    proofRequired: 'The returned artifact is reviewable before memory accepts it.',
    humanControl: 'Keep, correct, deepen, or refuse the artifact.',
  },
  {
    id: 'reviewed',
    label: '03 / Reviewed',
    title: 'Corrected memory map',
    canHold: 'Only the human-approved pattern note and its correction trail.',
    proofRequired: 'Repair ledger shows what changed and why.',
    humanControl: 'Edit, delete, or demote the memory back to session-only.',
  },
  {
    id: 'integrated',
    label: '04 / Integrated',
    title: 'Future loop may reference it',
    canHold: 'A bounded continuity note connected to a proof artifact.',
    proofRequired: 'Every future use cites the memory surface, not hidden intuition.',
    humanControl: 'Revoke, archive, or split the memory before it influences another route.',
  },
] satisfies readonly MemoryConsentState[];

export const recursiveBrainTunnelSteps = [
  {
    id: 'signal',
    index: '01',
    title: 'Signal dives',
    description: 'A visitor question enters as context instead of vanishing into a prompt box.',
    cell: 'Gateway intake',
  },
  {
    id: 'cells',
    index: '02',
    title: 'Cells wake',
    description: 'Gateway, cortex, memory, immune, and proof roles light in sequence.',
    cell: 'Cortex route',
  },
  {
    id: 'boundary',
    index: '03',
    title: 'Boundary holds',
    description: 'Identity, money, files, publishing, and Web3 motion remain outside the automatic path.',
    cell: 'Immune gate',
  },
  {
    id: 'proof',
    index: '04',
    title: 'Proof resurfaces',
    description: 'The route exits with assumptions, limits, status, and the next artifact.',
    cell: 'Proof loop',
  },
] satisfies readonly RecursiveBrainTunnelStep[];

export const brainRouteStages = [
  {
    id: 'signal',
    index: '01',
    title: 'Signal enters',
    stateLabel: 'Signal',
  },
  {
    id: 'cells',
    index: '02',
    title: 'Cells are chosen',
    stateLabel: 'Cells',
  },
  {
    id: 'authority',
    index: '03',
    title: 'Authority is checked',
    stateLabel: 'Boundary',
  },
  {
    id: 'proof',
    index: '04',
    title: 'Proof returns',
    stateLabel: 'Proof',
  },
] satisfies readonly BrainRouteStage[];

export const brainSignalHandoffPackets = [
  {
    id: 'mental-room',
    tab: 'Mental room',
    tabDescription: 'Calm before advice.',
    signal: 'Calm the room before advice.',
    cells: 'Gateway, Memory, Reflection, Pattern, Proof',
    authority: 'No diagnosis or identity label can enter memory.',
    proof: 'One reviewed question and one human-owned next move.',
  },
  {
    id: 'build-stuck',
    tab: 'Build stuck',
    tabDescription: 'Idea into route.',
    signal: 'Translate the idea into a first build route.',
    cells: 'Gateway, Cortex, Reflection, Immune, Proof',
    authority: 'Files, code execution, deployments, and spend remain approval-gated.',
    proof: 'Return the smallest safe slice, required tests, and owner decision.',
  },
  {
    id: 'trust-proof',
    tab: 'Trust proof',
    tabDescription: 'Belief through evidence.',
    signal: 'Route belief through evidence before persuasion.',
    cells: 'Gateway, Cortex, Memory, Pattern, Immune, Proof',
    authority: 'Claims freeze until an inspectable artifact exists.',
    proof: 'Return source, status, missing evidence, and next inspection route.',
  },
  {
    id: 'quiet-listen',
    tab: 'Quiet listen',
    tabDescription: 'No profile needed.',
    signal: 'Hold the session without turning it into a profile.',
    cells: 'Gateway, Reflection, Immune, Proof',
    authority: 'Listening can be complete without memory, label, or growth claim.',
    proof: 'Return no stored artifact unless the human asks for one.',
  },
] satisfies readonly BrainSignalHandoffPacket[];

export const defaultBrainSignalHandoff = brainSignalHandoffPackets[0];

export const mirrorShellRules = [
  {
    id: 'constant',
    index: '01',
    label: 'Constant',
    title: 'One surface, many states.',
    description: 'The visitor always knows they are inside the same organism, even as the route changes.',
  },
  {
    id: 'growth',
    index: '02',
    label: 'Phase',
    title: 'Growth is maturity evidence.',
    description: 'Seed, reflection, pattern, and proof are capability states backed by tests and review.',
  },
  {
    id: 'prompt',
    index: '03',
    label: 'Question',
    title: 'Prompts reduce pressure.',
    description: 'The mirror asks clearer questions before it generates stronger claims.',
  },
  {
    id: 'artifact',
    index: '04',
    label: 'Review',
    title: 'Artifact before acceptance.',
    description: 'Nothing becomes memory, proof, or public motion until the returned object can be inspected.',
  },
] satisfies readonly MirrorShellRule[];

export const mirrorProductLoopSteps = [
  {
    id: 'listen',
    index: '01',
    title: 'Talk or capture',
    description: 'A raw signal can enter as text, voice, or quiet listening without forcing a label.',
  },
  {
    id: 'translate',
    index: '02',
    title: 'Lens translates',
    description: 'Architect, Cartographer, Translator, or Ritualist frames the same signal without taking final authority.',
  },
  {
    id: 'map',
    index: '03',
    title: 'Map remembers',
    description: 'Recurrence becomes topography, constellation, river, or garden only after the user accepts the meaning.',
  },
  {
    id: 'artifact',
    index: '04',
    title: 'Artifact returns',
    description: 'The mirror returns pattern, belief, reframe, question, and ritual as a reviewable object.',
  },
] satisfies readonly MirrorProductLoopStep[];

export const artifactDecisionLabels = ['Keep', 'Refuse', 'Deepen', 'Ritual'] as const;

export const returnedArtifactFields = [
  {
    id: 'signal',
    label: 'signal_in',
    value: 'I need continuity without hidden authority.',
  },
  {
    id: 'lens',
    label: 'lens',
    value: 'Architect + Cartographer',
  },
  {
    id: 'map',
    label: 'memory_map',
    value: 'Context, recurrence, friction, next safe move.',
  },
  {
    id: 'boundary',
    label: 'boundary_lock',
    value: 'Care, identity, money, files, and public motion stay human-led.',
  },
  {
    id: 'proof',
    label: 'proof_path',
    value: 'Assumptions, route, status, and evidence are named.',
  },
] satisfies readonly ReturnedArtifactField[];

export const artifactRepairSteps = [
  {
    id: 'assumption',
    index: '01',
    description: 'Name the assumption that broke.',
  },
  {
    id: 'owner',
    index: '02',
    description: 'Ask the human to keep, correct, or close.',
  },
  {
    id: 'memory',
    index: '03',
    description: 'Store only the reviewed artifact.',
  },
] satisfies readonly ArtifactRepairStep[];

export const mirrorDescentStages = [
  {
    id: 'self',
    index: '01',
    title: 'Self enters',
    description: 'The visitor sees the request as state, not as a command vanishing into a prompt.',
    boundary: 'State is not identity truth.',
  },
  {
    id: 'memory',
    index: '02',
    title: 'Memory appears',
    description: 'Continuity becomes visible while the mirror keeps uncertainty and consent in view.',
    boundary: 'No hidden memory writes.',
  },
  {
    id: 'split',
    index: '03',
    title: 'Decision splits',
    description: 'Possible routes branch before any one lens pretends to be final.',
    boundary: 'Lens choice stays reversible.',
  },
  {
    id: 'lattice',
    index: '04',
    title: 'Lattice connects',
    description: 'Cells, memories, and proof paths connect into a map the human can inspect.',
    boundary: 'Map remains inspectable, not private authority.',
  },
  {
    id: 'current',
    index: '05',
    title: 'Current moves',
    description: 'The organism can recommend the next move, but risky execution stays outside the automatic current.',
    boundary: 'Files, spending, and publishing pause.',
  },
  {
    id: 'evolve',
    index: '06',
    title: 'Evolution proposes',
    description: 'New capability remains a candidate until sandbox, review, and approval make it real.',
    boundary: 'Candidate cells have no production authority.',
  },
  {
    id: 'return',
    index: '07',
    title: 'Proof returns',
    description: 'The loop exits with a route, a boundary, and an artifact the visitor can question.',
    boundary: 'Proof can be challenged before memory accepts it.',
  },
] satisfies readonly MirrorDescentStage[];

export const brainCellNetworkNodes = [
  {
    id: 'gateway',
    label: '01 / Gateway',
    title: 'Signal intake',
    signal: 'Raw question becomes a typed request with intent, risk, and next route.',
    path: 'Intake -> classify -> hand to cortex.',
    proof: 'Request packet names source, owner, and requested artifact.',
    authorityStop: 'No file, money, posting, or broadcast action can start here.',
  },
  {
    id: 'cortex',
    label: '02 / Cortex',
    title: 'Route decision',
    signal: 'The Brain chooses the narrowest useful cell instead of pretending one model is the whole organism.',
    path: 'Reason -> choose cell -> expose assumption.',
    proof: 'The selected route names why this cell is allowed to act.',
    authorityStop: 'Claims remain provisional until evidence returns.',
  },
  {
    id: 'memory',
    label: '03 / Memory',
    title: 'Context boundary',
    signal: 'Only reviewed context enters the run, and every durable memory needs an owner.',
    path: 'Retrieve -> cite -> update only after review.',
    proof: 'Saved context has source, timestamp, and deletion path.',
    authorityStop: 'No hidden identity, private-life inference, or silent persistence.',
  },
  {
    id: 'cells',
    label: '04 / Cells',
    title: 'Specialist work',
    signal: 'Visual, research, finance, reflection, and code cells each do one bounded job.',
    path: 'Execute narrow task -> return packet.',
    proof: 'Every cell returns artifact, status, test, or refusal reason.',
    authorityStop: 'Generated capability stays sandboxed until it proves itself.',
  },
  {
    id: 'immune',
    label: '05 / Immune gate',
    title: 'Risk pause',
    signal: 'The organism detects risky edges before action becomes external.',
    path: 'Scan -> pause -> request approval.',
    proof: 'Approval packet explains command, destination, data, and risk.',
    authorityStop: 'Money, filesystem mutation, public posting, and broadcast wait for the creator.',
  },
  {
    id: 'proof',
    label: '06 / Proof loop',
    title: 'Returned evidence',
    signal: 'The result leaves traces that another human or machine can inspect.',
    path: 'Artifact -> tests -> metadata -> release gate.',
    proof: 'Verification, schema, discovery files, and visible status move together.',
    authorityStop: 'Deployment, aliasing, and publication remain explicit human checkpoints.',
  },
] satisfies readonly BrainCellNode[];

export const livingOrganismNodes = [
  {
    id: 'visual',
    label: 'OC-01',
    title: 'Visual Cortex',
    href: '/organisms/visual-cortex/',
    signal: 'Strategy, launch, or proof story needs a media packet.',
    memory: 'Brand intent, asset manifest, caption packet, and review state.',
    authority: 'Publishing and asset spend remain human-gated.',
    proof: 'Rendered media, caption, source notes, and posting boundary.',
  },
  {
    id: 'mirror',
    label: 'OC-02',
    title: 'Infinity Mirror',
    href: '/organisms/infinity-mirror/',
    signal: 'Reflection request needs a returned artifact instead of advice fog.',
    memory: 'Consent, selected lens, memory map, boundary lock, and proof path.',
    authority: 'No therapy, diagnosis, identity verdict, or emotional dependency loop.',
    proof: 'Reviewable artifact, repair ledger, and explicit keep/correct/close choice.',
  },
  {
    id: 'financial',
    label: 'OC-03',
    title: 'Financial Organism',
    href: '/organisms/financial-organisms/',
    signal: 'Web3 trust, pricing, or transaction logic needs simulation first.',
    memory: 'Unsigned scenario, risk flags, counterparty context, and owner notes.',
    authority: 'No keys, no broadcast, no transaction, and no financial authority.',
    proof: 'Simulation packet, risk ledger, approval gate, and no-key boundary.',
  },
  {
    id: 'research',
    label: 'OC-04',
    title: 'Research Organisms',
    href: '/vision/#vision-observatory-title',
    signal: 'Complex movement, market, or technology question needs a source map.',
    memory: 'Source trail, assumption log, uncertainty labels, and next experiment.',
    authority: 'No movement-building or expert claim without evidence and stewardship.',
    proof: 'Cited map, claim boundary, and public-safe transmission candidate.',
  },
] satisfies readonly OrganismVisualizerNode[];

export const recursiveGrowthGates = [
  {
    id: 'pattern',
    index: '01',
    title: 'Pattern repeats',
    signal: 'The organism sees the same failure, request, or handoff pressure more than once.',
    verification: 'A research packet names the repeated condition and why an existing cell is not enough.',
    authorityStop: 'No new capability receives authority from repetition alone.',
  },
  {
    id: 'candidate',
    index: '02',
    title: 'Candidate cell',
    signal: 'The Brain drafts a narrow specialist with one job and one allowed input surface.',
    verification: 'The candidate includes expected behavior, refusal behavior, and test criteria.',
    authorityStop: 'The draft cannot touch production, money, files, users, or public channels.',
  },
  {
    id: 'sandbox',
    index: '03',
    title: 'Sandbox trial',
    signal: 'The candidate runs inside an isolated environment before it can influence the organism.',
    verification: 'Tests, logs, and failure notes show what happened under constrained conditions.',
    authorityStop: 'Host effects stay blocked until the trial is reviewed.',
  },
  {
    id: 'approval',
    index: '04',
    title: 'Authority gate',
    signal: 'A human reviews the capability, its risk, and the exact authority it asks to receive.',
    verification: 'Approval packet names command class, destination, data involved, and rollback path.',
    authorityStop: 'Risky action pauses until the creator explicitly allows the next move.',
  },
  {
    id: 'integration',
    index: '05',
    title: 'Integrated cell',
    signal: 'Only a passing capability joins the organism as a replaceable cell.',
    verification: 'Docs, metadata, tests, and public status move with the source.',
    authorityStop: 'Integration does not expand scope beyond the approved cell contract.',
  },
  {
    id: 'proof',
    index: '06',
    title: 'Proof artifact',
    signal: 'The ecosystem receives a visible record of what changed and what remains bounded.',
    verification: 'Transmission, schema, asset manifest, and verification output preserve the change.',
    authorityStop: 'Public release and aliasing remain separate approval checkpoints.',
  },
] satisfies readonly RecursiveGrowthGate[];

export const cognitiveEvolutionTraceSteps = [
  {
    id: 'signal',
    index: '01',
    title: 'Signal enters',
    evolves: 'A human question becomes typed context.',
    proofLock: 'The route names what is known, unknown, and refused.',
  },
  {
    id: 'memory',
    index: '02',
    title: 'Memory reflects',
    evolves: 'Relevant history returns as a map, not a hidden identity.',
    proofLock: 'The human can correct, refuse, or close the memory path.',
  },
  {
    id: 'cells',
    index: '03',
    title: 'Cells specialize',
    evolves: 'Gateway, Cortex, Memory, Immune, and Proof cells split the work.',
    proofLock: 'Each cell has one job and one authority stop.',
  },
  {
    id: 'sandbox',
    index: '04',
    title: 'Capability is tested',
    evolves: 'A new cell remains a candidate until sandbox proof exists.',
    proofLock: 'No file write, spend, deploy, or broadcast can skip approval.',
  },
  {
    id: 'proof',
    index: '05',
    title: 'Proof returns',
    evolves: 'The output becomes a reviewable artifact with evidence.',
    proofLock: 'A claim without an artifact cannot become capability.',
  },
  {
    id: 'next-loop',
    index: '06',
    title: 'Next loop opens',
    evolves: 'Only reviewed proof can become the next organism signal.',
    proofLock: 'The human decides whether the loop grows, pauses, or ends.',
  },
] satisfies readonly CognitiveEvolutionTraceStep[];

export const architectureMapPanes = [
  {
    id: 'gateway',
    index: '01',
    title: 'Gateway intake',
    route: 'Visitor signal -> typed request',
    proves: 'The organism knows what entered before choosing a tool.',
    boundary: 'Input classification does not become consent for external action.',
  },
  {
    id: 'cortex',
    index: '02',
    title: 'Cortex route',
    route: 'Typed request -> reasoning path',
    proves: 'The Brain can explain why it chose memory, a cell, or refusal.',
    boundary: 'Reasoning remains inspectable and provisional.',
  },
  {
    id: 'memory',
    index: '03',
    title: 'Memory boundary',
    route: 'Context -> reviewed continuity',
    proves: 'Past state can help without becoming hidden authority.',
    boundary: 'No silent identity profile or unreviewed persistence.',
  },
  {
    id: 'immune',
    index: '04',
    title: 'Immune gate',
    route: 'Risk scan -> human approval',
    proves: 'Money, files, posting, Web3 broadcast, and risky execution pause.',
    boundary: 'The organism can recommend a pause; the creator grants authority.',
  },
  {
    id: 'proof',
    index: '05',
    title: 'Proof loop',
    route: 'Result -> artifact ledger',
    proves: 'Architecture, tests, status, and transmissions return to the surface.',
    boundary: 'A claim without evidence stays a claim, not a capability.',
  },
] satisfies readonly ArchitectureMapPane[];

export const proofCascadeSteps = [
  {
    id: 'architecture',
    index: '01',
    title: 'Architecture',
    claim: 'The experience is a living route, not a decorative page.',
    evidence: 'Cortex, memory, gateway, immune, and proof surfaces are named before motion.',
    artifact: '/architecture/',
    boundary: 'Architecture diagrams explain flow; they do not claim autonomy is live.',
  },
  {
    id: 'metrics',
    index: '02',
    title: 'Metrics',
    claim: 'Trust rises only when claims are measurable or explicitly bounded.',
    evidence: 'Proof register, status labels, test output, and visible release gates.',
    artifact: '/proof/#proof-register-title',
    boundary: 'Ambition stays separate from measured capability.',
  },
  {
    id: 'deployments',
    index: '03',
    title: 'Deployments',
    claim: 'A shipped artifact matters more than a private promise.',
    evidence: 'Transmission archive, deployment IDs, source packets, and live route smoke checks.',
    artifact: '/transmissions/#transmission-atlas-title',
    boundary: 'Deployments happen only after explicit approval.',
  },
  {
    id: 'status',
    index: '04',
    title: 'Status',
    claim: 'The system earns authority by showing where it stops.',
    evidence: 'Authority gate, approval packet, no-key boundaries, and manual posting gates.',
    artifact: '/proof/#authority-gate-title',
    boundary: 'High-risk actions stay human-owned.',
  },
] satisfies readonly ProofCascadeStep[];

export const phaseProofLedgerEntries = [
  {
    id: 'reverse-engineering',
    label: '01 / Reverse engineering',
    title: 'Source patterns become audit lenses.',
    evidence: 'Experience audit and source translation ledger.',
    surfaceLabel: 'Open experience audit',
    surfaceHref: '#mirror-experience-audit',
    boundary: 'Translate structure; do not clone the source skin.',
  },
  {
    id: 'concept',
    label: '02 / Concept',
    title: 'The infinity mark becomes a bounded loop.',
    evidence: 'Portal, threshold, reflection navigator, and state sequencer.',
    surfaceLabel: 'Open state sequencer',
    surfaceHref: '#mirror-state-sequencer',
    boundary: 'The symbol explains route and authority, not decoration.',
  },
  {
    id: 'story',
    label: '03 / Story arc',
    title: 'Seven chapters carry one proof loop.',
    evidence: 'Mirror, Reflection, Brain, Organisms, Growth, Proof, and Join anchors.',
    surfaceLabel: 'Open scroll choreography',
    surfaceHref: '#mirror-scroll-choreography',
    boundary: 'No chapter asks for trust without returning proof.',
  },
  {
    id: 'motion',
    label: '04 / Motion',
    title: 'Cinematic motion earns a contract.',
    evidence: 'Scroll map, emotional rail, motion contract, and runtime handoff.',
    surfaceLabel: 'Open motion contract',
    surfaceHref: '#mirror-motion-contract',
    boundary: 'CSS and SVG ship first; heavier runtimes stay gated.',
  },
  {
    id: 'visual-exploration',
    label: '05 / Visual exploration',
    title: 'Assets clarify architecture.',
    evidence: 'Portal, tunnel, organism visualizer, maps, and infinity doorway.',
    surfaceLabel: 'Open reflection navigator',
    surfaceHref: '#mirror-reflection-navigation',
    boundary: 'No visual exists only to decorate; it must explain a route.',
  },
  {
    id: 'implementation',
    label: '06 / Implementation',
    title: 'The future runtime is a packet, not a surprise.',
    evidence: 'Implementation packet, code handoff, source kit, and asset manifest.',
    surfaceLabel: 'Open code handoff',
    surfaceHref: '#mirror-code-handoff',
    boundary: 'React, Framer, GSAP, Three, and Tailwind wait for migration approval.',
  },
  {
    id: 'execution',
    label: '07 / Execution',
    title: 'The build must leave proof before public motion.',
    evidence: 'Tests, build output, browser smoke, release notes, and deployment approval.',
    surfaceLabel: 'Open runtime handoff',
    surfaceHref: '#mirror-runtime-handoff',
    boundary: 'Deployments, posting, and aliases remain explicit human checkpoints.',
  },
] satisfies readonly PhaseProofLedgerEntry[];

export const mirrorProofObservatoryPackets = [
  {
    id: 'architecture',
    tab: 'Architecture',
    tabDescription: 'How work routes.',
    evidence: 'Architecture proves how a signal moves through Gateway, Cortex, Memory, Cells, Immune Gate, and Proof Loop.',
    signal: 'The stack is inspectable as route, not mystique.',
    boundary: 'Architecture explains capability; it does not grant autonomy.',
    href: '/architecture/',
    linkLabel: 'Open architecture map',
  },
  {
    id: 'metrics',
    tab: 'Metrics',
    tabDescription: 'What has evidence.',
    evidence: 'Metrics point to public proof registers, metadata, test expectations, and claim status instead of persuasive numbers alone.',
    signal: 'A claim earns weight only when the evidence path can be inspected.',
    boundary: 'No metric should imply production capability when the artifact is still local-proof, prototype, or research.',
    href: '/proof/#proof-register-title',
    linkLabel: 'Open proof register',
  },
  {
    id: 'deployments',
    tab: 'Deployments',
    tabDescription: 'What shipped.',
    evidence: 'Deployments route to transmissions, release notes, social packets, and aliases that show what changed publicly.',
    signal: 'Public motion is a reviewed artifact, not an automatic side effect.',
    boundary: 'Deployments and aliases happen only after explicit approval.',
    href: '/transmissions/#transmission-atlas-title',
    linkLabel: 'Open transmission atlas',
  },
  {
    id: 'status',
    tab: 'Status',
    tabDescription: 'Where authority stops.',
    evidence: 'Status labels show whether a surface is production, local-proof, prototype, research, or blocked until proof.',
    signal: 'Trust increases when the system names what it cannot do yet.',
    boundary: 'Files, money, public posting, Web3 broadcast, risky execution, and identity claims remain approval-gated.',
    href: '/proof/#authority-gate-title',
    linkLabel: 'Open authority gate',
  },
] satisfies readonly MirrorProofObservatoryPacket[];

export const authorityGradientRungs = [
  {
    id: 'observe',
    label: '01 / Observe',
    title: 'Observe signal',
    canDo: 'Read the visible request and page context.',
    proofRequired: 'No memory is written and no hidden state is claimed.',
  },
  {
    id: 'reflect',
    label: '02 / Reflect',
    title: 'Reflect meaning',
    canDo: 'Return assumptions, tensions, and possible routes.',
    proofRequired: 'Language stays inspectable, reversible, and correction-ready.',
  },
  {
    id: 'draft',
    label: '03 / Draft',
    title: 'Draft artifact',
    canDo: 'Shape a plan, component, memo, packet, or prototype path.',
    proofRequired: 'Output is reviewable before it changes anything.',
  },
  {
    id: 'sandbox',
    label: '04 / Sandbox',
    title: 'Sandbox capability',
    canDo: 'Test generated code or cell behavior in isolation.',
    proofRequired: 'Logs, failures, and rollback path return before trust grows.',
  },
  {
    id: 'approval',
    label: '05 / Approval',
    title: 'Request approval',
    canDo: 'Ask before filesystem, spend, deploy, post, or Web3 motion.',
    proofRequired: 'The human sees the exact action, cost, surface, and boundary.',
  },
  {
    id: 'publish',
    label: '06 / Public motion',
    title: 'Move publicly',
    canDo: 'Ship, alias, broadcast, or post only after explicit approval.',
    proofRequired: 'Public motion leaves metadata, release notes, and a proof trail.',
  },
] satisfies readonly AuthorityGradientRung[];

export const desireTranslationRoutes = [
  {
    id: 'work',
    label: '18.8% / Professional excellence',
    title: 'Better work asks for visible leverage.',
    description: 'Routine load should become strategic room, not another hidden dashboard.',
    organismRoute: 'Brain cells + Visual Cortex',
    proofGate: 'Before/after artifact, owner approval, and no hidden labor claim.',
    authorityStop: "The organism can support mastery; it cannot decide the person's value.",
  },
  {
    id: 'self',
    label: '13.7% / Personal transformation',
    title: 'Change needs a mirror that returns evidence.',
    description: 'The system should help a person see loops without pretending to be a therapist.',
    organismRoute: 'Infinity Mirror + Reflection cell',
    proofGate: 'Returned reflection artifact, explicit consent, and bounded interpretation.',
    authorityStop: 'No diagnosis, identity verdict, or emotional dependency loop.',
  },
  {
    id: 'life',
    label: '13.5% / Life management',
    title: 'The hard part is carrying context safely.',
    description: 'Plans become useful only when memory is explicit and reversible.',
    organismRoute: 'Memory boundary + Ritualist lens',
    proofGate: 'Saved context, visible edits, and deletion path.',
    authorityStop: 'No hidden memory, surveillance, or private-life inference.',
  },
  {
    id: 'time',
    label: '11.1% / Time freedom',
    title: 'Automation should return agency.',
    description: 'Delegation earns trust when every shortcut leaves a reviewable trace.',
    organismRoute: 'Automation cell + Proof ledger',
    proofGate: 'Task packet, review state, and human approval before external effects.',
    authorityStop: 'No posting, spending, file mutation, or broadcast without approval.',
  },
  {
    id: 'security',
    label: '9.7% / Financial independence',
    title: 'Security starts as simulation.',
    description: 'Economic pressure needs review packets before value can move.',
    organismRoute: 'Financial organism',
    proofGate: 'Unsigned simulation, risk flags, no-key boundary.',
    authorityStop: 'No keys, no broadcast, no financial authority.',
  },
  {
    id: 'society',
    label: '9.4% / Societal transformation',
    title: 'Big change begins as legible systems.',
    description: 'Public vision needs shared maps, status labels, and accountable constraints.',
    organismRoute: 'Research organisms',
    proofGate: 'Source map, assumption log, and public claim boundary.',
    authorityStop: 'No movement-building claim without evidence and human stewardship.',
  },
  {
    id: 'venture',
    label: '8.7% / Entrepreneurship',
    title: 'A venture needs a living operating model.',
    description: 'Ideas become organisms when cells, memory, tools, and proof loops are named.',
    organismRoute: 'Cortex + sandbox + build packet',
    proofGate: 'Architecture packet, risk register, and first artifact.',
    authorityStop: 'No customer, investor, or market claim without artifact proof.',
  },
  {
    id: 'learning',
    label: '8.4% / Learning and growth',
    title: 'Learning should become inspectable skill.',
    description: 'Understanding improves when sources become maps, tests, and reusable cells.',
    organismRoute: 'Translator lens + Research cell',
    proofGate: 'Source trail, comprehension artifact, and next experiment.',
    authorityStop: 'No false expertise or source-free certainty.',
  },
  {
    id: 'creative',
    label: '5.6% / Creative expression',
    title: 'Expression needs a production organism.',
    description: 'Aesthetic ambition becomes safer when the pipeline names intent, assets, review, and release.',
    organismRoute: 'Visual Cortex',
    proofGate: 'Creative packet, asset manifest, caption, and manual release gate.',
    authorityStop: 'No public posting or asset spend without approval.',
  },
] satisfies readonly DesireTranslationRoute[];

export const mirrorRouteCompassEntries = [
  {
    id: 'mental-room',
    label: '01 / Mental room',
    title: 'Enter through The Mirror.',
    description: 'The person needs quiet, not a claim.',
    chapter: 'The Mirror + Reflection',
    proofReturn: 'A reviewed question, a boundary, and one human-owned next move.',
    authorityStop: 'No diagnosis, identity label, or hidden memory.',
    href: '#mirror-question-title',
    cta: 'Open the threshold',
  },
  {
    id: 'mastery',
    label: '02 / Mastery',
    title: 'Route through The Brain.',
    description: 'The person wants better work without becoming managed by the tool.',
    chapter: 'The Brain',
    proofReturn: 'Cell route, test gate, owner decision, and before/after artifact.',
    authorityStop: 'No generated capability executes outside review.',
    href: '#mirror-brain-title',
    cta: 'Trace the cells',
  },
  {
    id: 'access',
    label: '03 / Access',
    title: 'Move toward Join Evolution.',
    description: 'The person needs a bridge from imagination to a working first slice.',
    chapter: 'Join Evolution',
    proofReturn: 'First artifact packet, sandbox plan, and approval boundary.',
    authorityStop: 'No build starts until scope and owner are explicit.',
    href: '#mirror-first-artifact-router',
    cta: 'Choose first artifact',
  },
  {
    id: 'becoming',
    label: '04 / Becoming',
    title: 'Descend through Recursive Growth.',
    description: 'The person wants transformation without being pinned to a fixed identity.',
    chapter: 'Reflection + Recursive Growth',
    proofReturn: 'Correctable pattern, memory choice, and next-loop proof lock.',
    authorityStop: 'Growth never becomes destiny, diagnosis, or unreviewed memory.',
    href: '#mirror-growth-title',
    cta: 'Inspect growth gates',
  },
  {
    id: 'security',
    label: '05 / Security',
    title: 'Pass through Proof first.',
    description: 'The person wants economic clarity without handing the system value motion.',
    chapter: 'Proof + Financial Organism',
    proofReturn: 'Unsigned simulation, risk note, and no-key boundary.',
    authorityStop: 'No wallet control, swap, broadcast, or money motion.',
    href: '#mirror-proof-title',
    cta: 'Open proof route',
  },
  {
    id: 'world',
    label: '06 / World repair',
    title: 'Split into Organisms.',
    description: 'The person wants public-good intelligence with claims that can survive inspection.',
    chapter: 'Organisms + Proof',
    proofReturn: 'Source, method, caveat, status, and stewardship path.',
    authorityStop: 'No impact claim outruns evidence.',
    href: '#mirror-organisms-title',
    cta: 'See organisms split',
  },
] satisfies readonly MirrorRouteCompassEntry[];

export const scrollChoreographyActs = [
  {
    id: 'mirror',
    label: 'Act 01',
    title: 'Question enters the void.',
    focus: 'The infinity portal and threshold proof readout.',
    motion: 'Fracture sequence, depth rings, bounded canvas pulse.',
    proofReturn: 'Signal, boundary, and proof labels appear before awe.',
  },
  {
    id: 'reflection',
    label: 'Act 02',
    title: 'Software becomes a comparison.',
    focus: 'Traditional software versus AI organisms.',
    motion: 'Reflection plane routes input through memory, boundary, proof.',
    proofReturn: 'Every claim returns as assumptions, limits, and evidence.',
  },
  {
    id: 'brain',
    label: 'Act 03',
    title: 'The loop finds cells.',
    focus: 'Recursive tunnel, brain network, route console.',
    motion: 'Signal pulse selects gateway, cortex, memory, immune, proof.',
    proofReturn: 'The system names which cell can act and which must pause.',
  },
  {
    id: 'organisms',
    label: 'Act 04',
    title: 'Cells become product paths.',
    focus: 'Visual Cortex, Infinity Mirror, Financial, Research organisms.',
    motion: 'Governed spine and organism orbit relay wake in sequence.',
    proofReturn: 'Each organism exposes route, boundary, and next artifact.',
  },
  {
    id: 'growth',
    label: 'Act 05',
    title: 'The organism earns density.',
    focus: 'Six-gate recursive growth loop.',
    motion: 'Pattern, candidate, sandbox, approval, integration, proof expand.',
    proofReturn: 'Growth is visible only after tests, approval, and status.',
  },
  {
    id: 'proof',
    label: 'Act 06',
    title: 'Wonder becomes inspection.',
    focus: 'Architecture maps, motion contract, audit, source ledger.',
    motion: 'Floating panes settle into claim, evidence, boundary, artifact.',
    proofReturn: 'Discovery files, schemas, tests, and ledgers carry the claims.',
  },
  {
    id: 'join',
    label: 'Act 07',
    title: 'The doorway opens by role.',
    focus: 'Builders, investors, researchers, partners.',
    motion: 'Infinity symbol language and role-specific doorway cards.',
    proofReturn: 'The next action is concrete and authority-bounded.',
  },
] satisfies readonly ScrollChoreographyAct[];

export const mirrorEmotionalProgressionPackets = [
  {
    id: 'curiosity',
    tab: 'Curiosity',
    tabDescription: 'The portal opens.',
    feeling: 'Curiosity opens the system without demanding belief.',
    organism: 'The portal holds attention while the proof threshold names signal, boundary, and evidence.',
    proof: 'The first viewport shows the claim, the route, and the inspection path together.',
    boundary: 'Wonder cannot outrun evidence.',
  },
  {
    id: 'unease',
    tab: 'Unease',
    tabDescription: 'Control becomes visible.',
    feeling: 'Unease is answered by showing who owns authority.',
    organism: 'The reflection plane routes uncertainty through memory, cells, and proof without hiding the stop signs.',
    proof: 'The route names what can act, what must pause, and what evidence is missing.',
    boundary: 'No hidden memory, diagnosis, public posting, file write, spend, or deployment.',
  },
  {
    id: 'recognition',
    tab: 'Recognition',
    tabDescription: 'Apps become organisms.',
    feeling: 'Recognition arrives when the visitor sees the difference between a feature and a living loop.',
    organism: 'Signal, memory, cells, immune gate, and proof become product paths instead of interface decoration.',
    proof: 'The Brain route console exposes the cell choice and proof return before asking for action.',
    boundary: 'The system describes architecture. It does not claim autonomy it has not earned.',
  },
  {
    id: 'wonder',
    tab: 'Wonder',
    tabDescription: 'Cells wake.',
    feeling: 'Wonder is allowed to stay cinematic, but it must remain inspectable.',
    organism: 'Recursive growth, organism orbit, and architecture maps create depth while semantic text carries meaning.',
    proof: 'Motion contracts name trigger, duration, easing, fallback, and stop condition.',
    boundary: 'Canvas, SVG, and future WebGL stay decorative and textless.',
  },
  {
    id: 'relief',
    tab: 'Relief',
    tabDescription: 'Proof holds the loop.',
    feeling: 'Relief appears when the visitor can inspect the claim instead of decoding the spectacle.',
    organism: 'Proof cascade, source ledger, engine ledger, and build ledger translate ambition into reviewable artifacts.',
    proof: 'Every proof route returns evidence, artifact, and missing boundary before conversion.',
    boundary: 'If evidence is absent, the route must say claim, not capability.',
  },
  {
    id: 'agency',
    tab: 'Agency',
    tabDescription: 'The doorway becomes owned.',
    feeling: 'Agency appears when the visitor can choose a path without surrendering judgment.',
    organism: 'Builder, investor, researcher, and partner doorways each name a next artifact and owner.',
    proof: 'Conversion becomes a proof-bound route instead of a vague call to action.',
    boundary: 'The next move starts with scope and consent, not hidden authority.',
  },
] satisfies readonly MirrorEmotionalProgressionPacket[];

export const infinitySymbolStates = [
  {
    id: 'portal',
    index: '01',
    title: 'Portal',
    description: 'The first signal crosses only when the threshold names evidence and boundary.',
  },
  {
    id: 'reflection',
    index: '02',
    title: 'Reflection',
    description: 'Raw want returns as lens, memory map, proof path, and human-owned choice.',
  },
  {
    id: 'brain',
    index: '03',
    title: 'Brain route',
    description: 'Cortex, memory, gateway, immune, and proof cells explain what can act.',
  },
  {
    id: 'organisms',
    index: '04',
    title: 'Organism orbit',
    description: 'Visual Cortex, Mirror, Financial, and Research organisms share one governed spine.',
  },
  {
    id: 'growth',
    index: '05',
    title: 'Earned density',
    description: 'The core grows only through pattern, sandbox, approval, integration, and proof.',
  },
  {
    id: 'proof',
    index: '06',
    title: 'Proof return',
    description: 'Beauty answers to architecture, metrics, status, tests, and transmissions.',
  },
  {
    id: 'doorway',
    index: '07',
    title: 'Bounded doorway',
    description: 'Builders, investors, researchers, and partners choose a concrete next route.',
  },
] satisfies readonly InfinitySymbolState[];

export const motionContracts = [
  {
    id: 'portal',
    label: '01 / Portal',
    title: 'Fracture reveals routing.',
    trigger: 'First viewport scroll depth.',
    animation: 'Infinity scale, reflection plane, shard split, cell wake.',
    timing: 'Scrubbed depth map, CSS ease, 5-step sequence.',
    duration: 'Five scroll states; each visible state resolves inside 1.2s.',
    easing: 'Scrubbed linear depth with cubic-bezier(0.16, 1, 0.3, 1) entrance easing.',
    performance: 'Transform and opacity only; static reduced-motion state.',
  },
  {
    id: 'reflection',
    label: '02 / Reflection',
    title: 'Plane turns command into proof.',
    trigger: 'Reflection section enters the viewport.',
    animation: 'Current lines pass through input, memory, boundary, proof.',
    timing: '5.8s loop with calm cubic easing.',
    duration: '640ms reveal, then a 5.8s ambient current loop.',
    easing: 'Cubic-bezier(0.16, 1, 0.3, 1) for reveal, ease-in-out for the current.',
    performance: 'No layout animation; semantic steps carry the meaning.',
  },
  {
    id: 'signal',
    label: '03 / Signal',
    title: 'Human roles stay readable.',
    trigger: 'Role constellation appears after tension copy.',
    animation: 'Builder, user, investor, researcher nodes pulse around one loop.',
    timing: '6.8s current, 5.8s node pulse.',
    duration: '720ms section reveal, persistent 5.8s node cycle.',
    easing: 'Ease-in-out pulse; entrance uses cubic-bezier(0.16, 1, 0.3, 1).',
    performance: 'Visual-only constellation; route packets remain plain HTML.',
  },
  {
    id: 'human-signal',
    label: '04 / Human signal',
    title: 'Research becomes calibrated route choices.',
    trigger: 'Human Signal Atlas and delivery calibration enter after the tension thread.',
    animation: 'Desire nodes and delivery pulses calibrate the Infinity core while route cards stay readable.',
    timing: '11s atlas scan, 12.4s delivery scan, 5.8s node pulse, no forced scroll pin.',
    duration: '800ms card reveal with 11s and 12.4s background scans.',
    easing: 'Slow ease-in-out scan; route cards use the mirror cubic easing.',
    performance: 'CSS transform and opacity only; source link, proof gates, and route text stay semantic.',
  },
  {
    id: 'product',
    label: '05 / Product',
    title: 'Facets and concept fit explain the engine.',
    trigger: 'Remix fit matrix and product loop reach reading position.',
    animation: 'Fit nodes and talk, capture, map, ritual facets orbit stable shells.',
    timing: '12s concept-fit scan and 12s product sheen.',
    duration: '900ms shell reveal, 12s scans, no blocking timeline.',
    easing: 'Cubic-bezier(0.16, 1, 0.3, 1) for reveal; linear sheen drift.',
    performance: 'No JS dependency; concept decisions and artifact decisions stay inspectable as text.',
  },
  {
    id: 'descent',
    label: '06 / Descent',
    title: 'Immersion returns as proof.',
    trigger: 'Descent protocol appears after the returned artifact.',
    animation: 'Self, memory, split, lattice, current, evolution, and return stages receive a soft scan.',
    timing: '12s field scan, 7.6s meter, 9.2s stage current.',
    duration: '960ms section reveal, then 12s field scan.',
    easing: 'Cinematic cubic reveal; ambient loops use ease-in-out.',
    performance: 'No canvas import; the zip engine is translated into HTML, CSS, and reduced-motion-safe stages.',
  },
  {
    id: 'brain',
    label: '07 / Brain',
    title: 'Tunnel makes routing spatial.',
    trigger: 'Brain chapter follows the reflection engine.',
    animation: 'Nested rings, signal axis, gateway, cortex, memory, immune, proof.',
    timing: '9s scan with staggered cell pulses.',
    duration: '1.1s tunnel reveal, 9s scan, 120ms cell stagger.',
    easing: 'Depth reveal uses cubic-bezier(0.16, 1, 0.3, 1); pulses stay ease-in-out.',
    performance: 'CSS/SVG first; Three.js remains optional desktop enhancement.',
  },
  {
    id: 'proof',
    label: '08 / Proof',
    title: 'Wonder stabilizes into ledger.',
    trigger: 'Proof chapter replaces awe with inspection.',
    animation: 'Claim, evidence, boundary, artifact route draws across cards.',
    timing: '7.4s route draw, 5.8s node pulse.',
    duration: '740ms ledger reveal, 7.4s route draw.',
    easing: 'Route draw stays linear; ledger reveal uses the mirror cubic easing.',
    performance: 'Real links and labels remain usable without animation.',
  },
  {
    id: 'doorway',
    label: '09 / Doorway',
    title: 'Conversion keeps role boundaries.',
    trigger: 'Join chapter reaches the final reading position.',
    animation: 'Infinity breathes while builder, investor, researcher, and partner nodes stay route-specific.',
    timing: '12s orbit, 8s Infinity pulse, 6.4s doorway node cadence.',
    duration: '800ms route reveal, 12s orbit, 8s symbol pulse.',
    easing: 'Route reveal uses cubic-bezier(0.16, 1, 0.3, 1); orbit loops ease-in-out.',
    performance: 'Links are real anchors; visual orbit is decorative and can freeze without losing meaning.',
  },
] satisfies readonly MotionContract[];

export const experienceAuditLenses = [
  {
    id: 'information-architecture',
    index: '01',
    title: 'Information architecture',
    purpose: 'Move from context to method, finding, meaning, and public proof without losing the reader.',
    works: 'The reference page earns trust by sequencing scale, evidence, interpretation, and then action.',
    reinterpret: 'Infinity Mirror sequences mirror, reflection, brain, organisms, recursive growth, proof, and join routes.',
  },
  {
    id: 'storytelling-flow',
    index: '02',
    title: 'Storytelling flow',
    purpose: 'Let the visitor feel discovery before asking for belief.',
    works: 'A clear research premise keeps the emotional arc grounded in a real method.',
    reinterpret: 'The Unwind route starts with a question, then returns artifacts before any authority grows.',
  },
  {
    id: 'scroll-choreography',
    index: '03',
    title: 'Scroll choreography',
    purpose: 'Stage one idea at a time while preserving continuity between sections.',
    works: 'The reader is slowed at the exact points where meaning changes.',
    reinterpret: 'The infinity mark fractures into reflection, cell routing, organism orbit, proof, and doorway.',
  },
  {
    id: 'motion-system',
    index: '04',
    title: 'Motion system',
    purpose: 'Use movement to name state instead of decorating the viewport.',
    works: 'Small motion loops make the system feel alive without replacing the reading order.',
    reinterpret: 'Every motion lane names trigger, animation, duration, easing, fallback, cleanup, and stop condition.',
  },
  {
    id: 'visual-hierarchy',
    index: '05',
    title: 'Visual hierarchy',
    purpose: 'Keep one primary idea visible while secondary proof waits nearby.',
    works: 'The reference experience gives the central research claim enough quiet to feel credible.',
    reinterpret: 'Unwind keeps the infinity core central while proof modules sit as inspectable ledgers.',
  },
  {
    id: 'typography',
    index: '06',
    title: 'Typography system',
    purpose: 'Separate emotional thesis, method notes, data labels, and navigation.',
    works: 'Scale and rhythm help the reader distinguish story from evidence.',
    reinterpret: 'Mirror typography separates doctrine, route labels, artifacts, and authority boundaries.',
  },
  {
    id: 'transition-logic',
    index: '07',
    title: 'Transition logic',
    purpose: 'Make each new surface feel caused by the previous one.',
    works: 'Sections do not appear as disconnected blocks; each answers the prior question.',
    reinterpret: 'Each mirror stage returns a packet, proof route, or boundary before the next layer opens.',
  },
  {
    id: 'attention-management',
    index: '08',
    title: 'Attention management',
    purpose: 'Reduce cognitive load while keeping the complex system inspectable.',
    works: 'The reference moves between broad thesis and precise evidence at a controlled pace.',
    reinterpret: 'Unwind gives visitors lenses, maps, ledgers, and proof routes instead of one long abstraction.',
  },
  {
    id: 'emotional-progression',
    index: '09',
    title: 'Emotional progression',
    purpose: 'Move from wonder to recognition, then from recognition to trust.',
    works: 'The emotional lift is supported by method, not spectacle alone.',
    reinterpret: 'Infinity Mirror moves from awe to returned artifact, then to human-owned next action.',
  },
  {
    id: 'performance-technique',
    index: '10',
    title: 'Performance technique',
    purpose: 'Keep cinematic ambition cheap enough to remain readable.',
    works: 'Semantic content and lightweight motion protect comprehension.',
    reinterpret: 'CSS and SVG ship first; Framer, GSAP, and Three remain isolated enhancement leaves.',
  },
] satisfies readonly ExperienceAuditLens[];

export const sourceTranslationLedgerEntries = [
  {
    id: 'scale',
    label: '01 / Scale',
    sourcePattern: '80,508 participants across 159 countries and 70 languages creates a credible research field.',
    unwindTranslation: 'Scale becomes a proof expectation: every organism claim needs a visible evidence route.',
    boundary: 'Do not borrow the reference page skin or imply access to its participant data.',
  },
  {
    id: 'method',
    label: '02 / Method',
    sourcePattern: 'The reference makes method part of the story rather than hiding it behind a claim.',
    unwindTranslation: 'Infinity Mirror exposes signal, lens, memory map, boundary, and proof path in the returned artifact.',
    boundary: 'Method visibility cannot become hidden identity authority.',
  },
  {
    id: 'tension',
    label: '03 / Tension',
    sourcePattern: 'Human hopes and system limits sit together, creating an honest emotional field.',
    unwindTranslation: 'Reflection sections pair desire with organism route, proof gate, and authority stop.',
    boundary: 'No invented quotes, personas, diagnoses, or destiny claims.',
  },
  {
    id: 'delivery-gap',
    label: '04 / Delivery gap',
    sourcePattern: 'The strongest story names where expectations are not yet fulfilled.',
    unwindTranslation: 'Unwind routes not-delivered signals into proof gates, repairs, or refusal states.',
    boundary: 'A missing proof artifact must remain a visible gap, not a marketing promise.',
  },
  {
    id: 'scroll',
    label: '05 / Scroll',
    sourcePattern: 'Scroll pacing turns research into discovery instead of a static report.',
    unwindTranslation: 'The infinity portal fractures as the visitor passes from mirror to proof to join route.',
    boundary: 'Motion must explain architecture, not perform empty spectacle.',
  },
  {
    id: 'non-clone',
    label: '06 / Non-clone',
    sourcePattern: 'The useful lesson is structure: source, method, finding, implication, and action.',
    unwindTranslation: 'Unwind keeps the structure but replaces the surface with organisms, brain cells, proof, and authority.',
    boundary: 'No copied layout, chart treatment, quote wall, globe metaphor, or brand hierarchy.',
  },
] satisfies readonly SourceTranslationLedgerEntry[];

export const engineTranslationLedgerEntries = [
  {
    id: 'persistent-shell',
    label: '01 / Shell',
    concept: 'Persistent mirror shell',
    decision: 'adopt_now',
    translation: 'A stable shell keeps continuity while growth, prompt, artifact, and route states change.',
    guard: 'Shell continuity cannot imply hidden memory writes.',
  },
  {
    id: 'reversible-lenses',
    label: '02 / Lens',
    concept: 'Reversible reflection lenses',
    decision: 'adopt_now',
    translation: 'Architect, Cartographer, Translator, and Ritualist lenses frame the same signal without final authority.',
    guard: 'The user can refuse, correct, deepen, or close the loop.',
  },
  {
    id: 'returned-artifact',
    label: '03 / Artifact',
    concept: 'Returned artifact object',
    decision: 'adopt_now',
    translation: 'Signal, lens, memory map, boundary, proof path, and repair ledger return as inspectable fields.',
    guard: 'Nothing becomes memory, proof, or public motion until reviewed.',
  },
  {
    id: 'descent-engine',
    label: '04 / Descent',
    concept: 'Scroll descent engine',
    decision: 'prototype_next',
    translation: 'Self, memory, split, lattice, current, evolution, and proof return become a semantic route first.',
    guard: 'Canvas or WebGL can deepen only after fallback and reduced-motion gates are proven.',
  },
  {
    id: 'signal-map',
    label: '05 / Signal',
    concept: 'Pointer energy and signal map',
    decision: 'prototype_next',
    translation: 'Pointer energy can become local visual feedback around selected route, lens, or proof path.',
    guard: 'No tracking, profiling, or hidden personalization.',
  },
  {
    id: 'birth-archetype',
    label: '06 / Block',
    concept: 'Birth-frequency archetypes',
    decision: 'block_until_proof',
    translation: 'Identity-flavored archetypes stay out of the product path until there is consent, proof, and care review.',
    guard: 'The mirror cannot claim identity truth, destiny, diagnosis, or private meaning.',
  },
] satisfies readonly EngineTranslationLedgerEntry[];

export const interfaceBuildStages = [
  {
    id: 'semantic-shell',
    label: '01 / Semantic shell',
    title: 'Meaning ships before motion.',
    description: 'Headings, route links, bilingual strings, schema, and proof text remain readable without JavaScript.',
    artifact: 'Static route, i18n keys, ImageObject schema, source kit.',
    boundary: 'No critical text hidden in SVG, canvas, or WebGL.',
  },
  {
    id: 'motion-islands',
    label: '02 / Motion islands',
    title: 'Animation stays isolated.',
    description: 'Framer and GSAP own only leaf behaviors after semantic proof and reduced-motion fallback exist.',
    artifact: 'Motion contract, cleanup rules, compact-screen stop conditions.',
    boundary: 'Transform and opacity only for continuous motion.',
  },
  {
    id: 'three-gate',
    label: '03 / 3D gate',
    title: 'Three.js is optional depth.',
    description: 'Recursive tunnel and WebGL distortion wait until the static route proves story, fallback, and performance.',
    artifact: 'Desktop-only module, SVG fallback, DPR cap, disposal rules.',
    boundary: 'Pause offscreen and disable on mobile.',
  },
  {
    id: 'evidence-sync',
    label: '04 / Evidence sync',
    title: 'Proof files move together.',
    description: 'Metadata, manifest, llms, ai-services, source kit, and tests change with every visible claim.',
    artifact: 'Implementation packet, asset manifest, tests, local build output.',
    boundary: 'No new claim ships without a matching proof artifact.',
  },
  {
    id: 'release-gate',
    label: '05 / Release gate',
    title: 'Public motion waits for approval.',
    description: 'Local source-kit work remains local until the creator explicitly asks for a deploy or alias update.',
    artifact: 'Verification transcript, production rollout plan, approval checkpoint.',
    boundary: 'Deployments, posting, spending, and public commitments remain human-led.',
  },
] satisfies readonly InterfaceBuildStage[];

export const runtimeHandoffLanes = [
  {
    id: 'css-svg',
    label: '01 / CSS + SVG',
    owner: 'Semantic route and lightweight visual system.',
    job: 'Carry public meaning, anchor navigation, proof ledgers, and textless decorative motion.',
    fallback: 'Static HTML and SVG remain readable with JavaScript disabled.',
    stopCondition: 'Freeze on reduced motion, compact screens, or offscreen visual surfaces.',
  },
  {
    id: 'framer',
    label: '02 / Framer leaf',
    owner: 'MirrorChapterMotion.client.tsx',
    job: 'Reveal already-rendered cells and tactile route cards with spring opacity and transform.',
    fallback: 'Render the same cells statically when reduced motion is requested.',
    stopCondition: 'Never own scroll position, layout meaning, storage, or network calls.',
  },
  {
    id: 'gsap',
    label: '03 / GSAP portal',
    owner: 'MirrorPortalTimeline.client.tsx',
    job: 'Optionally pin and scrub desktop portal fracture choreography.',
    fallback: 'Use the semantic hero, SVG portal, and chapter anchors.',
    stopCondition: 'Skip reduced motion and compact screens; cleanup with gsap.context revert.',
  },
  {
    id: 'three',
    label: '04 / Three + WebGL',
    owner: 'MirrorBrainTunnelGate.client.tsx',
    job: 'Optionally deepen the recursive brain tunnel with bounded particles and shader distortion.',
    fallback: 'Use the server-rendered brain route and CSS/SVG tunnel.',
    stopCondition: 'Pause offscreen, cap DPR, dispose objects, and cancel animation frames.',
  },
] satisfies readonly RuntimeHandoffLane[];

export const mirrorDepthGateLanes = [
  {
    id: 'semantic',
    label: '01 / Semantic depth',
    title: 'Ship the readable mirror first.',
    trigger: 'Page load, hash route, reduced-motion visit.',
    allowed: 'HTML, bilingual text, SVG fallback, bounded canvas field.',
    proofNeeded: 'Headings, anchors, schema, tests, and no critical text in visuals.',
    fallback: 'The full route remains meaningful without JavaScript.',
    killSwitch: 'Freeze ambient loops under reduced motion or compact screens.',
  },
  {
    id: 'framer',
    label: '02 / Framer depth',
    title: 'Let cards breathe after meaning exists.',
    trigger: 'Viewport entry, lens selection, route-card hover.',
    allowed: 'Opacity, transform, spring reveal, local selected-state only.',
    proofNeeded: 'Static cards, keyboard focus, reduced-motion branch, no network calls.',
    fallback: 'Server-rendered cards stay visible and clickable.',
    killSwitch: 'Do not own scroll, layout meaning, storage, deploy, or posting.',
  },
  {
    id: 'gsap',
    label: '03 / GSAP depth',
    title: 'Pin theater only on capable desktop.',
    trigger: 'Desktop viewport, reduced motion off, semantic route already passed.',
    allowed: 'Pinned portal fracture, scrubbed depth, transform-only chapter staging.',
    proofNeeded: 'Anchor navigation, cleanup with context revert, no mobile scroll hijack.',
    fallback: 'CSS fracture sequence and chapter anchors remain canonical.',
    killSwitch: 'Skip below 900px, when reduced motion is true, or when cleanup fails.',
  },
  {
    id: 'webgl',
    label: '04 / Three + WebGL depth',
    title: 'Depth cannot become authority.',
    trigger: 'Desktop-capable GPU, visible canvas, user motion allowed.',
    allowed: 'Decorative recursive tunnel, particles, shader field, DPR cap.',
    proofNeeded: 'SVG tunnel fallback, pause offscreen, dispose geometry/materials/renderer.',
    fallback: 'RecursiveBrainTunnel and BrainRouteConsole carry all meaning.',
    killSwitch: 'Disable under 900px, cap DPR at 1.5, cancel frames offscreen.',
  },
] satisfies readonly MirrorDepthGateLane[];

export const proofRoutes = [
  { label: 'Architecture', title: 'How the stack routes work', boundary: 'Cortex, memory, gateway, immune system, proof loop.', href: '/architecture/' },
  { label: 'Metrics', title: 'What claims have evidence', boundary: 'Proof register before ambition.', href: '/proof/#proof-register-title' },
  { label: 'Deployments', title: 'What shipped publicly', boundary: 'Transmission trail and release notes.', href: '/transmissions/#transmission-atlas-title' },
  { label: 'Status', title: 'Where authority pauses', boundary: 'Human gate for risky action.', href: '/proof/#authority-gate-title' },
] as const;

export const joinRoutes = [
  {
    role: 'Builders',
    title: 'Study the stack',
    next: 'Map cells, memory, and proof before writing code.',
    proof: 'Component tree, source kit, architecture packet, and test gates.',
    boundary: 'Start with a sandboxed first artifact before asking for runtime authority.',
    href: '/architecture/',
  },
  {
    role: 'Investors',
    title: 'Inspect proof',
    next: 'Trace shipped artifacts before trusting long-range claims.',
    proof: 'Shipping log, metadata, public proof ledger, and status surfaces.',
    boundary: 'Long-range claims stay separated from current proof.',
    href: '/proof/',
  },
  {
    role: 'Researchers',
    title: 'Study the roadmap',
    next: 'Separate current proof from future culture-bearing intelligence.',
    proof: 'Audit, source translation ledger, assumption logs, and roadmap boundaries.',
    boundary: 'No movement claim without evidence and stewardship.',
    href: '/vision/',
  },
  {
    role: 'Partners',
    title: 'Build with us',
    next: 'Bring a domain, a boundary, and a first artifact.',
    proof: 'Fit packet, authority map, and first artifact requirement.',
    boundary: 'No public commitment before approval.',
    href: '/build-with-us/',
  },
] satisfies readonly JoinEvolutionRoute[];

export const firstArtifactRoutes = [
  {
    id: 'builder',
    label: '01 / Builder',
    title: 'Prototype organism',
    bring: 'Domain friction, data shape, owner, and one risk boundary.',
    firstArtifact: 'Architecture packet plus sandboxed first-slice plan.',
    proofRoute: 'Component tree, cell map, test gate, and rollback note.',
    approvalBoundary: 'No generated capability executes outside review.',
    href: '/architecture/',
    cta: 'Open architecture map',
  },
  {
    id: 'investor',
    label: '02 / Investor',
    title: 'Diligence packet',
    bring: 'Thesis, risk questions, proof threshold, and timeline horizon.',
    firstArtifact: 'Proof memo separating shipped surfaces from future claims.',
    proofRoute: 'Proof ledger, transmissions, status labels, and metadata.',
    approvalBoundary: 'No financial promise or production claim outruns evidence.',
    href: '/proof/#proof-register-title',
    cta: 'Open proof register',
  },
  {
    id: 'researcher',
    label: '03 / Researcher',
    title: 'Source map',
    bring: 'Research question, method concern, and desired comparison.',
    firstArtifact: 'Source translation map with assumptions, caveats, and next experiment.',
    proofRoute: 'Experience audit, source ledger, and roadmap status.',
    approvalBoundary: 'No research claim becomes public certainty without review.',
    href: '/vision/#vision-observatory-title',
    cta: 'Open vision observatory',
  },
  {
    id: 'partner',
    label: '04 / Partner',
    title: 'Collaboration packet',
    bring: 'Domain, success condition, constraints, budget boundary, and proof appetite.',
    firstArtifact: 'First-sprint scope with owner, risk stops, and review cadence.',
    proofRoute: 'Collaboration packet, authority map, and first milestone artifact.',
    approvalBoundary: 'No deploy, spend, public post, or Web3 motion without explicit approval.',
    href: '/build-with-us/',
    cta: 'Start build conversation',
  },
] satisfies readonly FirstArtifactRoute[];

export const evolutionEntryProtocolSteps = [
  {
    id: 'signal',
    label: '01 / Signal',
    title: 'Bring the real friction.',
    input: 'Role, domain, current constraint, and why the loop matters now.',
    proofOutput: 'A typed request that can be routed to cells, proof, or refusal.',
  },
  {
    id: 'boundary',
    label: '02 / Boundary',
    title: 'Name what must not move.',
    input: 'Files, money, public posting, Web3 broadcast, identity, and care limits.',
    proofOutput: 'A visible authority map before any build or diligence work starts.',
  },
  {
    id: 'artifact',
    label: '03 / First proof',
    title: 'Produce one reviewable artifact.',
    input: 'Architecture packet, prototype, diligence memo, source map, or sprint note.',
    proofOutput: 'An artifact someone can inspect before a larger promise is made.',
  },
  {
    id: 'loop',
    label: '04 / Next loop',
    title: 'Choose grow, pause, deepen, or close.',
    input: 'Human review of the artifact, risks, cost, and evidence quality.',
    proofOutput: 'A next action with the same boundary still visible.',
  },
] satisfies readonly EvolutionEntryProtocolStep[];

export const mirrorStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Infinity Mirror Interface',
  url: 'https://www.unwindcode.ai/organisms/infinity-mirror/experience/',
  image: `https://www.unwindcode.ai${infinityMirrorAssets.socialPreview}`,
  description:
    'A proof-bound interface concept for self-evolving AI organisms, recursive brain cells, reflection, desire translation, and governed cognitive evolution.',
} as const;
