// Presentation adapter only. Existing pages retain their own navigation and content.
const root = document.documentElement;
function translate() {
  const es = root.lang.startsWith('es');
  document.querySelectorAll('[data-atlas-en]').forEach(el => {
    el.textContent = el.dataset[es ? 'atlasEs' : 'atlasEn'];
  });
}
new MutationObserver(translate).observe(root, {attributes:true, attributeFilter:['lang']});
document.addEventListener('uc:languagechange', translate);
translate();

// Keep the existing landing button/handlers, but give it a persistent position
// clear of the Brain launcher. It formerly occupied the same mobile corner.
const landingPause = document.querySelector('.atlas-landing #motion-toggle');
if (landingPause) document.body.append(landingPause);

// Older articles have their own small menu handlers. Add a shared Escape
// fallback without replacing those handlers or interfering with modal dialogs.
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
  const links = document.getElementById('nav-links');
  const toggle = document.getElementById('nav-toggle');
  if (!toggle || !links?.classList.contains('open')) return;
  event.preventDefault();
  toggle.click();
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus({preventScroll:true});
});

// Distinct cell families on index cards, without replacing evidence/status labels.
for (const card of document.querySelectorAll('.specimen, .lab-card')) {
  const link = card.querySelector('a[href^="/organisms/"]');
  const id = link?.getAttribute('href').split('/')[2];
  if (id) card.dataset.atlasCell = id;
}

// Existing console contains its original chat. The shared dialog owns access now.
const oldChat = document.getElementById('chat-modal');
if (oldChat) oldChat.hidden = true;

// Image failure remains a clean editorial hero rather than a broken icon.
document.querySelectorAll('[data-atlas-art] img').forEach(img => {
  img.addEventListener('error', () => { img.closest('[data-atlas-art]').hidden = true; });
});
