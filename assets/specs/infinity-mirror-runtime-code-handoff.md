# Infinity Mirror Runtime Code Handoff

Status: local-proof handoff
Route: /organisms/infinity-mirror/experience/
Approval: do not deploy or install new runtime dependencies until explicitly approved.

This handoff turns Phase 7 into implementation-ready code contracts for a future React/Next migration. The current Vite route remains the source of public meaning until that migration is approved, and the migration must preserve the infinite reflection navigator, mirror state sequencer, desire translation wall, mirror route compass, adaptive mirror engine, signal composer, memory consent ledger, mirror shell specimen, product loop, returned artifact, descent protocol, brain cell network, living organism visualizer, recursive growth timeline, floating architecture maps, phase proof ledger, proof cascade, proof observatory, scroll choreography map, emotional progression rail, motion contract ledger, experience audit console, source translation ledger, engine translation ledger, interface build ledger, runtime handoff matrix, mirror depth gate, infinity symbol language, join evolution routes, first artifact router, and evolution entry protocol as inspectable proof logic.

## Runtime Kit

The same contracts are now available as source files under:

`/assets/specs/infinity-mirror-runtime-kit/README.md`

Use the kit as a migration starting point only after the install gate is approved. The kit is copied to local build output as a static builder artifact and is not imported by the current Vite route.

## Install Gate

The current package only depends on Vite. Do not import these libraries in the static route.

```bash
npm install next react react-dom framer-motion gsap three tailwindcss @tailwindcss/postcss
```

## app/organisms/infinity-mirror/experience/page.tsx

Server-rendered meaning first. Motion leaves hydrate after semantic sections, links, metadata, and proof boundaries exist.

```tsx
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { AdaptiveMirrorEngine } from '@/components/mirror/AdaptiveMirrorEngine';
import { AuthorityGradient } from '@/components/mirror/AuthorityGradient';
import { BrainCellNetwork } from '@/components/mirror/BrainCellNetwork';
import { BrainRouteConsole } from '@/components/mirror/BrainRouteConsole';
import { BrainSignalHandoff } from '@/components/mirror/BrainSignalHandoff.client';
import { CognitiveEvolutionTrace } from '@/components/mirror/CognitiveEvolutionTrace';
import { DesireTranslationWall } from '@/components/mirror/DesireTranslationWall';
import { EmotionalProgressionRail } from '@/components/mirror/EmotionalProgressionRail.client';
import { EngineTranslationLedger } from '@/components/mirror/EngineTranslationLedger';
import { EvolutionEntryProtocol } from '@/components/mirror/EvolutionEntryProtocol';
import { ExperienceAuditConsole } from '@/components/mirror/ExperienceAuditConsole';
import { FloatingArchitectureMaps } from '@/components/mirror/FloatingArchitectureMaps';
import { FirstArtifactRouter } from '@/components/mirror/FirstArtifactRouter';
import { InfiniteReflectionNavigator } from '@/components/mirror/InfiniteReflectionNavigator';
import { InfinitySymbolLanguage } from '@/components/mirror/InfinitySymbolLanguage';
import { InterfaceBuildLedger } from '@/components/mirror/InterfaceBuildLedger';
import { JoinEvolutionRoutes } from '@/components/mirror/JoinEvolutionRoutes';
import { LivingOrganismVisualizer } from '@/components/mirror/LivingOrganismVisualizer';
import { MemoryConsentLedger } from '@/components/mirror/MemoryConsentLedger';
import { MirrorDescentProtocol } from '@/components/mirror/MirrorDescentProtocol';
import { MirrorDepthGate } from '@/components/mirror/MirrorDepthGate';
import { MirrorProductLoop } from '@/components/mirror/MirrorProductLoop';
import { MirrorRouteCompass } from '@/components/mirror/MirrorRouteCompass';
import { MirrorShellSpecimen } from '@/components/mirror/MirrorShellSpecimen';
import { MirrorChapterMotion } from '@/components/mirror/MirrorChapterMotion.client';
import { MirrorPortalTimeline } from '@/components/mirror/MirrorPortalTimeline.client';
import { MirrorBrainTunnelGate } from '@/components/mirror/MirrorBrainTunnelGate.client';
import { MirrorStateSequencer } from '@/components/mirror/MirrorStateSequencer.client';
import { MotionContractLedger } from '@/components/mirror/MotionContractLedger';
import { PhaseProofLedger } from '@/components/mirror/PhaseProofLedger';
import { ProofCascade } from '@/components/mirror/ProofCascade';
import { ProofObservatory } from '@/components/mirror/ProofObservatory.client';
import { RecursiveBrainTunnel } from '@/components/mirror/RecursiveBrainTunnel';
import { RecursiveGrowthTimeline } from '@/components/mirror/RecursiveGrowthTimeline';
import { ReturnedArtifactSpecimen } from '@/components/mirror/ReturnedArtifactSpecimen';
import { RuntimeHandoffMatrix } from '@/components/mirror/RuntimeHandoffMatrix';
import { ScrollChoreographyMap } from '@/components/mirror/ScrollChoreographyMap';
import { SignalComposer } from '@/components/mirror/SignalComposer.client';
import { SourceTranslationLedger } from '@/components/mirror/SourceTranslationLedger';
import {
  architectureMapPanes,
  authorityGradientRungs,
  adaptiveMirrorLenses,
  artifactDecisionLabels,
  artifactRepairSteps,
  brainCellNetworkNodes,
  brainRouteStages,
  brainSignalHandoffPackets,
  cognitiveEvolutionTraceSteps,
  defaultBrainSignalHandoff,
  desireTranslationRoutes,
  engineTranslationLedgerEntries,
  evolutionEntryProtocolSteps,
  experienceAuditLenses,
  firstArtifactRoutes,
  infinitySymbolStates,
  interfaceBuildStages,
  joinRoutes,
  livingOrganismNodes,
  memoryConsentStates,
  mirrorDescentStages,
  mirrorDepthGateLanes,
  mirrorChapters,
  mirrorEmotionalProgressionPackets,
  mirrorProofObservatoryPackets,
  mirrorProductLoopSteps,
  mirrorRouteCompassEntries,
  mirrorShellRules,
  mirrorStateSequencerPackets,
  mirrorStoryAnchors,
  motionContracts,
  phaseProofLedgerEntries,
  proofCascadeSteps,
  proofRoutes,
  reflectionNavigatorLenses,
  recursiveBrainTunnelSteps,
  recursiveGrowthGates,
  returnedArtifactFields,
  runtimeHandoffLanes,
  scrollChoreographyActs,
  signalComposerPackets,
  sourceTranslationLedgerEntries,
} from '@/lib/mirror/infinityMirrorContent';

export const metadata: Metadata = {
  title: 'Infinity Mirror Interface - Self-Evolving AI Organisms | Unwind Code',
  description:
    'Enter a proof-bound Infinity Mirror interface for AI organisms, recursive brain cells, reflection, and governed cognitive evolution.',
  alternates: {
    canonical: 'https://www.unwindcode.ai/organisms/infinity-mirror/experience/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.unwindcode.ai/organisms/infinity-mirror/experience/',
    title: 'Infinity Mirror Interface - Self-Evolving AI Organisms',
    description:
      'A black reflective portal into organisms, brain cells, recursive growth, proof, and human authority boundaries.',
    images: [
      {
        url: 'https://www.unwindcode.ai/assets/social/unwindcode-lab-preview.svg',
        width: 1200,
        height: 630,
        alt: 'Unwind Code AI organism architecture lab visual',
      },
    ],
  },
};

export default function InfinityMirrorExperiencePage() {
  return (
    <main className="mirror-page">
      <section id="mirror-experience-hero" aria-labelledby="mirror-question-title">
        <div className="mirror-copy">
          <p>01 / The Mirror</p>
          <h1 id="mirror-question-title">What if software could evolve?</h1>
          <p>
            A question becomes memory, memory becomes a cell, cells become an organism,
            and every new capability leaves proof before authority grows.
          </p>
          <nav aria-label="Infinity Mirror primary routes">
            <a href="/organisms/infinity-mirror/">Inspect product path</a>
            <a href="/architecture/">Map organism stack</a>
          </nav>
        </div>
        <MirrorPortalTimeline />
      </section>

      <InfiniteReflectionNavigator anchors={mirrorStoryAnchors} lenses={reflectionNavigatorLenses} />
      <MirrorStateSequencer packets={mirrorStateSequencerPackets} />

      {mirrorChapters.map((chapter, index) => (
        <Fragment key={chapter.id}>
          <section id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <p>{chapter.kicker}</p>
            <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            <p>{chapter.description}</p>
            <MirrorChapterMotion chapterId={chapter.id} cells={chapter.cells} />
          </section>
          {index === 0 ? <DesireTranslationWall routes={desireTranslationRoutes} /> : null}
          {index === 0 ? <MirrorRouteCompass entries={mirrorRouteCompassEntries} /> : null}
          {index === 0 ? <AdaptiveMirrorEngine lenses={adaptiveMirrorLenses} /> : null}
          {index === 0 ? <SignalComposer packets={signalComposerPackets} /> : null}
          {index === 0 ? <MemoryConsentLedger states={memoryConsentStates} /> : null}
          {index === 0 ? <MirrorShellSpecimen rules={mirrorShellRules} /> : null}
          {index === 0 ? <MirrorProductLoop decisions={artifactDecisionLabels} steps={mirrorProductLoopSteps} /> : null}
          {index === 0 ? <ReturnedArtifactSpecimen fields={returnedArtifactFields} repairSteps={artifactRepairSteps} /> : null}
          {index === 0 ? <MirrorDescentProtocol stages={mirrorDescentStages} /> : null}
          {index === 1 ? <RecursiveBrainTunnel steps={recursiveBrainTunnelSteps} /> : null}
          {index === 1 ? <BrainCellNetwork cells={brainCellNetworkNodes} /> : null}
          {index === 1 ? <BrainRouteConsole handoff={defaultBrainSignalHandoff} stages={brainRouteStages} /> : null}
          {index === 1 ? <BrainSignalHandoff packets={brainSignalHandoffPackets} stages={brainRouteStages} /> : null}
          {index === 2 ? <LivingOrganismVisualizer organisms={livingOrganismNodes} /> : null}
          {index === 3 ? <RecursiveGrowthTimeline gates={recursiveGrowthGates} /> : null}
        </Fragment>
      ))}

      <MirrorBrainTunnelGate fallbackId="mirror-brain-title" />
      <CognitiveEvolutionTrace steps={cognitiveEvolutionTraceSteps} />

      <nav aria-label="Infinity Mirror proof routes">
        {proofRoutes.map((route) => (
          <a key={route.href} href={route.href}>
            <span>{route.label}</span>
            <strong>{route.title}</strong>
          </a>
        ))}
      </nav>
      <FloatingArchitectureMaps panes={architectureMapPanes} />
      <PhaseProofLedger entries={phaseProofLedgerEntries} />
      <ProofCascade steps={proofCascadeSteps} />
      <ProofObservatory packets={mirrorProofObservatoryPackets} />
      <AuthorityGradient rungs={authorityGradientRungs} />
      <ScrollChoreographyMap acts={scrollChoreographyActs} />
      <EmotionalProgressionRail packets={mirrorEmotionalProgressionPackets} />
      <MotionContractLedger contracts={motionContracts} />
      <ExperienceAuditConsole lenses={experienceAuditLenses} />
      <SourceTranslationLedger entries={sourceTranslationLedgerEntries} />
      <EngineTranslationLedger entries={engineTranslationLedgerEntries} />
      <InterfaceBuildLedger stages={interfaceBuildStages} />
      <RuntimeHandoffMatrix lanes={runtimeHandoffLanes} />
      <MirrorDepthGate lanes={mirrorDepthGateLanes} />

      <section aria-labelledby="mirror-join-title">
        <h2 id="mirror-join-title">Choose the doorway that matches your reason for entering.</h2>
        <InfinitySymbolLanguage states={infinitySymbolStates} />
        <JoinEvolutionRoutes routes={joinRoutes} />
        <FirstArtifactRouter routes={firstArtifactRoutes} />
        <EvolutionEntryProtocol steps={evolutionEntryProtocolSteps} />
      </section>
    </main>
  );
}
```

## components/mirror/AdaptiveMirrorEngine.tsx

The adaptive mirror engine is server-rendered. It keeps the four-lens product grammar visible before the Signal Composer changes local state.

```tsx
import type { AdaptiveMirrorLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lenses: readonly AdaptiveMirrorLens[];
};

export function AdaptiveMirrorEngine({ lenses }: Props) {
  return (
    <section id="mirror-adaptive-engine" aria-labelledby="mirror-adaptive-engine-title" data-runtime-owner="bounded-adaptive-lens-relay">
      <h3 id="mirror-adaptive-engine-title">One reflection can be read four ways.</h3>
      <ol>
        {lenses.map((lens) => (
          <li key={lens.id} data-adaptive-lens={lens.id}>
            <span>{lens.label}</span>
            <strong>{lens.description}</strong>
            <dl>
              <dt>Capture</dt>
              <dd>{lens.capture}</dd>
              <dt>Translate</dt>
              <dd>{lens.translate}</dd>
              <dt>Keep</dt>
              <dd>{lens.keep}</dd>
              <dt>Boundary</dt>
              <dd>{lens.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/SignalComposer.client.tsx

The signal composer is a client leaf because it owns only local selected-signal state. It keeps every returned packet field in typed content and does not store memory, call a network, write files, deploy, post, or claim identity authority.

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { MirrorSignalPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorSignalPacket[];
  initialPacketId?: string;
};

export function SignalComposer({ packets, initialPacketId }: Props) {
  const firstPacketId = packets[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialPacketId ?? firstPacketId);
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) {
    return null;
  }

  return (
    <section id="mirror-signal-composer" data-runtime-owner="bounded-signal-composer">
      <h3 id="mirror-signal-composer-title">Choose the signal and watch the mirror return a bounded packet.</h3>
      <fieldset aria-describedby="mirror-signal-composer-boundary">
        {packets.map((packet) => (
          <button key={packet.id} type="button" aria-pressed={activePacket.id === packet.id} onClick={() => setActiveId(packet.id)}>
            <span>{packet.tab}</span>
            <span>{packet.tabDescription}</span>
          </button>
        ))}
      </fieldset>
      <dl aria-live="polite">
        <dt>Selected signal</dt>
        <dd>{activePacket.signal}</dd>
        <dt>Lens returned</dt>
        <dd>{activePacket.lens}</dd>
        <dt>Artifact promise</dt>
        <dd>{activePacket.artifact}</dd>
        <dt>Boundary</dt>
        <dd>{activePacket.boundary}</dd>
        <dt>Proof path</dt>
        <dd>{activePacket.proofPath}</dd>
        <dt>Brain cells</dt>
        <dd>{activePacket.brainCells}</dd>
      </dl>
      <p id="mirror-signal-composer-boundary">{activePacket.authorityLock}</p>
    </section>
  );
}
```

## components/mirror/MemoryConsentLedger.tsx

The memory consent ledger stays server-rendered. It makes reflection persistence visible as ephemeral, proposed, reviewed, and integrated consent states before any future memory runtime can use them.

```tsx
import type { MemoryConsentState } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  states: readonly MemoryConsentState[];
};

export function MemoryConsentLedger({ states }: Props) {
  return (
    <section id="mirror-memory-consent" data-runtime-owner="semantic-memory-consent-ledger">
      <h3 id="mirror-memory-consent-title">
        The mirror can remember only what the person can inspect.
      </h3>
      <ol aria-label="Memory consent states">
        {states.map((state) => (
          <li key={state.id} data-memory-consent={state.id}>
            <span>{state.label}</span>
            <strong>{state.title}</strong>
            <dl>
              <dt>Can hold</dt>
              <dd>{state.canHold}</dd>
              <dt>Proof required</dt>
              <dd>{state.proofRequired}</dd>
              <dt>Human control</dt>
              <dd>{state.humanControl}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <p>
        Memory consent does not grant diagnosis, identity authority, hidden profiling, wallet control, public posting, deployment, or autonomous action.
      </p>
    </section>
  );
}
```

## components/mirror/InfiniteReflectionNavigator.tsx

The infinite reflection navigator is server-rendered. It turns the static chapter rail into a reusable map whose chapter anchors and lenses name focus, route, proof, and boundary before motion.

```tsx
import type { MirrorStoryAnchor, ReflectionNavigatorLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  anchors: readonly MirrorStoryAnchor[];
  lenses: readonly ReflectionNavigatorLens[];
};

export function InfiniteReflectionNavigator({ anchors, lenses }: Props) {
  return (
    <section id="mirror-reflection-navigation" aria-labelledby="mirror-reflection-navigation-title">
      <h2 id="mirror-reflection-navigation-title">The infinity mark becomes the map, not decoration.</h2>
      <nav aria-label="Infinity Mirror story anchors">
        {anchors.map((anchor) => (
          <a key={anchor.id} href={anchor.href}>
            <span>{anchor.index}</span>
            <strong>{anchor.title}</strong>
            <span>{anchor.focus}</span>
          </a>
        ))}
      </nav>
      <ol>
        {lenses.map((lens) => (
          <li key={lens.id}>
            <strong>{lens.title}</strong>
            <dl>
              <dt>Route</dt>
              <dd>{lens.route}</dd>
              <dt>Proof</dt>
              <dd>{lens.proof}</dd>
              <dt>Boundary</dt>
              <dd>{lens.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/MirrorStateSequencer.client.tsx

The mirror state sequencer is a client leaf because it owns only local selected-state. It cannot store memory, call a network, execute code, write files, deploy, post publicly, infer identity, change production status, or grant autonomy.

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { MirrorStateSequencerPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorStateSequencerPacket[];
  initialPacketId?: string;
};

export function MirrorStateSequencer({ packets, initialPacketId }: Props) {
  const firstPacketId = packets[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialPacketId ?? firstPacketId);
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) {
    return null;
  }

  return (
    <section
      id="mirror-state-sequencer"
      aria-labelledby="mirror-state-sequencer-title"
      data-runtime-owner="bounded-state-sequencer"
      data-active-state={activePacket.id}
    >
      <p>Mirror state sequencer</p>
      <h3 id="mirror-state-sequencer-title">The whole story is a bounded organism loop.</h3>
      <fieldset>
        <legend>Choose a mirror story state</legend>
        {packets.map((packet) => (
          <button
            key={packet.id}
            type="button"
            aria-pressed={activePacket.id === packet.id}
            onClick={() => setActiveId(packet.id)}
          >
            <span>{packet.index}</span>
            <span>{packet.tab}</span>
          </button>
        ))}
      </fieldset>

      <dl aria-live="polite">
        <div>
          <dt>Signal</dt>
          <dd>{activePacket.signal}</dd>
        </div>
        <div>
          <dt>Organism response</dt>
          <dd>{activePacket.response}</dd>
        </div>
        <div>
          <dt>Proof return</dt>
          <dd>{activePacket.proof}</dd>
        </div>
        <div>
          <dt>Boundary lock</dt>
          <dd>{activePacket.boundary}</dd>
        </div>
      </dl>
      <a href={activePacket.href}>{activePacket.linkLabel}</a>
    </section>
  );
}
```

## components/mirror/RecursiveGrowthTimeline.tsx

The recursive growth timeline is server-rendered. It keeps self-evolution legible by naming the signal, verification requirement, and authority stop for every growth gate.

```tsx
import type { RecursiveGrowthGate } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  gates: readonly RecursiveGrowthGate[];
};

export function RecursiveGrowthTimeline({ gates }: Props) {
  return (
    <section id="mirror-recursive-growth-timeline" aria-labelledby="mirror-recursive-growth-timeline-title">
      <p>Recursive growth timeline</p>
      <h3 id="mirror-recursive-growth-timeline-title">
        Self-evolution earns density one verified gate at a time.
      </h3>

      <ol>
        {gates.map((gate) => (
          <li key={gate.id} data-growth-gate={gate.id}>
            <span>{gate.index}</span>
            <strong>{gate.title}</strong>
            <dl>
              <dt>Signal</dt>
              <dd>{gate.signal}</dd>
              <dt>Verification</dt>
              <dd>{gate.verification}</dd>
              <dt>Authority stop</dt>
              <dd>{gate.authorityStop}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/CognitiveEvolutionTrace.tsx

The cognitive evolution trace is server-rendered. It turns the living-intelligence metaphor into a six-step route with one evolution claim and one proof lock per step.

```tsx
import type { CognitiveEvolutionTraceStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly CognitiveEvolutionTraceStep[];
};

export function CognitiveEvolutionTrace({ steps }: Props) {
  return (
    <section id="mirror-cognitive-evolution-trace" aria-labelledby="mirror-cognitive-trace-title">
      <p>05B / Cognitive evolution trace</p>
      <h3 id="mirror-cognitive-trace-title">
        A living intelligence is a loop you can inspect.
      </h3>

      <ol aria-label="Inspectable cognitive evolution steps">
        {steps.map((step) => (
          <li key={step.id} data-cognitive-step={step.id}>
            <span>{step.index}</span>
            <strong>{step.title}</strong>
            <dl>
              <dt>Evolves</dt>
              <dd>{step.evolves}</dd>
              <dt>Proof lock</dt>
              <dd>{step.proofLock}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/JoinEvolutionRoutes.tsx

The join routes are server-rendered. They make conversion readable by pairing every role with a next action, proof path, and authority boundary.

```tsx
import type { JoinEvolutionRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly JoinEvolutionRoute[];
};

export function JoinEvolutionRoutes({ routes }: Props) {
  return (
    <nav id="mirror-join-evolution-routes" aria-label="Infinity Mirror join evolution routes">
      {routes.map((route) => (
        <a key={route.href} href={route.href}>
          <span>{route.role}</span>
          <strong>{route.title}</strong>
          <span>{route.next}</span>
          <dl>
            <dt>Proof</dt>
            <dd>{route.proof}</dd>
            <dt>Boundary</dt>
            <dd>{route.boundary}</dd>
          </dl>
        </a>
      ))}
    </nav>
  );
}
```

## components/mirror/FirstArtifactRouter.tsx

The first artifact router is server-rendered. It turns conversion into an inspectable first packet: what the visitor brings, what Unwind returns first, where proof lives, and what still requires explicit approval.

```tsx
import type { FirstArtifactRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly FirstArtifactRoute[];
};

export function FirstArtifactRouter({ routes }: Props) {
  return (
    <section id="mirror-first-artifact-router" aria-labelledby="mirror-first-artifact-router-title" data-runtime-owner="semantic-first-artifact-router">
      <p>First artifact router</p>
      <h3 id="mirror-first-artifact-router-title">The next step is a packet someone can inspect.</h3>
      <ol aria-label="Role to first artifact paths">
        {routes.map((route) => (
          <li key={route.id} data-first-artifact-route={route.id}>
            <span>{route.label}</span>
            <strong>{route.title}</strong>
            <dl>
              <dt>Bring</dt>
              <dd>{route.bring}</dd>
              <dt>First artifact</dt>
              <dd>{route.firstArtifact}</dd>
              <dt>Proof route</dt>
              <dd>{route.proofRoute}</dd>
              <dt>Approval boundary</dt>
              <dd>{route.approvalBoundary}</dd>
            </dl>
            <a href={route.href}>{route.cta}</a>
          </li>
        ))}
      </ol>
      <p>The router does not submit data, create a lead, start a build, spend money, deploy, post publicly, or grant autonomy.</p>
    </section>
  );
}
```

## components/mirror/EvolutionEntryProtocol.tsx

The evolution entry protocol is server-rendered. It explains what happens after the doorway: signal, boundary, first proof, and next loop.

```tsx
import type { EvolutionEntryProtocolStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly EvolutionEntryProtocolStep[];
};

export function EvolutionEntryProtocol({ steps }: Props) {
  return (
    <section id="mirror-evolution-entry-protocol" aria-labelledby="mirror-evolution-entry-protocol-title">
      <p>Entry protocol</p>
      <h3 id="mirror-evolution-entry-protocol-title">Joining is a proof loop, not a form.</h3>
      <ol aria-label="Evolution entry protocol steps">
        {steps.map((step) => (
          <li key={step.id} data-entry-step={step.id}>
            <span>{step.label}</span>
            <strong>{step.title}</strong>
            <dl>
              <dt>Input</dt>
              <dd>{step.input}</dd>
              <dt>Proof output</dt>
              <dd>{step.proofOutput}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/FloatingArchitectureMaps.tsx

The floating architecture maps are server-rendered. Drift and glass effects are optional; route, proof, and boundary stay in HTML.

```tsx
import type { ArchitectureMapPane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  panes: readonly ArchitectureMapPane[];
};

export function FloatingArchitectureMaps({ panes }: Props) {
  return (
    <section id="mirror-floating-architecture-maps" aria-labelledby="mirror-floating-architecture-maps-title">
      <p>Floating architecture maps</p>
      <h3 id="mirror-floating-architecture-maps-title">
        A living interface earns trust by showing the route a signal takes.
      </h3>

      <ol>
        {panes.map((pane) => (
          <li key={pane.id} data-architecture-pane={pane.id}>
            <span>{pane.index}</span>
            <strong>{pane.title}</strong>
            <dl>
              <dt>Route</dt>
              <dd>{pane.route}</dd>
              <dt>Proves</dt>
              <dd>{pane.proves}</dd>
              <dt>Boundary</dt>
              <dd>{pane.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/PhaseProofLedger.tsx

The phase proof ledger is server-rendered. It ties the seven build phases to one proof artifact, one visible surface, and one authority boundary before any future runtime claims more.

```tsx
import type { PhaseProofLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly PhaseProofLedgerEntry[];
};

export function PhaseProofLedger({ entries }: Props) {
  return (
    <section id="mirror-phase-proof-ledger" aria-labelledby="mirror-phase-proof-ledger-title">
      <p>Phase proof ledger</p>
      <h3 id="mirror-phase-proof-ledger-title">
        Seven phases now resolve into evidence, surface, and boundary.
      </h3>

      <ol>
        {entries.map((entry) => (
          <li key={entry.id} data-phase-proof={entry.id}>
            <span>{entry.label}</span>
            <strong>{entry.title}</strong>
            <dl>
              <dt>Evidence</dt>
              <dd>{entry.evidence}</dd>
              <dt>Surface</dt>
              <dd>
                <a href={entry.surfaceHref}>{entry.surfaceLabel}</a>
              </dd>
              <dt>Boundary</dt>
              <dd>{entry.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/ProofCascade.tsx

The proof cascade is server-rendered. It turns each proof claim into evidence, artifact, and boundary before the visitor reaches conversion.

```tsx
import type { ProofCascadeStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly ProofCascadeStep[];
};

export function ProofCascade({ steps }: Props) {
  return (
    <section id="mirror-proof-cascade" aria-labelledby="mirror-proof-cascade-title">
      <p>Proof cascade</p>
      <h3 id="mirror-proof-cascade-title">Wonder stabilizes when every claim becomes evidence.</h3>

      <ol>
        {steps.map((step) => (
          <li key={step.id} data-proof-step={step.id}>
            <span>{step.index}</span>
            <strong>{step.title}</strong>
            <dl>
              <dt>Claim</dt>
              <dd>{step.claim}</dd>
              <dt>Evidence</dt>
              <dd>{step.evidence}</dd>
              <dt>Artifact</dt>
              <dd>
                <a href={step.artifact}>{step.artifact}</a>
              </dd>
              <dt>Boundary</dt>
              <dd>{step.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/RecursiveBrainTunnel.tsx

The recursive brain tunnel is server-rendered. It makes signal, cells, boundary, and proof readable before any Three/WebGL depth layer can run.

```tsx
import type { RecursiveBrainTunnelStep } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  steps: readonly RecursiveBrainTunnelStep[];
};

export function RecursiveBrainTunnel({ steps }: Props) {
  return (
    <section id="mirror-recursive-brain-tunnel" aria-labelledby="mirror-recursive-brain-tunnel-title" data-runtime-owner="semantic-brain-tunnel">
      <h3 id="mirror-recursive-brain-tunnel-title">Move through the route a signal takes.</h3>
      <ol>
        {steps.map((step) => (
          <li key={step.id} data-tunnel-step={step.id}>
            <span>{step.index}</span>
            <strong>{step.title}</strong>
            <p>{step.description}</p>
            <small>{step.cell}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/BrainRouteConsole.tsx

The brain route console is server-rendered. It keeps the default handoff, route stages, and state grid visible before any runtime pulse highlights them.

```tsx
import type { BrainRouteStage, BrainSignalHandoffPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  handoff: BrainSignalHandoffPacket;
  stages: readonly BrainRouteStage[];
};

export function BrainRouteConsole({ handoff, stages }: Props) {
  return (
    <section id="mirror-brain-route-console" aria-labelledby="mirror-brain-route-console-title" data-runtime-owner="bounded-brain-route">
      <h3 id="mirror-brain-route-console-title">A reflection request crosses cells before it becomes advice.</h3>
      <dl>
        <dt>Signal handoff</dt>
        <dd data-brain-handoff="signal">{handoff.signal}</dd>
        <dt>Cells</dt>
        <dd data-brain-handoff="cells">{handoff.cells}</dd>
        <dt>Authority lock</dt>
        <dd data-brain-handoff="authority">{handoff.authority}</dd>
        <dt>Proof return</dt>
        <dd data-brain-handoff="proof">{handoff.proof}</dd>
      </dl>
      <ol>
        {stages.map((stage) => (
          <li key={stage.id} data-route-stage={stage.id}>
            <span>{stage.index}</span>
            <strong>{stage.title}</strong>
            <p data-brain-route-copy={stage.id}>{handoff[stage.id]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/BrainSignalHandoff.client.tsx

The brain signal handoff is a client leaf because it owns local selected-signal state only. It does not store memory, call a network, write files, execute code, deploy, post, or claim identity authority.

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { BrainRouteStage, BrainSignalHandoffPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly BrainSignalHandoffPacket[];
  stages: readonly BrainRouteStage[];
};

export function BrainSignalHandoff({ packets, stages }: Props) {
  const [activeId, setActiveId] = useState(packets[0]?.id ?? '');
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) return null;

  return (
    <section id="mirror-brain-signal-handoff" data-runtime-owner="bounded-brain-signal-handoff">
      {packets.map((packet) => (
        <button key={packet.id} type="button" aria-pressed={activePacket.id === packet.id} onClick={() => setActiveId(packet.id)}>
          {packet.tab}
        </button>
      ))}
      <dl aria-live="polite">
        <dt>Signal handoff</dt>
        <dd>{activePacket.signal}</dd>
        <dt>Cells</dt>
        <dd>{activePacket.cells}</dd>
        <dt>Authority lock</dt>
        <dd>{activePacket.authority}</dd>
        <dt>Proof return</dt>
        <dd>{activePacket.proof}</dd>
      </dl>
      {stages.map((stage) => (
        <p key={stage.id} data-brain-route-copy={stage.id}>{activePacket[stage.id]}</p>
      ))}
    </section>
  );
}
```

## components/mirror/BrainCellNetwork.tsx

The brain cell network is server-rendered. It makes gateway, cortex, memory, cells, immune gate, and proof loop inspectable before any canvas, Three.js, or Framer layer can make the route feel alive.

```tsx
import type { BrainCellNode } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  cells: readonly BrainCellNode[];
};

export function BrainCellNetwork({ cells }: Props) {
  return (
    <section id="mirror-brain-cell-network" aria-labelledby="mirror-brain-cell-network-title">
      <p>Brain cell network</p>
      <h3 id="mirror-brain-cell-network-title">The Brain routes signal through cells before action.</h3>

      <ol>
        {cells.map((cell) => (
          <li key={cell.id} data-cell-id={cell.id}>
            <span>{cell.label}</span>
            <strong>{cell.title}</strong>
            <dl>
              <dt>Signal</dt>
              <dd>{cell.signal}</dd>
              <dt>Path</dt>
              <dd>{cell.path}</dd>
              <dt>Proof</dt>
              <dd>{cell.proof}</dd>
              <dt>Authority stop</dt>
              <dd>{cell.authorityStop}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/LivingOrganismVisualizer.tsx

The living organism visualizer is server-rendered. It turns the ecosystem orbit into real links and proof paths, not a decorative product cloud.

```tsx
import type { OrganismVisualizerNode } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  organisms: readonly OrganismVisualizerNode[];
};

export function LivingOrganismVisualizer({ organisms }: Props) {
  return (
    <section id="mirror-living-organism-visualizer" aria-labelledby="mirror-living-organism-visualizer-title">
      <p>Living organism visualizer</p>
      <h3 id="mirror-living-organism-visualizer-title">
        The ecosystem shares one spine, then diverges into proof paths.
      </h3>

      <nav aria-label="Unwind organism proof paths">
        {organisms.map((organism) => (
          <a key={organism.id} href={organism.href} data-organism={organism.id}>
            <span>{organism.label}</span>
            <strong>{organism.title}</strong>
            <dl>
              <dt>Signal</dt>
              <dd>{organism.signal}</dd>
              <dt>Memory</dt>
              <dd>{organism.memory}</dd>
              <dt>Authority</dt>
              <dd>{organism.authority}</dd>
              <dt>Proof</dt>
              <dd>{organism.proof}</dd>
            </dl>
          </a>
        ))}
      </nav>
    </section>
  );
}
```

## components/mirror/MotionContractLedger.tsx

The motion contract ledger is server-rendered. It names the production promise for each cinematic move before Framer, GSAP, Three, or WebGL can own any runtime behavior.

```tsx
import type { MotionContract } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  contracts: readonly MotionContract[];
};

export function MotionContractLedger({ contracts }: Props) {
  return (
    <section id="mirror-motion-contract" aria-labelledby="mirror-motion-contract-title">
      <p>Motion contract</p>
      <h3 id="mirror-motion-contract-title">Every cinematic move has a proof job.</h3>
      <p>
        The experience can feel alive only when each motion explains the organism:
        what triggered it, what changed, how long it runs, and how it stays lightweight.
      </p>

      <ol>
        {contracts.map((contract) => (
          <li key={contract.id}>
            <span>{contract.label}</span>
            <strong>{contract.title}</strong>
            <dl>
              <div>
                <dt>Trigger</dt>
                <dd>{contract.trigger}</dd>
              </div>
              <div>
                <dt>Animation</dt>
                <dd>{contract.animation}</dd>
              </div>
              <div>
                <dt>Timing</dt>
                <dd>{contract.timing}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{contract.duration}</dd>
              </div>
              <div>
                <dt>Easing</dt>
                <dd>{contract.easing}</dd>
              </div>
              <div>
                <dt>Performance</dt>
                <dd>{contract.performance}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/DesireTranslationWall.tsx

The desire wall is server-rendered. It carries research translation, organism routing, proof gates, and authority stops without adding a motion dependency or hiding meaning in a visual layer.

```tsx
import type { DesireTranslationRoute } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  routes: readonly DesireTranslationRoute[];
};

export function DesireTranslationWall({ routes }: Props) {
  return (
    <section id="mirror-desire-translation" aria-labelledby="mirror-desire-translation-title">
      <div>
        <p>Research Translation</p>
        <h2 id="mirror-desire-translation-title">
          Human desire becomes product routes, not vague aspiration.
        </h2>
        <p>
          Anthropic's 81K desire categories are translated into organism paths,
          proof gates, and authority stops so the mirror can clarify what to build
          without claiming identity authority.
        </p>
        <a href="https://www.anthropic.com/research/values-wild">Source pattern</a>
      </div>

      <ol aria-label="81K desire categories translated into organism routes">
        {routes.map((route) => (
          <li key={route.id}>
            <span>{route.label}</span>
            <strong>{route.title}</strong>
            <p>{route.description}</p>
            <dl>
              <div>
                <dt>Organism route</dt>
                <dd>{route.organismRoute}</dd>
              </div>
              <div>
                <dt>Proof gate</dt>
                <dd>{route.proofGate}</dd>
              </div>
              <div>
                <dt>Authority stop</dt>
                <dd>{route.authorityStop}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/MirrorRouteCompass.tsx

The route compass is server-rendered. It turns the 81K desire signal into a chapter route, proof return, authority stop, and CTA before any adaptive lens or runtime state can claim a path.

```tsx
import type { MirrorRouteCompassEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly MirrorRouteCompassEntry[];
};

export function MirrorRouteCompass({ entries }: Props) {
  return (
    <section id="mirror-route-compass" aria-labelledby="mirror-route-compass-title" data-runtime-owner="semantic-route-compass">
      <p>Mirror route compass</p>
      <h2 id="mirror-route-compass-title">
        The mirror chooses a chapter only after the signal earns a route.
      </h2>
      <p>
        The 81K signal becomes useful when a visitor can see where their desire enters the story,
        what proof comes back, and which authority boundary stays closed.
      </p>
      <ol aria-label="Human signal routes through the mirror chapters">
        {entries.map((entry) => (
          <li key={entry.id} data-route-compass={entry.id}>
            <span>{entry.label}</span>
            <strong>{entry.title}</strong>
            <p>{entry.description}</p>
            <dl>
              <dt>Chapter</dt>
              <dd>{entry.chapter}</dd>
              <dt>Proof return</dt>
              <dd>{entry.proofReturn}</dd>
              <dt>Authority stop</dt>
              <dd>{entry.authorityStop}</dd>
            </dl>
            <a href={entry.href}>{entry.cta}</a>
          </li>
        ))}
      </ol>
      <p>
        The compass is a semantic routing map. It does not infer identity, store a preference,
        submit data, call a model, start a build, move money, deploy, post, or grant autonomy.
      </p>
    </section>
  );
}
```

## components/mirror/ScrollChoreographyMap.tsx

The scroll map is server-rendered. Motion libraries may animate its appearance later, but the seven-act story remains readable without JavaScript.

```tsx
import type { ScrollChoreographyAct } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  acts: readonly ScrollChoreographyAct[];
};

export function ScrollChoreographyMap({ acts }: Props) {
  return (
    <section id="mirror-scroll-choreography" aria-labelledby="mirror-scroll-choreography-title">
      <p>Scroll choreography map</p>
      <h3 id="mirror-scroll-choreography-title">
        The visitor descends through seven proof-bearing acts.
      </h3>
      <p>
        Each scroll beat changes focus, reveals a motion layer, and returns the visitor
        to an inspectable proof surface.
      </p>

      <ol>
        {acts.map((act) => (
          <li key={act.id}>
            <span>{act.label}</span>
            <strong>{act.title}</strong>
            <dl>
              <div>
                <dt>Focus</dt>
                <dd>{act.focus}</dd>
              </div>
              <div>
                <dt>Motion</dt>
                <dd>{act.motion}</dd>
              </div>
              <div>
                <dt>Proof return</dt>
                <dd>{act.proofReturn}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/ProofObservatory.client.tsx

The proof observatory is a client leaf because it owns only local selected-proof-lane state. It cannot read live telemetry, store hidden state, execute code, write files, deploy, post publicly, grant autonomy, or change production status.

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { MirrorProofObservatoryPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorProofObservatoryPacket[];
  initialPacketId?: string;
};

export function ProofObservatory({ packets, initialPacketId }: Props) {
  const firstPacketId = packets[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialPacketId ?? firstPacketId);
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) {
    return null;
  }

  return (
    <section
      id="mirror-proof-observatory"
      aria-labelledby="mirror-proof-observatory-title"
      data-runtime-owner="bounded-proof-observatory"
      data-active-proof={activePacket.id}
    >
      <p>Proof observatory</p>
      <h3 id="mirror-proof-observatory-title">
        Architecture, metrics, deployments, and status become one inspectable instrument.
      </h3>
      <fieldset>
        <legend>Choose an evidence lane</legend>
        {packets.map((packet) => (
          <button
            key={packet.id}
            type="button"
            aria-pressed={activePacket.id === packet.id}
            onClick={() => setActiveId(packet.id)}
          >
            <span>{packet.tab}</span>
            <span>{packet.tabDescription}</span>
          </button>
        ))}
      </fieldset>

      <dl aria-live="polite">
        <div>
          <dt>Evidence path</dt>
          <dd>{activePacket.evidence}</dd>
        </div>
        <div>
          <dt>Current signal</dt>
          <dd>{activePacket.signal}</dd>
        </div>
        <div>
          <dt>Authority boundary</dt>
          <dd>{activePacket.boundary}</dd>
        </div>
        <div>
          <dt>Next artifact</dt>
          <dd>
            <a href={activePacket.href}>{activePacket.linkLabel}</a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
```

## components/mirror/AuthorityGradient.tsx

The authority gradient stays server-rendered. It explains permission rungs only; it cannot store memory, infer identity, control wallets, execute code, write files, deploy, post, broadcast Web3 transactions, change status, or grant autonomy.

```tsx
import type { AuthorityGradientRung } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  rungs: readonly AuthorityGradientRung[];
};

export function AuthorityGradient({ rungs }: Props) {
  return (
    <section id="mirror-authority-gradient" aria-labelledby="mirror-authority-gradient-title">
      <p>Authority gradient</p>
      <h3 id="mirror-authority-gradient-title">The mirror earns permission one gate at a time.</h3>
      <p>Each rung names what the system may do, what proof must exist, and what remains human-owned.</p>

      <ol aria-label="Authority gradient rungs">
        {rungs.map((rung) => (
          <li key={rung.id} data-authority-rung={rung.id}>
            <span>{rung.label}</span>
            <strong>{rung.title}</strong>
            <dl>
              <div>
                <dt>Can do</dt>
                <dd>{rung.canDo}</dd>
              </div>
              <div>
                <dt>Proof required</dt>
                <dd>{rung.proofRequired}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>

      <p>No rung grants hidden memory, identity authority, wallet control, public posting, deployment, or status changes by itself.</p>
    </section>
  );
}
```

## components/mirror/EmotionalProgressionRail.client.tsx

The emotional progression rail is a client leaf because it owns only local selected-emotion state. It cannot profile emotion, infer identity, store memory, call a network, write files, execute code, deploy, or post publicly.

```tsx
'use client';

import { useMemo, useState } from 'react';
import type { MirrorEmotionalProgressionPacket } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  packets: readonly MirrorEmotionalProgressionPacket[];
  initialPacketId?: string;
};

export function EmotionalProgressionRail({ packets, initialPacketId }: Props) {
  const firstPacketId = packets[0]?.id ?? '';
  const [activeId, setActiveId] = useState(initialPacketId ?? firstPacketId);
  const activePacket = useMemo(
    () => packets.find((packet) => packet.id === activeId) ?? packets[0],
    [activeId, packets],
  );

  if (!activePacket) {
    return null;
  }

  return (
    <section
      id="mirror-emotional-progression"
      aria-labelledby="mirror-emotional-progression-title"
      data-runtime-owner="bounded-emotional-progress"
      data-active-emotion={activePacket.id}
    >
      <p>Emotional progression</p>
      <h3 id="mirror-emotional-progression-title">
        The experience moves feeling into proof before it asks for trust.
      </h3>
      <fieldset>
        <legend>Choose an emotional progression state</legend>
        {packets.map((packet) => (
          <button
            key={packet.id}
            type="button"
            aria-pressed={activePacket.id === packet.id}
            onClick={() => setActiveId(packet.id)}
          >
            <span>{packet.tab}</span>
            <span>{packet.tabDescription}</span>
          </button>
        ))}
      </fieldset>

      <dl aria-live="polite">
        <div>
          <dt>Feeling</dt>
          <dd>{activePacket.feeling}</dd>
        </div>
        <div>
          <dt>Organism route</dt>
          <dd>{activePacket.organism}</dd>
        </div>
        <div>
          <dt>Proof return</dt>
          <dd>{activePacket.proof}</dd>
        </div>
        <div>
          <dt>Authority boundary</dt>
          <dd>{activePacket.boundary}</dd>
        </div>
      </dl>
    </section>
  );
}
```

## components/mirror/ExperienceAuditConsole.tsx

The experience audit console is server-rendered. It turns Phase 1 into reusable interface code by rendering purpose, why it works, and Unwind reinterpretation for each reverse-engineering lens.

```tsx
import type { ExperienceAuditLens } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lenses: readonly ExperienceAuditLens[];
};

export function ExperienceAuditConsole({ lenses }: Props) {
  return (
    <section id="mirror-experience-audit" aria-labelledby="mirror-experience-audit-title">
      <h3 id="mirror-experience-audit-title">Reverse engineering becomes a public design instrument.</h3>
      <ol>
        {lenses.map((lens) => (
          <li key={lens.id} data-audit-lens={lens.id}>
            <span>{lens.index}</span>
            <strong>{lens.title}</strong>
            <dl>
              <dt>Purpose</dt>
              <dd>{lens.purpose}</dd>
              <dt>Why it works</dt>
              <dd>{lens.works}</dd>
              <dt>Unwind reinterpretation</dt>
              <dd>{lens.reinterpret}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/SourceTranslationLedger.tsx

The source translation ledger is server-rendered. It keeps the non-clone boundary visible by separating source pattern, Unwind translation, and boundary.

```tsx
import type { SourceTranslationLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly SourceTranslationLedgerEntry[];
};

export function SourceTranslationLedger({ entries }: Props) {
  return (
    <section id="mirror-source-ledger" aria-labelledby="mirror-source-ledger-title">
      <h3 id="mirror-source-ledger-title">The source teaches structure, not skin.</h3>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} data-source-translation={entry.id}>
            <span>{entry.label}</span>
            <dl>
              <dt>Source pattern</dt>
              <dd>{entry.sourcePattern}</dd>
              <dt>Unwind translation</dt>
              <dd>{entry.unwindTranslation}</dd>
              <dt>Boundary</dt>
              <dd>{entry.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/EngineTranslationLedger.tsx

The engine translation ledger is server-rendered. It maps every imported engine concept to a decision, product translation, and guard.

```tsx
import type { EngineTranslationLedgerEntry } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  entries: readonly EngineTranslationLedgerEntry[];
};

export function EngineTranslationLedger({ entries }: Props) {
  return (
    <section id="mirror-engine-translation" aria-labelledby="mirror-engine-translation-title">
      <h3 id="mirror-engine-translation-title">
        The local engine concept becomes progress, lens, artifact, and approval states.
      </h3>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} data-engine-translation={entry.id}>
            <span>{entry.label}</span>
            <strong>{entry.concept}</strong>
            <span>{entry.decision}</span>
            <dl>
              <dt>Translation</dt>
              <dd>{entry.translation}</dd>
              <dt>Guard</dt>
              <dd>{entry.guard}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/InterfaceBuildLedger.tsx

The interface build ledger is server-rendered. It keeps Phase 6 and Phase 7 as visible gates instead of hiding migration readiness in prose.

```tsx
import type { InterfaceBuildStage } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  stages: readonly InterfaceBuildStage[];
};

export function InterfaceBuildLedger({ stages }: Props) {
  return (
    <section id="mirror-build-ledger" aria-labelledby="mirror-build-ledger-title">
      <h3 id="mirror-build-ledger-title">Phase 6 and Phase 7 become build gates a team can inspect.</h3>
      <ol>
        {stages.map((stage) => (
          <li key={stage.id} data-build-stage={stage.id}>
            <span>{stage.label}</span>
            <strong>{stage.title}</strong>
            <p>{stage.description}</p>
            <dl>
              <dt>Artifact</dt>
              <dd>{stage.artifact}</dd>
              <dt>Boundary</dt>
              <dd>{stage.boundary}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/RuntimeHandoffMatrix.tsx

The runtime handoff matrix is server-rendered. It assigns CSS, Framer, GSAP, and Three/WebGL to separate lanes with an owner, job, fallback, and stop condition.

```tsx
import type { RuntimeHandoffLane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lanes: readonly RuntimeHandoffLane[];
};

export function RuntimeHandoffMatrix({ lanes }: Props) {
  return (
    <section id="mirror-runtime-handoff" aria-labelledby="mirror-runtime-handoff-title">
      <h3 id="mirror-runtime-handoff-title">Each runtime gets one job, one fallback, and one stop condition.</h3>
      <ol>
        {lanes.map((lane) => (
          <li key={lane.id} data-runtime-lane={lane.id}>
            <span>{lane.label}</span>
            <dl>
              <dt>Owner</dt>
              <dd>{lane.owner}</dd>
              <dt>Job</dt>
              <dd>{lane.job}</dd>
              <dt>Fallback</dt>
              <dd>{lane.fallback}</dd>
              <dt>Stop condition</dt>
              <dd>{lane.stopCondition}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/MirrorDepthGate.tsx

The depth gate is server-rendered. It decides when semantic, Framer, GSAP, and Three/WebGL depth lanes are allowed to activate.

```tsx
import type { MirrorDepthGateLane } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  lanes: readonly MirrorDepthGateLane[];
};

export function MirrorDepthGate({ lanes }: Props) {
  return (
    <section id="mirror-depth-gate" aria-labelledby="mirror-depth-gate-title">
      <p>Depth readiness gate</p>
      <h3 id="mirror-depth-gate-title">
        The mirror becomes cinematic only when the fallback is already true.
      </h3>
      <p>
        Depth is a privilege layer. CSS, Framer, GSAP, and Three/WebGL can deepen
        the portal only after semantic meaning, proof routes, mobile behavior,
        and shutdown rules are visible.
      </p>

      <ol>
        {lanes.map((lane) => (
          <li key={lane.id} data-depth-lane={lane.id}>
            <span>{lane.label}</span>
            <strong>{lane.title}</strong>
            <dl>
              <dt>Trigger</dt>
              <dd>{lane.trigger}</dd>
              <dt>Allowed</dt>
              <dd>{lane.allowed}</dd>
              <dt>Proof needed</dt>
              <dd>{lane.proofNeeded}</dd>
              <dt>Fallback</dt>
              <dd>{lane.fallback}</dd>
              <dt>Kill switch</dt>
              <dd>{lane.killSwitch}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/InfinitySymbolLanguage.tsx

The infinity mark is not decoration. It is a semantic system: every state names the loop, proof return, and authority boundary it represents.

```tsx
import type { InfinitySymbolState } from '@/lib/mirror/infinityMirrorContent';

type Props = {
  states: readonly InfinitySymbolState[];
};

export function InfinitySymbolLanguage({ states }: Props) {
  return (
    <section id="mirror-infinity-language" aria-labelledby="mirror-infinity-language-title">
      <p>Mirror engine language</p>
      <h3 id="mirror-infinity-language-title">The symbol means loop plus boundary.</h3>
      <p>
        The infinity mark has seven public states. Each state names what loops,
        what proves it, and where authority stops.
      </p>

      <ol>
        {states.map((state) => (
          <li key={state.id}>
            <span>{state.index}</span>
            <b aria-hidden="true">&infin;</b>
            <strong>{state.title}</strong>
            <p>{state.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

## components/mirror/MirrorChapterMotion.client.tsx

Framer owns local reveal and route-card microinteractions only. It never owns scroll position or public meaning.

```tsx
'use client';

import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type MirrorCell = {
  id: string;
  label: string;
  proof: string;
};

type Props = {
  chapterId: string;
  cells: MirrorCell[];
};

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

export const MirrorChapterMotion = memo(function MirrorChapterMotion({ chapterId, cells }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <ul className="mirror-motion-list" data-motion-state="static">
        {cells.map((cell) => (
          <li key={cell.id}>
            <span>{cell.label}</span>
            <strong>{cell.proof}</strong>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <motion.ul
      className="mirror-motion-list"
      data-motion-state="framer-leaf"
      data-chapter-id={chapterId}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
    >
      {cells.map((cell) => (
        <motion.li key={cell.id} variants={item} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <span>{cell.label}</span>
          <strong>{cell.proof}</strong>
        </motion.li>
      ))}
    </motion.ul>
  );
});
```

## components/mirror/MirrorPortalTimeline.client.tsx

GSAP owns only the optional desktop portal timeline. It uses cleanup and skips reduced motion, mobile, and unsupported contexts.

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function MirrorPortalTimeline() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 760px)').matches;

    if (!root || reduce || compact) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: '+=520%',
            scrub: true,
            pin: true,
          },
        })
        .to('[data-portal-glyph]', { scale: 1.16, opacity: 0.92, duration: 0.8 })
        .to('[data-portal-shard]', { xPercent: 18, opacity: 1, stagger: 0.05, duration: 0.6 })
        .to('[data-portal-cell]', { scale: 1, opacity: 1, stagger: 0.04, duration: 0.6 })
        .to('[data-portal-proof]', { opacity: 1, y: 0, duration: 0.6 });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mirror-portal-stage" aria-hidden="true">
      <span data-portal-glyph className="mirror-portal-glyph">infinity</span>
      <span data-portal-shard className="mirror-portal-shard" />
      <span data-portal-cell className="mirror-portal-cell" />
      <span data-portal-proof className="mirror-portal-proof" />
    </div>
  );
}
```

## components/mirror/MirrorBrainTunnelGate.client.tsx

Three/WebGL is an optional desktop enhancement. The semantic tunnel remains in the server-rendered page.

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  fallbackId: string;
};

export function MirrorBrainTunnelGate({ fallbackId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 900px)').matches;

    if (!canvas || reduce || compact) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, canvas.clientWidth / canvas.clientHeight, 0.1, 80);
    camera.position.z = 9;

    const geometry = new THREE.TorusGeometry(1.5, 0.01, 12, 96);
    const material = new THREE.MeshBasicMaterial({ color: 0xb9f7ef, transparent: true, opacity: 0.32 });
    const rings = Array.from({ length: 18 }, (_, index) => {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.z = -index * 0.42;
      mesh.rotation.z = index * 0.21;
      scene.add(mesh);
      return mesh;
    });

    let frame = 0;
    let active = true;

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
    });
    observer.observe(canvas);

    function tick(time: number) {
      frame = requestAnimationFrame(tick);
      if (!active) return;

      for (const [index, ring] of rings.entries()) {
        ring.rotation.z = time * 0.00008 + index * 0.2;
        ring.scale.setScalar(1 + Math.sin(time * 0.0005 + index) * 0.025);
      }

      renderer.render(scene, camera);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const ring of rings) {
        ring.geometry.dispose();
        Array.isArray(ring.material)
          ? ring.material.forEach((entry) => entry.dispose())
          : ring.material.dispose();
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="mirror-brain-tunnel-canvas" aria-hidden="true" data-fallback-id={fallbackId} />;
}
```

## tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mirror: {
          void: '#030307',
          graphite: '#090B12',
          reflection: '#B9F7EF',
          proof: '#D6A84F',
          boundary: '#13B8A6',
          organism: '#7D53FF',
        },
      },
      borderRadius: {
        mirror: '8px',
      },
      transitionTimingFunction: {
        mirror: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'mirror-inner': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
} satisfies Config;
```

## lib/mirror/infinityMirrorAssets.ts

```ts
export const infinityMirrorAssets = {
  portalSvg: '/assets/visuals/infinity-mirror-portal.svg',
  implementationPacket: '/assets/specs/infinity-mirror-implementation-packet.json',
  runtimeCodeHandoff: '/assets/specs/infinity-mirror-runtime-code-handoff.md',
  runtimeKit: '/assets/specs/infinity-mirror-runtime-kit/README.md',
  socialPreview: '/assets/social/unwindcode-lab-preview.svg',
} as const;

export const infinityMirrorAssetRules = [
  'No critical text inside SVG, canvas, or WebGL.',
  'Semantic HTML and i18n strings carry public meaning.',
  'Reduced motion must keep every chapter readable.',
  'Every public release updates llms.txt, ai-services.json, sitemap, manifest, tests, and social packet.',
  'Deploy only after explicit approval.',
] as const;
```
