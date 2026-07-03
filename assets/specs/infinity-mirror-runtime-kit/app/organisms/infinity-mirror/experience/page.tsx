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
import { MirrorBrainTunnelGate } from '@/components/mirror/MirrorBrainTunnelGate.client';
import { MirrorChapterMotion } from '@/components/mirror/MirrorChapterMotion.client';
import { MirrorPortalTimeline } from '@/components/mirror/MirrorPortalTimeline.client';
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
  mirrorStructuredData,
  motionContracts,
  phaseProofLedgerEntries,
  proofCascadeSteps,
  proofRoutes,
  reflectionNavigatorLenses,
  recursiveBrainTunnelSteps,
  recursiveGrowthGates,
  scrollChoreographyActs,
  signalComposerPackets,
  runtimeHandoffLanes,
  sourceTranslationLedgerEntries,
  returnedArtifactFields,
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
    <main className="min-h-[100dvh] bg-mirror-void text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mirrorStructuredData) }}
      />

      <section
        id="mirror-experience-hero"
        aria-labelledby="mirror-question-title"
        className="mx-auto grid min-h-[100dvh] w-full max-w-7xl grid-cols-1 gap-12 px-5 py-28 md:grid-cols-[0.92fr_1.08fr] md:px-8"
      >
        <div className="flex max-w-2xl flex-col justify-center gap-7">
          <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
            01 / The Mirror
          </p>
          <h1 id="mirror-question-title" className="max-w-3xl text-5xl font-black leading-none md:text-7xl">
            What if software could evolve?
          </h1>
          <p className="max-w-[64ch] text-base leading-8 text-zinc-300">
            A question becomes memory, memory becomes a cell, cells become an organism, and every new
            capability leaves proof before authority grows.
          </p>
          <nav aria-label="Infinity Mirror primary routes" className="flex flex-wrap gap-3">
            <a className="rounded-mirror border border-mirror-reflection/30 px-4 py-3 text-sm font-bold text-mirror-reflection" href="/organisms/infinity-mirror/">
              Inspect product path
            </a>
            <a className="rounded-mirror border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-200" href="/architecture/">
              Map organism stack
            </a>
          </nav>
        </div>

        <MirrorPortalTimeline />
      </section>

      <InfiniteReflectionNavigator anchors={mirrorStoryAnchors} lenses={reflectionNavigatorLenses} />
      <MirrorStateSequencer packets={mirrorStateSequencerPackets} />

      {mirrorChapters.map((chapter, index) => (
        <Fragment key={chapter.id}>
          <section
            id={chapter.id}
            aria-labelledby={`${chapter.id}-title`}
            className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 border-t border-zinc-800 px-5 py-20 md:grid-cols-[0.36fr_0.64fr] md:px-8"
          >
            <div className="space-y-4">
              <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">
                {chapter.kicker}
              </p>
              <h2 id={`${chapter.id}-title`} className="text-3xl font-black leading-tight md:text-5xl">
                {chapter.title}
              </h2>
              <p className="text-base leading-8 text-zinc-400">{chapter.description}</p>
            </div>
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

      <section aria-labelledby="mirror-proof-routes-title" className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-20 md:px-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">06 / Proof</p>
        <h2 id="mirror-proof-routes-title" className="mt-4 text-3xl font-black md:text-5xl">
          Every claim leaves a route.
        </h2>
        <nav aria-label="Infinity Mirror proof routes" className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-4">
          {proofRoutes.map((route) => (
            <a key={route.href} href={route.href} className="rounded-mirror border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-0.5 hover:border-mirror-reflection/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mirror-boundary">
              <span className="font-mono text-xs font-black uppercase tracking-[0.12em] text-mirror-proof">{route.label}</span>
              <strong className="mt-3 block text-lg text-zinc-100">{route.title}</strong>
              <span className="mt-3 block text-sm leading-6 text-zinc-400">{route.boundary}</span>
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
      </section>

      <section aria-labelledby="mirror-join-title" className="mx-auto w-full max-w-7xl border-t border-zinc-800 px-5 py-20 md:px-8">
        <p className="font-mono text-xs font-black uppercase tracking-[0.14em] text-mirror-proof">07 / Join Evolution</p>
        <h2 id="mirror-join-title" className="mt-4 text-3xl font-black md:text-5xl">
          Choose the doorway that matches your reason for entering.
        </h2>
        <InfinitySymbolLanguage states={infinitySymbolStates} />
        <JoinEvolutionRoutes routes={joinRoutes} />
        <FirstArtifactRouter routes={firstArtifactRoutes} />
        <EvolutionEntryProtocol steps={evolutionEntryProtocolSteps} />
      </section>
    </main>
  );
}
