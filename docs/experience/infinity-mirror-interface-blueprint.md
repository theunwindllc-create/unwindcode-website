# Infinity Mirror Interface Blueprint

Status: implementation blueprint
Owner: Website Development Team
Last reviewed: 2026-06-13
Reference audited: https://www.anthropic.com/features/81k-interviews
Unwind route target: `/organisms/infinity-mirror/experience/`

## Non-Clone Contract

This blueprint extracts principles from Anthropic's 81K Interviews experience without copying its visual design. The UnwindCode.ai version must feel native to the organism ecosystem: black reflective void, infinity portal, recursive intelligence, proof-first AI organisms, brain cells, and human authority.

Do not reproduce Anthropic's cream editorial world, globe visual, quote wall layout, exact category charts, typography, or data-study framing. Translate the deeper pattern:

- persistent symbolic core
- scroll as staged revelation
- human signal before system abstraction
- data/proof after emotion
- interactive evidence near the end
- performance-conscious SVG and DOM over heavy media

## Phase 1 - Experience Reverse Engineering

### 1. Information Architecture

Purpose:
Anthropic's page begins with a large research claim, then moves from human interviews into methodology, classified hopes, delivered outcomes, concerns, regional differences, conclusion, quote wall, authorship, appendix, and footnotes.

Why it works:
The IA earns trust in layers. First, it creates scale. Then it proves humanity through quotes. Then it exposes method. Then it lets categories and charts do the explanatory work. It avoids presenting the dataset as pure visualization without narrative context.

Unwind reinterpretation:
Infinity Mirror should open with a direct existential question, then turn that question into an experience:

1. The Mirror: "What if software could evolve?"
2. Reflection: apps versus organisms
3. The Brain: cell network
4. The Organisms: public organism paths
5. Recursive Growth: self-evolution under proof
6. Proof: architecture, status, deployments, transmissions
7. Join Evolution: builders, investors, researchers, partners

### 2. Storytelling Flow

Purpose:
Anthropic alternates between macro scale and personal quote. The visitor never stays in abstraction for too long.

Why it works:
The page makes a large qualitative study emotionally legible by letting single voices puncture the scale. The story's central tension is not "AI good" or "AI bad"; it is hope and alarm coexisting.

Unwind reinterpretation:
The Infinity Mirror story should alternate between:

- internal experience: a visitor facing the mirror
- architecture layer: the organism behind the reflection
- proof layer: what the organism can and cannot do

The core tension becomes: software can evolve, but only if memory, cells, proof, and human authority keep it from becoming unbounded.

### 3. Scroll Choreography

Purpose:
Anthropic uses a sticky intro globe, step dots, staged quote overlays, narrative slides, and then long-form sections with chart modules. Browser inspection found a `ScrollIntroGlobe` pattern with a sticky inner panel, a globe SVG, a quote overlay, 11 step dots, and 9 narrative slides.

Why it works:
The first visual does not disappear immediately. It holds attention while the story changes around it. Scroll becomes a guided focus mechanism, not just page movement.

Unwind reinterpretation:
Use a sticky Infinity Mirror portal for the first 5 to 7 viewport heights. The symbol should remain centered while scroll changes its state:

1. calm infinity mark
2. reflective surface appears
3. symbol fractures into brain cells
4. reflections reveal app versus organism
5. cells connect into the Brain
6. organism paths orbit the portal
7. proof boundary closes the loop

### 4. Motion Design System

Purpose:
Anthropic's motion is purposeful and mostly SVG/DOM based: no videos, no canvas in the audited page, and many SVGs. Motion supports data comprehension and section pacing rather than decorative spectacle.

Why it works:
The page can feel alive while staying readable. The motion is mostly tied to scroll progress, staged overlays, charts, maps, and interaction controls.

Unwind reinterpretation:
Use motion as cognitive grammar:

- reflection: opacity, blur, scale, mirrored transforms
- fracture: clip-path, SVG path offsets, particle separation
- brain cell growth: node expansion, edge drawing, pulse delay
- recursive intelligence: nested rings, tunnel depth, repeated infinity contours
- proof: boundary locks, status labels, reduced glow, stable geometry

### 5. Visual Hierarchy

Purpose:
Anthropic anchors the page with a large title, short explanatory text, a central data visual, then clear H2 transitions.

Why it works:
The visitor can always answer "where am I?" even as interactive pieces appear.

Unwind reinterpretation:
Use a black void with one high-signal object. Keep text sparse in the hero and dense only in proof panels. The hierarchy should be:

1. central infinity portal
2. one sentence thesis
3. current chapter label
4. proof/authority line
5. route action

### 6. Typography System

Purpose:
Anthropic uses an editorial serif voice with restrained sans/mono utility. It feels like a research publication, not a SaaS splash page.

Why it works:
The typography makes the experience credible and thoughtful. Data modules do not need loud decoration because the editorial voice carries authority.

Unwind reinterpretation:
Use the existing Unwind premium lab language:

- display: restrained cinematic serif or high-contrast custom display for the mirror thesis
- body: current site body stack for continuity
- mono: proof labels, cell IDs, authority states
- avoid oversized marketing copy inside dense panels

### 7. Transition Logic

Purpose:
Anthropic transitions from hero to narrative, narrative to method, method to charts, charts to region comparison, and comparison to conclusion.

Why it works:
Every transition answers "why should I trust the next layer?"

Unwind reinterpretation:
Each section transition must reveal a deeper layer of the organism:

- mirror surface to reflection model
- reflection model to brain cell network
- brain cell network to organism paths
- organism paths to recursive growth
- recursive growth to proof ledger
- proof ledger to join paths

### 8. User Attention Management

Purpose:
Anthropic alternates between sticky focus, quote relief, chart inspection, and filterable exploration.

Why it works:
It prevents fatigue. The visitor gets moments of awe, reading, interaction, and proof.

Unwind reinterpretation:
Use four attention modes:

- Awe: portal, tunnel, recursive geometry
- Comprehension: app versus organism comparison
- Trust: proof surfaces, status, boundaries
- Action: role-based join paths

### 9. Emotional Progression

Purpose:
Anthropic moves from wonder to human consequence, then to ambivalence, then to responsible reflection.

Why it works:
It respects complexity. The page does not flatten AI into optimism or fear.

Unwind reinterpretation:
Progression:

1. Curiosity: what if software could evolve?
2. Unease: if it evolves, what controls it?
3. Recognition: apps reset, organisms remember
4. Wonder: brain cells assemble into living intelligence
5. Relief: proof and authority boundaries hold the system
6. Agency: choose how to join evolution

Implementation note:
The current static route now exposes `#mirror-emotional-progression`, a native-button progression rail that lets visitors inspect curiosity, unease, recognition, wonder, relief, and agency as organism route, proof return, and authority boundary. It makes the emotional journey visible without adding emotional profiling, hidden memory, network calls, deployment authority, or generated copy.

### 10. Performance Techniques

Purpose:
Anthropic relies heavily on SVG, DOM, sticky sections, and progressive interaction. Browser inspection showed 104 SVGs, no video, no canvas, a sticky header, and a long page with chart modules.

Why it works:
SVG and DOM are inspectable, responsive, and accessible when paired with semantic fallbacks. Heavy visuals are constrained to places where they explain.

Unwind reinterpretation:

- Default to SVG/CSS for the hero portal, reflection layers, and brain network.
- Use Canvas or Three.js only for the optional recursive tunnel after the semantic content is present.
- Respect `prefers-reduced-motion`.
- Use static SVG fallback for mobile and low-power devices.
- Avoid scroll listeners on mobile unless throttled through `requestAnimationFrame`.

## Phase 2 - Infinity Mirror Concept

The visitor enters a black reflective void. The first viewport contains almost nothing:

```text
                     ∞

        What if software could evolve?
```

The infinity symbol is not a logo here. It is the interface grammar:

- portal: entry into recursive intelligence
- mirror: reflection and self-awareness
- loop: organism memory
- boundary: authority gate
- proof path: evidence returns to the center

As the user scrolls:

1. The symbol breathes, subtle lens distortion.
2. A reflection plane appears below it.
3. The mark splits into two mirrored strands.
4. The strands fracture into brain cells.
5. The cells connect into a living network.
6. The network reveals organism paths.
7. The paths fold back into an infinity-shaped proof loop.

The emotional instruction: the visitor should feel like they are moving through a living intelligence, but the page must keep telling them where the boundary is.

Implementation note:
The current static route now makes the scroll grammar visible in the first viewport with a compact hero fracture sequence: signal enters, mirror becomes state, the symbol fractures into routes, cells begin to form, and proof closes the loop before authority grows. This adapts the concept package's "Capture. Translate. Keep." grammar into Unwind architecture language without importing hidden DOB inference or personal-authority claims.

## Phase 3 - Website Story Arc

### Section 01 - The Mirror

Headline:
What if software could evolve?

Purpose:
Create awe and establish the core question.

Interaction:
Sticky infinity portal for 5 viewport heights.

Proof line:
Evolution only matters if memory, proof, and human authority survive the loop.

Implementation note:
The current static route implements the first viewport as a mirror threshold, not only a hero. The portal asset remains decorative while a semantic readout names the entry contract: signal becomes context, authority stays visible, and every loop must return evidence.

### Section 02 - Reflection

Headline:
Apps execute. Organisms remember, reflect, and improve.

Content:
Two-column comparison:

- Traditional software: stateless flow, fixed UI, brittle automation, hidden assumptions
- AI organisms: memory, cells, approval gates, proof loops, replaceable capability

Motion:
Left side remains flat and grid-bound. Right side bends into mirrored depth.

Implementation note:
The current static route implements Section 02 with a semantic reflection plane between the comparison cards and the tension thread. The plane shows how an incoming command becomes state, context, authority boundary, and proof, so the visitor can inspect the organism difference before the Brain section appears.

It now adds a human signal atlas as a source-aware bridge from the 81K Interviews research pattern into Unwind architecture. Rather than using a quote wall or fake testimonials, the route maps mental room, better work, technical access, becoming, security, and world repair into organism routes, proof artifacts, and visible boundaries.

It now adds `#mirror-desire-translation` between the Human Signal Atlas and Delivery Calibration. This wall turns the study's desire categories into a product translation matrix: professional excellence, personal transformation, life management, time freedom, financial independence, societal transformation, entrepreneurship, learning and growth, and creative expression each receive an organism route, proof gate, and authority stop. The section keeps the source as research signal, not participant quotes or borrowed presentation.

It now adds `#mirror-route-compass` after Desire Translation and before Delivery Calibration. The compass maps 81K human desire signals into the chapter where the visitor should enter, the proof return they should expect, the authority stop that remains closed, and the CTA that keeps motion human-owned. It does not infer identity, store preference, submit data, call a model, start a build, spend, deploy, post, broadcast Web3 transactions, or grant autonomy.

It now adds delivery calibration as the 81K "has AI delivered?" reinterpretation. Productivity, cognitive partnership, access, support, and not-delivered signals are translated into proof gates, so the page can acknowledge where AI already helps and where a claim must remain incomplete until evidence changes status.

It also adds an adaptive mirror engine bridge distilled from the Infinity Mirror product concept package: one honest signal can be read through four bounded lenses, Architect, Cartographer, Translator, and Ritualist, then returned as a reviewable artifact and signal-map update. The route keeps this framed as product grammar, not hidden personal authority.

Source-kit note:
The React/Next runtime kit now carries this bridge as `components/mirror/MirrorRouteCompass.tsx`, backed by `mirrorRouteCompassEntries`, and `components/mirror/AdaptiveMirrorEngine.tsx`, backed by `adaptiveMirrorLenses`. Both must remain server-rendered so chapter routing, proof returns, authority stops, lens meanings, and capture/translate/keep/boundary rules stay visible before local signal selection hydrates.

It now adds a remix concept fit matrix from the local Infinity Mirror package. Persistent shell, overridable lenses, listening valve, artifact return, growth phases, and descent motion are accepted only when each concept has an owner, a proof surface, and an authority boundary. The birth-frequency idea is reduced to reversible lens selection, never identity authority or destiny.

It now adds a role signal constellation as the Unwind-native reinterpretation of the 81K experience's human-voice layer. Instead of a quote wall, the route shows builder, user, investor, and researcher signals as structured tensions: what each role hopes for, what must stay bounded, and which proof route the organism should expose before the signal becomes architecture.

It now distills the local Infinity Mirror concept package into a constant-shell product loop. The public route borrows the strongest engine ideas without importing the mobile app skin: touch facets for talk, capture, map, and ritual; a returned artifact instead of a generic chat response; user decisions to keep, refuse, deepen, or ritualize; and a pressure-release valve where a session can simply listen without tagging, artifact creation, or growth claims.

It now adds a returned artifact specimen to make the output concrete. The specimen shows a console-style packet with `signal_in`, `lens`, `memory_map`, `boundary_lock`, and `proof_path`, plus the human-owned decisions to keep, correct, deepen, or close the loop. It also adds a compact repair ledger, adapted from the kintsugi/gaze concept, where cracks become review questions before any artifact can enter memory. This borrows the concept package's artifact-first strength while keeping the public site framed around proof, consent, and authority boundaries.

It now adapts the local Infinity Mirror engine concept into a proof-returning descent protocol. The cinematic scroll journey is not imported as a heavy canvas dependency; it is translated into semantic stages: self, memory, split, lattice, current, evolution, and proof return. The "future self" moment is framed as possibility, never destiny or identity authority.

### Section 03 - The Brain

Headline:
The mirror is powered by cells, not screens.

Content:
Animated brain cell network:

- Gateway
- Cortex
- Memory
- Reflection Cell
- Pattern Cell
- Next Action Cell
- Immune Boundary
- Proof Loop

Motion:
Edges draw as the user scrolls. Cells wake in sequence.

Implementation note:
The current static route implements this as an inspectable brain route system. A cell network names Gateway, Cortex, Memory, Reflection, Pattern, Immune, and Proof, while an adjacent route console shows how a reflection request enters, selects cells, checks authority, and returns proof before advice can be trusted.

It also adds a lightweight recursive brain tunnel before the network. Nested infinity rings and sequenced cell nodes create the feeling of moving through a living route, while semantic steps name the actual path: signal dives, cells wake, boundary holds, and proof resurfaces.

The React/Next runtime source kit now carries this Brain layer as `RecursiveBrainTunnel.tsx`, `BrainRouteConsole.tsx`, and `BrainSignalHandoff.client.tsx`, backed by `recursiveBrainTunnelSteps`, `brainRouteStages`, `defaultBrainSignalHandoff`, and `brainSignalHandoffPackets`. The tunnel and route console must stay server-rendered. The signal handoff may be a client leaf only because it owns local selected-signal state; it cannot store memory, call a network, execute code, write files, deploy, post, or claim identity authority.

### Section 04 - The Organisms

Headline:
One spine, many organisms.

Cards:

- Visual Cortex: turns intent into reviewable media architecture
- Infinity Mirror: turns state into grounded motion
- Financial Organism: keeps Web3 intelligence simulation-first
- Research Organisms: explore new cells under proof

Motion:
Organism cards orbit the infinity portal, then settle into accessible cards.

### Section 05 - Recursive Growth

Headline:
The system improves by proposing new cells, not by escaping review.

Content:
Self-evolution sequence:

1. pattern repeats
2. candidate cell proposed
3. sandbox test
4. approval gate
5. integration
6. proof artifact

Motion:
Nested infinity rings expand. Failed loops become new candidate cells.

Implementation note:
The current static route implements this as a recursive growth loop field with six semantic gates: pattern, candidate cell, sandbox, approval, integration, and proof. The visual rings are decorative; the ordered list names how capability joins the organism only after verification, approval, integration notes, and public evidence.

### Section 06 - Proof

Headline:
Living systems need visible evidence.

Content:
Architecture, tests, transmissions, deployments, status labels, social proof packets.

Motion:
The recursive field stabilizes into a ledger. Glow becomes grid. Wonder becomes trust.

Implementation note:
The current static route implements proof as more than outbound links. The trust instrument now includes a proof cascade: a claim enters, an evidence route is named, the authority boundary locks, and a concrete artifact leaves. This keeps the visual experience accountable to architecture, tests, metadata, status, transmissions, and approval gates.

### Section 07 - Join Evolution

Headline:
Choose your path into the organism lab.

Paths:

- Builders: architecture review
- Investors: proof and roadmap
- Researchers: organism protocols
- Partners: prototype sprint

Motion:
The portal opens into four precise routes. CTA states remain calm, bounded, and specific.

## Phase 4 - Motion System

### Scroll Choreography Map

| Range | Section | Visual State | Text State | Performance |
| --- | --- | --- | --- | --- |
| 0-100vh | Mirror | Static infinity in black void | H1 appears | SVG/CSS only |
| 100-240vh | Portal | Infinity scales, reflection plane appears | thesis shifts to proof line | transform/opacity |
| 240-420vh | Fracture | mark splits into cells | apps vs organisms comparison | CSS clip-path or SVG stroke |
| 420-620vh | Brain | nodes connect | cell labels unlock | SVG paths, no layout thrash |
| 620-820vh | Organisms | cards orbit then dock | organism summaries | CSS transforms |
| 820-1020vh | Recursive Growth | nested loops expand | evolution sequence | Canvas optional desktop |
| 1020-1180vh | Proof | loop becomes ledger | proof stats and links | static DOM/SVG |
| 1180vh+ | Join | routes appear | conversion cards | no heavy animation |

### Framer Motion Specifications

Use Framer Motion for React component state, chapter transitions, and card microinteractions.

```tsx
const mirrorEase = [0.16, 1, 0.3, 1] as const;

export const mirrorVariants = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(18px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: mirrorEase },
  },
};

export const cellVariants = {
  dormant: { opacity: 0.22, scale: 0.86 },
  awake: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.055, duration: 0.42, ease: mirrorEase },
  }),
};
```

Interaction rules:

- Trigger: section enters 35 percent viewport
- Animation: opacity, transform, SVG path length
- Duration: 420ms for cells, 900-1200ms for portal transitions
- Easing: `[0.16, 1, 0.3, 1]`
- Performance: no animated layout properties; use `transform`, `opacity`, SVG stroke offsets

Implementation note:
The current static route now exposes `#mirror-scroll-choreography` and a Motion Contract ledger in the Proof chapter. The scroll choreography map scores the seven visitor acts by focus, motion, and proof return before the ledger translates Phase 4 choreography into visitor-readable proof by naming trigger, animation, timing, duration, easing, and performance strategy for the portal fracture, reflection plane, human signal atlas, product-loop facets, descent protocol, recursive brain tunnel, proof cascade, and doorway routes.

### GSAP Specifications

Use GSAP ScrollTrigger only for the pinned hero/portal timeline. Do not mix GSAP and Framer on the same properties.

```ts
gsap.timeline({
  scrollTrigger: {
    trigger: '.mirror-experience',
    start: 'top top',
    end: '+=520%',
    scrub: 0.7,
    pin: '.mirror-portal-stage',
    anticipatePin: 1,
  },
})
  .to('.mirror-infinity-mark', { scale: 1.28, duration: 1, ease: 'none' })
  .to('.mirror-plane', { opacity: 1, y: 0, duration: 0.8 }, '<')
  .to('.mirror-fracture-path', { strokeDashoffset: 0, opacity: 1, duration: 1.2 })
  .to('.brain-cell-node', { opacity: 1, scale: 1, stagger: 0.035, duration: 0.6 })
  .to('.organism-orbit-card', { opacity: 1, rotate: 0, y: 0, stagger: 0.05, duration: 0.8 })
  .to('.proof-boundary-ring', { opacity: 1, scale: 1, duration: 0.7 });
```

Interaction rules:

- Trigger: `.mirror-experience` top reaches top
- Animation: pinned stage, scrubbed depth, staged overlays
- Duration: 520 percent scroll length
- Easing: scrubbed `none` for timeline, custom ease for entrance microinteractions
- Performance: register once, kill on route unmount, disable pin under 760px or reduced motion

### Three.js Concepts

Use Three.js only as progressive enhancement for desktop. Semantic HTML and SVG must remain the primary experience.

Concept: Recursive Brain Tunnel

- Scene: orthographic camera facing nested infinity rings
- Geometry: instanced torus/curve particles along lemniscate coordinates
- Material: custom shader with Fresnel-like rim and subtle chromatic edge
- Scroll: camera `z` and tunnel opacity respond to normalized section progress
- Fallback: static SVG `infinity-mirror-portal.svg`

```ts
function lemniscatePoint(t: number, scale = 1) {
  const denom = 1 + Math.sin(t) * Math.sin(t);
  return {
    x: (scale * Math.cos(t)) / denom,
    y: (scale * Math.sin(t) * Math.cos(t)) / denom,
  };
}
```

Performance:

- cap DPR to 1.5
- pause rendering when offscreen
- use instancing for particles
- no postprocessing on mobile
- respect `prefers-reduced-motion`

### WebGL Concepts

Optional shader layer:

- mirror distortion: refractive ripple around infinity mark
- black-hole depth: radial gradient darkens toward center
- proof boundary: subtle stable ring that clamps distortion

Shader inputs:

- `uScrollProgress`
- `uTime`
- `uPointer`
- `uReducedMotion`

Do not put critical text or labels inside WebGL.

## Phase 5 - Visual Exploration

### A. Infinity Mirror Portal

Visual:
One luminous infinity mark inside a black reflective plane. It should feel like a doorway and an eye.

Asset:
`assets/visuals/infinity-mirror-portal.svg`

Motion:
Breathing scale, reflection opacity, stroke shimmer.

### B. Recursive Brain Tunnel

Visual:
Nested infinity rings receding into depth. Brain cell nodes appear along the curves.

Asset:
Optional Three.js module `MirrorBrainTunnel.tsx`, fallback SVG.

Motion:
Scroll moves the visitor through rings. Nodes wake in parallax layers.

Implementation note:
The current static route implements the first version with CSS and semantic HTML instead of adding Three.js immediately. The tunnel uses nested rings, a stable infinity glyph, and bounded step text so the page gains depth without making WebGL responsible for meaning.

### C. Living Organism Visualizer

Visual:
Cells organized around the organism spine: Gateway, Cortex, Memory, Cells, Immune Boundary, Proof.

Motion:
Edges draw only after a cell earns authority.

Implementation note:
The current static route implements this as a governed organism spine above four proof-path cards. Each organism card names the signal it accepts and the authority boundary it preserves, so the ecosystem reads as an inspectable system rather than a link shelf.

### D. Infinite Reflection Navigation

Visual:
Navigation items appear as reflected paths inside the mirror:

- Mirror
- Brain
- Organisms
- Growth
- Proof
- Join

Motion:
Active item reflects below itself. Reduced motion uses static underline.

Implementation note:
The current static route implements this as `#mirror-reflection-navigation` immediately after the portal hero. Native radio lenses let visitors choose Human Signal, Brain Route, Proof Route, or Build Route, while the same shell exposes seven chapter anchors around the Infinity mark. The persistent story rail derives its active state from those canonical seven anchors, not from incidental analysis sections, so the Infinity map remains truthful as proof ledgers and implementation packets are added. Each selected lens names route, proof, and boundary so wayfinding feels like entering the organism instead of scanning a table of contents.

Implementation note:
The current static route now exposes `#mirror-state-sequencer` after the infinite reflection navigation. It turns the seven canonical chapters into a bounded organism state machine: each state names the signal, organism response, proof return, boundary lock, and next chapter route. Treat this as the page-level orientation contract for future builds. It may swap local visible state through native buttons and chapter awareness, but it must not store memory, call a network, execute code, write files, deploy, post, infer identity, change status, or grant autonomy.

Source-kit note:
The React/Next runtime kit now carries this as `components/mirror/InfiniteReflectionNavigator.tsx`, backed by `mirrorStoryAnchors` and `reflectionNavigatorLenses`. It must remain server-rendered so anchor focus, lens route, proof, and boundary are readable before any Framer, GSAP, or Three layer hydrates.

### E. Floating Neural Architecture Maps

Visual:
Architecture diagrams float as transparent panes. Each pane has a proof label and route.

Motion:
Panes drift minimally on desktop; stack as cards on mobile.

Implementation note:
The current static route implements this inside the Proof chapter as five glass inspection panes: Gateway intake, Cortex route, Memory boundary, Immune gate, and Proof loop. The route line is visual only; the semantic labels explain how signal, memory, authority, and evidence move through the organism.

### F. Dynamic Infinity Symbol

Visual:
The infinity glyph becomes a platform primitive:

- logo pulse
- loader
- section divider
- proof-loop diagram
- organism orbit path
- social preview motif

Rule:
The symbol must always mean loop plus boundary. Never use it as empty decoration.

Implementation note:
The current static route implements the symbol in the Join Evolution chapter as a dynamic Infinity doorway. The glyph is decorative, while the surrounding role paths carry semantic proof, boundary, and next-step labels for builders, investors, researchers, and partners.

Source-kit note:
The React/Next runtime kit now carries the doorway as `components/mirror/JoinEvolutionRoutes.tsx`, backed by `joinRoutes` with role, next action, proof, and boundary fields. It keeps conversion as an inspectable proof route rather than a decorative CTA grid.

Implementation note:
The current static route now exposes `#mirror-first-artifact-router` between the dynamic doorway and entry protocol. It maps builder, investor, researcher, and partner intent into what to bring, what first artifact returns, where proof lives, and what approval boundary remains. This makes conversion feel like a bounded first packet rather than a hidden intake workflow.

Source-kit note:
The React/Next runtime kit now carries `components/mirror/FirstArtifactRouter.tsx`, backed by `firstArtifactRoutes` with bring, firstArtifact, proofRoute, approvalBoundary, href, and cta fields. It must stay server-rendered and cannot submit data, create a lead, start a build, spend money, deploy, post publicly, broadcast Web3 transactions, infer identity, or grant autonomy.

Source-kit note:
The React/Next runtime kit also carries `components/mirror/EvolutionEntryProtocol.tsx`, backed by `evolutionEntryProtocolSteps` with signal, boundary, first proof, next loop, input, and proof output fields. It defines what happens after a builder, investor, researcher, or partner chooses a doorway without adding storage, network, execution, file, deployment, posting, Web3 broadcast, status-change, identity, or autonomy authority.

Implementation note:
The current static route now exposes `#mirror-infinity-language` before the dynamic doorway. It distills the local Infinity Mirror engine package into a seven-state symbol language: portal, reflection, brain route, organism orbit, earned density, proof return, and bounded doorway. Each state must name the loop, the proof surface, and the authority stop so the infinity mark stays a platform grammar rather than decoration.

Implementation note:
The current route also exposes an interface build ledger in the Proof chapter. It turns Phase 6 and Phase 7 into visible readiness gates: semantic shell, motion islands, optional Three.js/WebGL gate, evidence sync, and release gate. This keeps the richer mirror-engine ambition tied to local proof, metadata parity, tests, and explicit approval before deployment.

Implementation note:
The current route also exposes `#mirror-proof-observatory` in the Proof chapter. It lets visitors choose Architecture, Metrics, Deployments, or Status and inspect the matching evidence path, current signal, authority boundary, and next artifact link. Treat it as a control-room metaphor, not live telemetry: the runtime may swap local visible state, but it cannot read production data, change status, deploy, post, execute code, or grant autonomy.

Implementation note:
The current route also exposes a source translation ledger in the Proof chapter. It maps the Anthropic 81K Interviews pattern into Unwind-native design decisions across scale, method, tension, delivery gaps, choreography, and a non-clone boundary. It should remain a public proof layer whenever the experience borrows external research patterns: cite the source, name the translation, and state what will not be copied.

Implementation note:
The current route also exposes an engine translation ledger in the Proof chapter. It translates the uploaded local remix package into explicit progress, pointer energy, lens, artifact, and approval states, then marks each concept as adopt now, prototype next, or block until proof. Camera access, DOB-derived identity authority, hidden memory maps, continuous mobile canvas, and public deployment remain blocked by default until a proof surface and human approval exist.

Concept packet note:
The route links `/assets/specs/infinity-mirror-engine-concept-analysis.md` from `#mirror-engine-concept-packet`. That Markdown file is the package-specific design authority for the uploaded Infinity Mirror ZIP: it records what the concept bundle contains, what should be adopted now, what should be prototyped later, and what remains blocked until consent, proof, and approval exist.

Implementation note:
The current route also exposes a runtime handoff matrix after the builder execution packet. It assigns CSS/SVG, Framer, GSAP, and Three/WebGL to isolated motion lanes with one job, one fallback, and one stop condition each. This is the migration rule for the cinematic version: a runtime may deepen the experience only after it names ownership, trigger, duration/easing, fallback, cleanup, and performance stop conditions.

Implementation note:
The current route also exposes `#mirror-depth-gate` after the runtime handoff matrix. It maps semantic, Framer, GSAP, and Three/WebGL depth lanes to trigger, allowed behavior, proof needed, fallback, and kill switch. This is the release-readiness rule for the living interface: cinematic depth cannot become production authority unless the fallback, mobile behavior, cleanup, and stop conditions are already true.

Implementation note:
The current route now exposes `#mirror-code-handoff` and `/assets/specs/infinity-mirror-runtime-code-handoff.md`. That Markdown file converts the Infinity Mirror engine concepts into implementation-ready files for a future React/Next migration: server page, server-rendered desire wall, proof observatory client leaf, scroll choreography map, motion contract ledger, infinity symbol language, Framer chapter motion, optional GSAP portal timeline, optional Three/WebGL tunnel gate, Tailwind tokens, and asset contracts. It must stay a local proof artifact until migration and deployment are explicitly approved.

Runtime kit note:
The route also links `/assets/specs/infinity-mirror-runtime-kit/README.md`, a static source kit containing the future `page.tsx`, server proof components for desire translation, mirror route compass, recursive brain tunnel, brain cell network, brain route console, living organism visualizer, recursive growth timeline, floating architecture maps, proof cascade, authority gradient, scroll choreography, motion contracts, experience audit, source translation, engine translation, interface build gates, runtime handoff lanes, mirror depth gate lanes, and infinity symbol language, plus Signal Composer, Brain Signal Handoff, Proof Observatory, and Emotional Progression client leaves, the Framer client leaf, GSAP portal timeline, Three/WebGL tunnel gate, content model, asset contract, and Tailwind token file. This kit is copied into local build output for inspection but is not imported by the current Vite route.

Implementation note:
The current route now prototypes the first bounded hero runtime as `#mirror-runtime-field`, an aria-hidden, dependency-free canvas behind the SVG portal. It draws lemniscate particles from scroll depth and pointer energy, pauses with IntersectionObserver, caps DPR at 1.5, freezes for reduced motion, and shuts down on compact screens. This is the allowed canvas pattern: it can make the mirror feel alive, but SVG, semantic HTML, i18n copy, and proof links remain authoritative.

The Brain chapter now prototypes the first bounded non-canvas route runtime as `main.js#mirror-brain-route-pulse`. It sequences signal, cells, authority, and proof across the recursive tunnel, brain-cell network, route console, signal handoff, and state grid only while the section is visible. It uses requestAnimationFrame, IntersectionObserver, reduced-motion static mode, and compact-screen static mode. This is the allowed downstream interaction pattern: motion may reveal an existing semantic route, but it must not invent hidden cognition, hidden state, or autonomy.

The Organisms and Recursive Growth chapters now prototype the first ecosystem relay as `main.js#mirror-organism-growth-relay`. It sequences Visual Cortex, Infinity Mirror, Financial Organism, and Research Organisms, then sequences pattern, candidate, sandbox, approval, integration, and proof gates. It uses the same bounded non-canvas pattern: requestAnimationFrame, IntersectionObserver, reduced-motion static mode, compact-screen static mode, and existing semantic links/lists as the source of truth.

The Reflection chapter now prototypes the concept package's reversible lens grammar as `main.js#mirror-adaptive-artifact-relay`. It sequences Architect, Cartographer, Translator, and Ritualist lenses with native `aria-pressed` buttons and ties each lens to the returned artifact route from signal through proof. This is the allowed personalization pattern: the human can override the frame, the artifact remains inspectable, and the runtime cannot claim identity, destiny, camera access, hidden memory, or hidden authority.

The Reflection chapter now adds `#mirror-signal-composer` and `main.js#mirror-signal-composer` as the first true signal-to-artifact interaction. Mental room, build stuck, trust proof, and quiet listen are native buttons that update the adaptive lens, returned artifact fields, and Brain signal handoff through existing i18n keys. This is the permitted demo pattern: the interface may show how a reflection packet changes and which cells/proof route it would enter, but it cannot diagnose, assign identity, store hidden memory, access camera, execute code, write files, deploy, or post.

The Reflection chapter now also exposes `#mirror-memory-consent`, a semantic Memory Consent Ledger that sits after the Signal Composer. It maps ephemeral, proposed, reviewed, and integrated memory states into can-hold, proof-required, and human-control fields. This keeps cognitive evolution legible without implying hidden persistence: memory can remain session-only, ask to be kept as a returned artifact, become a reviewed correction trail, or enter future loops only as a bounded continuity note. The ledger explicitly blocks diagnosis, identity authority, hidden profiling, wallet control, public posting, deployment, and autonomous action.

Source-kit note:
The React/Next runtime kit now carries this as `components/mirror/SignalComposer.client.tsx`, backed by `signalComposerPackets`, and `components/mirror/MemoryConsentLedger.tsx`, backed by `memoryConsentStates`. Signal Composer is intentionally a client leaf because it owns local selected-signal state, but it must not store memory, call a network, write files, deploy, post, or claim identity authority. Memory Consent Ledger stays server-rendered because consent states are public proof, not a runtime storage feature.

The Proof chapter now exposes `ExperienceAuditConsole` before `SourceTranslationLedger`. It turns Phase 1 into a public, inspectable artifact with ten lenses: information architecture, storytelling flow, scroll choreography, motion system, visual hierarchy, typography, transition logic, attention management, emotional progression, and performance technique. Each lens answers purpose, why the reference works, and how Unwind reinterprets it, so the page proves design learning before source translation and keeps the non-clone boundary visible.

Audit packet note:
The route links `/assets/specs/infinity-mirror-experience-audit.md` from `#mirror-experience-audit`. That Markdown file is the long-form Phase 1 audit authority: it records the source evidence snapshot, the ten reverse-engineering lenses, implementation rules, and the non-clone boundary before any runtime migration can claim the experience is source-grounded.

## Phase 6 - Implementation Plan

### 1. Component Tree

```text
InfinityMirrorExperience
  MirrorMeta
  MirrorHero
    MirrorPortalStage
      BoundedPortalField
    MirrorChapterText
    MirrorProgressDots
  InfiniteReflectionNavigator
  ReflectionComparison
  ReflectionPlane
  HumanSignalAtlas
  RoleSignalConstellation
  AdaptiveMirrorEngine
  MirrorShellSpecimen
  MirrorProductLoop
  ReturnedArtifactSpecimen
  MirrorDescentProtocol
  BoundedBrainRoutePulse
  BrainCellNetwork
  RecursiveBrainTunnel
  BrainRouteConsole
  BoundedOrganismGrowthRelay
  OrganismOrbit
  RecursiveGrowthTimeline
  FloatingArchitectureMaps
  MotionContractLedger
  ExperienceAuditConsole
  SourceTranslationLedger
  EngineTranslationLedger
  InterfaceBuildLedger
  RuntimeHandoffMatrix
  MirrorDepthGate
  RuntimeCodeHandoff
  ProofLedgerBand
  ProofCascade
  ProofObservatory
  JoinEvolutionRoutes
  EvolutionEntryProtocol
  MirrorReducedMotionFallback
```

### 2. React Architecture

- Use server-rendered semantic content first.
- Hydrate only motion islands.
- Keep all CTAs as real links.
- Keep proof/status data in a typed content object.
- Use one motion controller for scroll progress.

```ts
export type MirrorChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  proof?: string;
  route?: string;
};
```

### 3. Next.js Structure

```text
app/
  organisms/
    infinity-mirror/
      experience/
        page.tsx
        metadata.ts
components/
  mirror/
    InfinityMirrorExperience.tsx
    MirrorPortalStage.tsx
    BoundedPortalField.client.tsx
    ReflectionPlane.tsx
    HumanSignalAtlas.tsx
    RoleSignalConstellation.tsx
    AdaptiveMirrorEngine.tsx
    MirrorShellSpecimen.tsx
    MirrorProductLoop.tsx
    ReturnedArtifactSpecimen.tsx
    MirrorDescentProtocol.tsx
    BoundedBrainRoutePulse.client.tsx
    RecursiveBrainTunnel.tsx
    BrainCellNetwork.tsx
    BrainRouteConsole.tsx
    BoundedOrganismGrowthRelay.client.tsx
    LivingOrganismVisualizer.tsx
    OrganismOrbit.tsx
    MotionContractLedger.tsx
    SourceTranslationLedger.tsx
    EngineTranslationLedger.tsx
    InterfaceBuildLedger.tsx
    RuntimeHandoffMatrix.tsx
    MirrorDepthGate.tsx
    RuntimeCodeHandoff.tsx
    ProofLedgerBand.tsx
    ProofCascade.tsx
    ProofObservatory.client.tsx
    JoinEvolutionRoutes.tsx
    EvolutionEntryProtocol.tsx
lib/
  mirror/
    chapters.ts
    motion.ts
    tokens.ts
public/
  assets/
    visuals/
      infinity-mirror-portal.svg
      recursive-brain-tunnel.svg
```

Current-worktree note:
The existing UnwindCode public site is Vite and vanilla HTML/CSS/JS. Build the first version as a static route in the current system, then migrate to Next.js only when routing, image, and metadata parity are proven.

### 4. Motion Architecture

- GSAP: pinned hero timeline only.
- Framer Motion: component reveals, card interactions, active chapter state.
- CSS: continuous low-cost shimmer/pulse.
- SVG: path drawing and node awaken states.
- Canvas: bounded hero portal field only, aria-hidden, no embedded text, paused offscreen, disabled on compact/mobile.
- JS state relays: Brain route pulse and organism/growth relay only, no generated copy, paused offscreen, static under reduced motion and compact screens.
- Three.js: optional desktop recursive tunnel.

### 5. Asset Requirements

Required:

- `infinity-mirror-portal.svg`
- `mirror-fracture-map.svg`
- `brain-cell-network.svg`
- `organism-orbit-map.svg`
- `recursive-growth-loop.svg`
- `proof-boundary-ledger.svg`
- 1200x630 social preview
- 1080x1080 social carousel frame set if released as a transmission
- `assets/specs/infinity-mirror-runtime-code-handoff.md`
- `assets/specs/infinity-mirror-runtime-kit/README.md`
- `assets/specs/infinity-mirror-experience-audit.md`
- `assets/specs/infinity-mirror-engine-concept-analysis.md`

### 6. Design Tokens

```ts
export const mirrorTokens = {
  colors: {
    void: '#030307',
    graphite: '#090B12',
    reflection: '#B9F7EF',
    proof: '#D6A84F',
    organism: '#9B59F5',
    text: '#F0EEF6',
    muted: 'rgba(240,238,246,0.66)',
    boundary: '#13B8A6',
  },
  radii: { card: 8, control: 999 },
  motion: {
    easeOut: [0.16, 1, 0.3, 1],
    quick: 0.24,
    medium: 0.64,
    cinematic: 1.2,
  },
};
```

### 7. Accessibility Plan

- Semantic headings for all seven sections.
- SVG and WebGL are decorative unless directly described.
- All meaning appears in HTML text.
- `prefers-reduced-motion` swaps pinned hero for stepped sections.
- Keyboard-accessible chapter nav.
- High-contrast focus rings.
- No autoplay audio.
- No mental-health, diagnosis, or care replacement claims.

### 8. Mobile Adaptation

- Remove pinning under 760px.
- Collapse portal into static SVG hero plus step cards.
- Replace orbit motion with stacked organism cards.
- Use `content-visibility: auto` for below-fold sections.
- Disable pointer parallax.
- Keep proof and CTA links above heavy visuals.

### 9. SEO Preservation

- Canonical route: `/organisms/infinity-mirror/experience/`.
- Keep existing `/organisms/infinity-mirror/` product page unchanged as the semantic source.
- Add `WebPage`, `SoftwareApplication`, `DefinedTerm`, and `CreativeWork` schema.
- Update `sitemap.xml`, `llms.txt`, `ai-services.json`, and `assets/asset-manifest.json`.
- OG image should show the Infinity Mirror portal but page metadata carries claims.

### 10. Production Rollout Plan

1. Build static Vite prototype route with semantic HTML and SVG fallback.
2. Add tests for route, schema, metadata, reduced motion, and no critical text in assets.
3. Browser-smoke desktop and mobile widths.
4. Add optional desktop Three.js tunnel only after static route passes.
5. Ship as local preview.
6. If approved, publish as a transmission with IG carousel packet.
7. Deploy only after explicit approval.

Current-worktree note:
The static route now includes `MirrorRouteCompass`, `CognitiveEvolutionTrace`, `PhaseProofLedger`, `AuthorityGradient`, `SourceTranslationLedger`, `EngineTranslationLedger`, `InterfaceBuildLedger`, `RuntimeHandoffMatrix`, `MirrorDepthGate`, `FirstArtifactRouter`, and `EvolutionEntryProtocol` proof modules before the proof routes and inside Join Evolution. The React/Next runtime source kit now also carries `MirrorRouteCompass.tsx`, `ExperienceAuditConsole.tsx`, `CognitiveEvolutionTrace.tsx`, `PhaseProofLedger.tsx`, `AuthorityGradient.tsx`, `SourceTranslationLedger.tsx`, `EngineTranslationLedger.tsx`, `InterfaceBuildLedger.tsx`, `RuntimeHandoffMatrix.tsx`, `MirrorDepthGate.tsx`, `FirstArtifactRouter.tsx`, and `EvolutionEntryProtocol.tsx`, backed by `mirrorRouteCompassEntries`, `experienceAuditLenses`, `cognitiveEvolutionTraceSteps`, `phaseProofLedgerEntries`, `authorityGradientRungs`, `sourceTranslationLedgerEntries`, `engineTranslationLedgerEntries`, `interfaceBuildStages`, `runtimeHandoffLanes`, `mirrorDepthGateLanes`, `firstArtifactRoutes`, and `evolutionEntryProtocolSteps`. They should stay present in any React/Next migration so the route compass, cognitive loop, seven build phases, authority ladder, research inspiration, concept imports from the Remix bundle, implementation ambition, cinematic runtime ownership, depth readiness, first artifact routing, and conversion entry protocol remain governed by semantic HTML, source attribution, isolated motion, optional 3D fallback, discovery metadata, tests, cleanup, stop conditions, and explicit release approval.

Shell specimen note:
`MirrorShellSpecimen` now turns the Remix package's persistent mobile-shell language into a visible Unwind-native interface specimen: stable mirror core, growth-state meter, prompt chamber, returned artifact, bottom route shell, and authority lock. Treat it as the bridge between `RemixConceptFitMatrix` and `MirrorProductLoop` in any future React/Next migration.

Implementation packet note:
The route exposes `/assets/specs/infinity-mirror-implementation-packet.json` from `#mirror-execution-packet`. That JSON is the Phase 6 and Phase 7 handoff: it records the Remix design concept review as `adopt_now`, `prototype_next`, and `block_until_proof` decisions, then binds future React/Next, Framer, GSAP, Three/WebGL, Tailwind, metadata, tests, social packet, and deployment work to explicit approval gates.

## Phase 7 - Implementation-Ready Code

### React Component Skeleton

```tsx
export function InfinityMirrorExperience() {
  return (
    <main className="mirror-experience">
      <MirrorHero />
      <ReflectionComparison />
      <ReflectionPlane />
      <HumanSignalAtlas />
      <RoleSignalConstellation />
      <AdaptiveMirrorEngine />
      <MirrorShellSpecimen />
      <MirrorProductLoop />
      <ReturnedArtifactSpecimen />
      <MirrorDescentProtocol />
      <RecursiveBrainTunnel />
      <BrainCellNetwork />
      <BrainRouteConsole />
      <OrganismOrbit />
      <RecursiveGrowthTimeline />
      <FloatingArchitectureMaps />
      <MotionContractLedger />
      <SourceTranslationLedger />
      <EngineTranslationLedger />
      <InterfaceBuildLedger />
      <RuntimeHandoffMatrix />
      <MirrorDepthGate />
      <ProofLedgerBand />
      <ProofCascade />
      <ProofObservatory />
      <JoinEvolutionRoutes />
    </main>
  );
}
```

### Mirror Hero

```tsx
import { motion, useScroll, useTransform } from 'framer-motion';

export function MirrorHero() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.18], [1, 1.28]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.24], [1, 1, 0.22]);

  return (
    <section className="mirror-hero" aria-labelledby="mirror-title">
      <motion.div className="mirror-portal-stage" style={{ scale, opacity }} aria-hidden="true">
        <svg className="mirror-infinity-mark" viewBox="0 0 240 120" role="presentation" focusable="false">
          <path d="M60 60C90 20 120 20 150 60C180 100 210 100 230 60C210 20 180 20 150 60C120 100 90 100 60 60C30 20 0 20 -20 60C0 100 30 100 60 60Z" />
        </svg>
        <div className="mirror-plane" />
      </motion.div>
      <div className="mirror-hero-copy">
        <p className="mirror-kicker">Infinity Mirror / AI organism interface</p>
        <h1 id="mirror-title">What if software could evolve?</h1>
        <p>Enter the mirror. Watch reflection become memory, memory become cells, and cells become proof-bound intelligence.</p>
      </div>
    </section>
  );
}
```

### Brain Cell Network

```tsx
const cells = [
  'Gateway',
  'Cortex',
  'Memory',
  'Reflection Cell',
  'Pattern Cell',
  'Next Action Cell',
  'Immune Boundary',
  'Proof Loop',
];

export function BrainCellNetwork() {
  return (
    <section className="mirror-section brain-cell-network" aria-labelledby="brain-title">
      <p className="mirror-kicker">Animated brain cell network</p>
      <h2 id="brain-title">The mirror is powered by cells, not screens.</h2>
      <div className="brain-network-visual" aria-hidden="true">
        {cells.map((cell, index) => (
          <motion.span
            className="brain-cell-node"
            custom={index}
            variants={cellVariants}
            initial="dormant"
            whileInView="awake"
            viewport={{ once: true, margin: '-20%' }}
            key={cell}
          />
        ))}
      </div>
      <ul className="brain-cell-list">
        {cells.map(cell => <li key={cell}>{cell}</li>)}
      </ul>
    </section>
  );
}
```

### Motion Contract Ledger

```tsx
type MotionContract = {
  id: 'portal' | 'reflection' | 'signal' | 'humanSignal' | 'product' | 'descent' | 'brain' | 'proof' | 'doorway';
  label: string;
  title: string;
  trigger: string;
  animation: string;
  timing: string;
  duration: string;
  easing: string;
  performance: string;
};

const motionContracts: MotionContract[] = [
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
    id: 'humanSignal',
    label: '04 / Human signal',
    title: 'Research becomes route choices.',
    trigger: 'Human Signal Atlas enters after the tension thread.',
    animation: 'Six desire nodes pulse around one Infinity core while route cards stay readable.',
    timing: '11s scan, 5.8s node pulse, no forced scroll pin.',
    duration: '800ms card reveal with an 11s background scan.',
    easing: 'Slow ease-in-out scan; route cards use the mirror cubic easing.',
    performance: 'CSS transform and opacity only; source link and route text stay semantic.',
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
];

export function MotionContractLedger() {
  return (
    <section className="mirror-motion-contract" aria-label="Motion contract ledger">
      <div className="mirror-motion-contract-header">
        <span>Motion contract</span>
        <strong>Every cinematic move has a proof job.</strong>
        <p>Motion earns its place by naming trigger, animation, timing, duration, easing, and performance strategy.</p>
      </div>
      <ol className="mirror-motion-contract-grid">
        {motionContracts.map(contract => (
          <li key={contract.id} data-motion-contract={contract.id}>
            <span>{contract.label}</span>
            <strong>{contract.title}</strong>
            <dl>
              <div><dt>Trigger</dt><dd>{contract.trigger}</dd></div>
              <div><dt>Animation</dt><dd>{contract.animation}</dd></div>
              <div><dt>Timing</dt><dd>{contract.timing}</dd></div>
              <div><dt>Duration</dt><dd>{contract.duration}</dd></div>
              <div><dt>Easing</dt><dd>{contract.easing}</dd></div>
              <div><dt>Performance</dt><dd>{contract.performance}</dd></div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

### Tailwind Architecture

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        mirror: {
          void: '#030307',
          graphite: '#090B12',
          reflection: '#B9F7EF',
          proof: '#D6A84F',
          organism: '#9B59F5',
          boundary: '#13B8A6',
        },
      },
      borderRadius: {
        mirror: '8px',
      },
      transitionTimingFunction: {
        mirror: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
```

### CSS Fallback

```css
.mirror-hero {
  min-height: 100svh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 50% 48%, rgba(19, 184, 166, 0.16), transparent 34rem), #030307;
  color: #f0eef6;
}

.mirror-infinity-mark {
  width: min(42vw, 420px);
  filter: drop-shadow(0 0 36px rgba(19, 184, 166, 0.34));
}

.mirror-infinity-mark path {
  fill: none;
  stroke: currentColor;
  stroke-width: 4;
  stroke-linecap: round;
}

.mirror-plane {
  width: min(62vw, 720px);
  height: 1px;
  margin-inline: auto;
  background: linear-gradient(90deg, transparent, rgba(185, 247, 239, 0.72), transparent);
  transform: translateY(34px);
  opacity: 0.58;
}

@media (prefers-reduced-motion: reduce), (max-width: 760px) {
  .mirror-portal-stage {
    position: static;
    transform: none !important;
  }
}
```

### Implementation-Ready Execution Packet

Dependency gate:
The current Vite site has no Framer Motion, GSAP, Three.js, or Tailwind dependency. Do not import them into this worktree until the project intentionally migrates the Infinity Mirror experience into a React/Next implementation. For that migration, install the motion stack explicitly:

```bash
npm install framer-motion gsap three
```

React shell:

```tsx
// app/organisms/infinity-mirror/experience/page.tsx
import { mirrorChapters, proofRoutes } from '@/lib/mirror/content';
import { MirrorChapterMotion } from '@/components/mirror/MirrorChapterMotion.client';
import { MirrorPortalTimeline } from '@/components/mirror/MirrorPortalTimeline.client';
import { MirrorBrainTunnelGate } from '@/components/mirror/MirrorBrainTunnelGate.client';

export default function InfinityMirrorExperiencePage() {
  return (
    <main className="mirror-experience" data-experience="infinity-mirror">
      <section id="mirror-experience-hero" aria-labelledby="mirror-title">
        <p>Infinity Mirror / AI organism interface</p>
        <h1 id="mirror-title">What if software could evolve?</h1>
        <p>Evolution only matters if memory, proof, and human authority survive the loop.</p>
        <MirrorPortalTimeline />
      </section>

      {mirrorChapters.map(chapter => (
        <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
          <p>{chapter.kicker}</p>
          <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
          <p>{chapter.body}</p>
          <MirrorChapterMotion chapter={chapter} />
        </section>
      ))}

      <MirrorBrainTunnelGate />
      <nav aria-label="Infinity Mirror proof routes">
        {proofRoutes.map(route => <a key={route.href} href={route.href}>{route.label}</a>)}
      </nav>
    </main>
  );
}
```

Framer Motion leaf:

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

const mirrorEase = [0.16, 1, 0.3, 1] as const;

export function MirrorChapterMotion({ chapter }: { chapter: MirrorChapter }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="mirror-motion-island"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.72, ease: mirrorEase }}
      data-chapter={chapter.id}
    >
      {chapter.cells.map((cell, index) => (
        <motion.span
          key={cell.id}
          className="mirror-cell-node"
          initial={reduce ? false : { opacity: 0.22, scale: 0.86 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.055, duration: 0.42, ease: mirrorEase }}
        />
      ))}
    </motion.div>
  );
}
```

GSAP portal island:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function MirrorPortalTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 760px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=520%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
        },
      })
        .to('[data-mirror-mark]', { scale: 1.28, duration: 1, ease: 'none' })
        .to('[data-mirror-plane]', { opacity: 1, y: 0, duration: 0.8 }, '<')
        .to('[data-mirror-cell]', { opacity: 1, scale: 1, stagger: 0.035, duration: 0.6 });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return <div ref={rootRef} className="mirror-portal-stage" aria-hidden="true" />;
}
```

Three.js tunnel gate:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MirrorBrainTunnelGate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 3;

    let frame = 0;
    let running = true;
    const render = () => {
      if (!running) return;
      frame = requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="mirror-brain-tunnel-canvas" aria-hidden="true" />;
}
```

Asset specification:

```ts
export const infinityMirrorAssets = {
  required: [
    'assets/visuals/infinity-mirror-portal.svg',
    'assets/asset-manifest.json',
    'llms.txt',
    'ai-services.json',
  ],
  rules: [
    'No critical text in SVG, canvas, or WebGL.',
    'Reduced motion must keep every chapter readable.',
    'Every public route change updates tests and discovery metadata.',
    'Public deployment waits for explicit approval.',
  ],
};
```

## Build Decision

First production move:
Create a local `/organisms/infinity-mirror/experience/` route in the current Vite site using semantic HTML, CSS, and SVG. Add the portal SVG, scroll chapter copy, proof links, asset manifest entry, `llms.txt`, `ai-services.json`, sitemap entry, and tests. Keep Three.js out of the first pass unless the static experience already proves its story.

This gives UnwindCode the Infinity Mirror interface without risking SEO, accessibility, or performance.
