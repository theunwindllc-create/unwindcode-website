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
