// One current-document conversation. No transcript storage, page scraping, or provider fallback.
const MAX_CHAT = 2000;
const MAX_QUERY = 160;
const REQUEST_TIMEOUT = 25000;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const COPY = {
  en: {
    title: 'Ask the Brain', eyebrow: 'UNWIND / KNOWLEDGE INTERFACE', close: 'Close Brain panel',
    modes: 'Choose an information mode', conversation: 'Conversation', sources: 'Public Sources',
    conversationIntro: 'Ask about Unwind, its systems, and the thinking behind them.',
    sourcesIntro: 'Explore published knowledge. These are retrieved sources, not an AI-generated answer.',
    local: 'Local preview · Public-source search. Conversation depends on the configured chat service.',
    privacy: 'Do not share secrets or sensitive information. This panel does not save your conversation in this browser.',
    suggestions: 'Start with a question', question: 'Your question', query: 'Search published knowledge',
    chatPlaceholder: 'What would you like to understand?', sourcePlaceholder: 'Try memory, infinity mirror, or proof…',
    send: 'Send question', search: 'Find sources', sending: 'Sending…', searching: 'Finding sources…',
    helpChat: 'Up to 2,000 characters · one line · Enter to send', helpSources: 'Up to 160 characters · public registries only',
    empty: 'Enter a question or search term first.', invalid: 'Use one line without control characters.',
    tooLong: 'Your draft is too long for this mode. Shorten it before sending.',
    invalidRequest: 'The request was not accepted. Check your draft and try again.',
    forbidden: 'This page is not authorized to use the service. Open Unwind’s official website to continue.',
    limited: 'Too many requests. Please wait before trying again.', retry: 'Try again in {seconds} seconds.',
    unavailable: 'Conversation is unavailable here. You can switch to Public Sources; your question is kept.',
    sourcesUnavailable: 'Public-source search is temporarily unavailable. Your search is kept; try again later.',
    upstream: 'The Brain service could not complete this request. Your draft is kept. Please try again later.',
    network: 'Could not connect. Check your connection and try again; your draft is kept.',
    timeout: 'The request timed out. Your draft is kept. It may have reached the service; retry only when ready.',
    malformed: 'The service returned an unreadable response. No answer was shown. Your draft is kept.',
    useSources: 'Switch to Public Sources', you: 'You', brain: 'Brain', searchLabel: 'Search',
    received: 'Reply received.', found: 'Source review ready.', noResults: 'No matching public sources. Try a shorter term or a system name.',
    reviewTitle: 'Source review required', reviewBody: 'No freeform answer was generated. Review the citations, claim qualifications, and boundaries below. This panel cannot approve or execute actions.',
    sourceTitle: 'Retrieved public sources', retrievalOnly: 'Retrieval only · answer generation disabled',
    source: 'Public source', excerpt: 'Registry excerpt', citations: 'Citations', noCitations: 'No citations were returned.',
    qualifications: 'Required claim qualifications', noQualifications: 'No claim qualifications were returned. This does not authorize an answer or an action.',
    rules: 'Refusal rules', policy: 'Review policy', flags: 'Review flags', blocked: 'Answer blockers', required: 'Required before synthesis',
    claim: 'Claim', evidence: 'Evidence', risk: 'Risk', status: 'Review status', humanReview: 'Human review required',
    sourceContext: 'Source context & boundaries', unsafeLink: 'Reference shown as text; no approved public link.',
    sourceLanguage: 'Source excerpts and policy identifiers retain their published language.',
    suggestionMemory: 'How does memory work?', suggestionMirror: 'Explore Infinity Mirror', suggestionProof: 'What proof can I inspect?',
  },
  es: {
    title: 'Pregunta al Cerebro', eyebrow: 'UNWIND / INTERFAZ DE CONOCIMIENTO', close: 'Cerrar panel del Cerebro',
    modes: 'Elige un modo de información', conversation: 'Conversación', sources: 'Fuentes públicas',
    conversationIntro: 'Pregunta sobre Unwind, sus sistemas y las ideas que los guían.',
    sourcesIntro: 'Explora conocimiento publicado. Son fuentes recuperadas, no una respuesta generada por IA.',
    local: 'Vista local · Búsqueda de fuentes públicas. La conversación depende del servicio de chat configurado.',
    privacy: 'No compartas secretos ni información sensible. Este panel no guarda tu conversación en el navegador.',
    suggestions: 'Empieza con una pregunta', question: 'Tu pregunta', query: 'Buscar conocimiento publicado',
    chatPlaceholder: '¿Qué te gustaría comprender?', sourcePlaceholder: 'Prueba memory, infinity mirror o proof…',
    send: 'Enviar pregunta', search: 'Buscar fuentes', sending: 'Enviando…', searching: 'Buscando fuentes…',
    helpChat: 'Hasta 2.000 caracteres · una línea · Intro para enviar', helpSources: 'Hasta 160 caracteres · solo registros públicos',
    empty: 'Primero escribe una pregunta o un término de búsqueda.', invalid: 'Usa una línea sin caracteres de control.',
    tooLong: 'Tu borrador es demasiado largo para este modo. Acórtalo antes de enviarlo.',
    invalidRequest: 'No se aceptó la solicitud. Revisa tu borrador e inténtalo de nuevo.',
    forbidden: 'Esta página no está autorizada para usar el servicio. Abre el sitio oficial de Unwind para continuar.',
    limited: 'Demasiadas solicitudes. Espera antes de volver a intentarlo.', retry: 'Vuelve a intentarlo en {seconds} segundos.',
    unavailable: 'La conversación no está disponible aquí. Puedes cambiar a Fuentes públicas; tu pregunta se conserva.',
    sourcesUnavailable: 'La búsqueda de fuentes no está disponible temporalmente. Tu búsqueda se conserva; inténtalo más tarde.',
    upstream: 'El servicio del Cerebro no pudo completar esta solicitud. Tu borrador se conserva. Inténtalo más tarde.',
    network: 'No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo; tu borrador se conserva.',
    timeout: 'La solicitud tardó demasiado. Tu borrador se conserva. Puede haber llegado al servicio; reintenta solo cuando quieras.',
    malformed: 'El servicio devolvió una respuesta ilegible. No se mostró ninguna respuesta. Tu borrador se conserva.',
    useSources: 'Cambiar a Fuentes públicas', you: 'Tú', brain: 'Cerebro', searchLabel: 'Búsqueda',
    received: 'Respuesta recibida.', found: 'Revisión de fuentes lista.', noResults: 'No hay fuentes públicas coincidentes. Prueba un término más corto o el nombre de un sistema.',
    reviewTitle: 'Se requiere revisión de fuentes', reviewBody: 'No se generó una respuesta libre. Revisa las citas, las condiciones de las afirmaciones y los límites a continuación. Este panel no puede aprobar ni ejecutar acciones.',
    sourceTitle: 'Fuentes públicas recuperadas', retrievalOnly: 'Solo recuperación · generación de respuestas desactivada',
    source: 'Fuente pública', excerpt: 'Extracto del registro', citations: 'Citas', noCitations: 'No se devolvieron citas.',
    qualifications: 'Condiciones obligatorias de las afirmaciones', noQualifications: 'No se devolvieron condiciones de afirmaciones. Esto no autoriza una respuesta ni una acción.',
    rules: 'Reglas de rechazo', policy: 'Política de revisión', flags: 'Indicadores de revisión', blocked: 'Bloqueos de respuesta', required: 'Requisitos antes de sintetizar',
    claim: 'Afirmación', evidence: 'Evidencia', risk: 'Riesgo', status: 'Estado de revisión', humanReview: 'Se requiere revisión humana',
    sourceContext: 'Contexto y límites de la fuente', unsafeLink: 'Referencia mostrada como texto; sin enlace público aprobado.',
    sourceLanguage: 'Los extractos y los identificadores de política conservan su idioma publicado.',
    suggestionMemory: '¿Cómo funciona la memoria?', suggestionMirror: 'Explorar Infinity Mirror', suggestionProof: '¿Qué pruebas puedo consultar?',
  },
};

const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const citationRecord = (value) => record(value) && typeof value.route === 'string' && typeof value.label === 'string';

// A citation is not permission to navigate arbitrary hosts, internal artifacts, or executable URLs.
export function safePublicUrl(value, origin = 'https://www.unwindcode.ai') {
  if (typeof value !== 'string' || CONTROL_CHARACTERS.test(value) || /\\|%2f|%5c|%2e/i.test(value)) return null;
  if (!value.startsWith('/') && !/^https?:\/\//i.test(value)) return null;
  if (value.startsWith('//')) return null;
  try {
    const url = new URL(value, origin);
    const sameOrigin = url.origin === new URL(origin).origin;
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search) return null;
    if (!sameOrigin && (url.protocol !== 'https:' || url.port || !['unwindcode.ai', 'www.unwindcode.ai'].includes(url.hostname))) return null;
    const publicPath = /^(?:\/$|\/(?:home|lab|architecture|philosophy|vision|build-with-us|organisms|proof|transmissions)(?:\/[a-z0-9-]+)*\/?$|\/data\/(?:architecture|assets|claims|organisms|transmissions)\.json$)/;
    if (!publicPath.test(url.pathname)) return null;
    return sameOrigin ? `${url.pathname}${url.hash}` : url.href;
  } catch { return null; }
}

export function validGroundingPacket(packet) {
  return Boolean(record(packet) && packet.answer_generation === 'disabled'
    && record(packet.answer_policy) && packet.answer_policy.synthesis_allowed === false
    && strings(packet.answer_policy.blocked_reasons) && strings(packet.answer_policy.required_before_synthesis)
    && strings(packet.review_flags) && strings(packet.refusal_rules) && packet.refusal_rules.length > 0
    && record(packet.citation_display) && packet.citation_display.answer_generation === 'disabled'
    && Array.isArray(packet.citation_display.items) && packet.citation_display.items.every(citationRecord)
    && Array.isArray(packet.required_qualifications) && packet.required_qualifications.every((qualification) => record(qualification)
      && ['claim_id', 'claim_status', 'evidence_status', 'risk_level', 'interpretation_boundary'].every((key) => typeof qualification[key] === 'string')
      && Array.isArray(qualification.citations) && qualification.citations.every(citationRecord))
    && Array.isArray(packet.sources) && packet.sources.every((source) => record(source)
      && ['title', 'route', 'snippet', 'type'].every((key) => typeof source[key] === 'string')
      && strings(source.citation_display_refs)
      && source.answer_generation === 'disabled' && source.answer_safety?.synthesis_allowed === false
      && source.answer_safety?.answer_safe === false));
}

export function validGroundingReview(payload) {
  const display = payload?.display;
  return Boolean(payload?.success === false && display?.mode === 'grounding_review_required'
    && display.component === 'citation_review_card' && display.answer_generation === 'disabled'
    && display.allow_freeform_answer === false && display.render_required === true
    && display.render_citations === true && display.render_claim_qualifications === true
    && display.render_refusal_rules === true && validGroundingPacket(payload.grounding));
}

export function validChatReply(payload) {
  return Boolean(payload?.success === true && typeof payload.reply === 'string' && payload.reply.trim()
    && (payload.conversation_id === null || (typeof payload.conversation_id === 'string'
      && /^[a-zA-Z0-9._:-]{1,120}$/.test(payload.conversation_id))));
}

export function retrySeconds(value, now = Date.now()) {
  if (!value) return null;
  const seconds = /^\d+$/.test(value) ? Number(value) : Math.ceil((Date.parse(value) - now) / 1000);
  return Number.isFinite(seconds) && seconds > 0 && seconds <= 86400 ? Math.ceil(seconds) : null;
}

export function mountBrain() {
  if (document.getElementById('atlas-brain-dialog')) return;
  const local = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
  let language = 'en';
  let mode = local ? 'sources' : 'conversation';
  let busy = false;
  let conversationId = null;
  let returnFocus = null;
  let statusKey = '';
  let retryAfter = null;
  let unavailable = false;
  let previousOverflow = '';
  const drafts = { conversation: '', sources: '' };
  const t = (key) => COPY[language][key] || key;
  const el = (tag, suffix, text) => {
    const node = document.createElement(tag);
    if (suffix) node.className = `atlas-brain-${suffix}`;
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const label = (tag, suffix, key) => {
    const node = el(tag, suffix, t(key));
    node.dataset.brainLabel = key;
    return node;
  };
  const button = (suffix, key) => {
    const node = label('button', suffix, key);
    node.type = 'button';
    return node;
  };

  const launcher = button('launcher', 'title');
  launcher.id = 'atlas-brain-launcher';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'atlas-brain-dialog');
  launcher.setAttribute('aria-expanded', 'false');
  const dialog = el('dialog', 'dialog');
  dialog.id = 'atlas-brain-dialog';
  dialog.setAttribute('aria-labelledby', 'atlas-brain-title');
  const shell = el('div', 'shell');
  const header = el('header', 'header');
  const heading = el('div', 'heading');
  heading.append(label('p', 'eyebrow', 'eyebrow'));
  const title = label('h2', 'title', 'title');
  title.id = 'atlas-brain-title';
  heading.append(title);
  const close = el('button', 'close', '×');
  close.type = 'button';
  header.append(heading, close);
  const tabs = el('div', 'tabs');
  tabs.setAttribute('role', 'tablist');
  const panels = {};
  const modeButtons = {};
  for (const key of ['conversation', 'sources']) {
    const tab = button('tab', key);
    tab.id = `atlas-brain-tab-${key}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `atlas-brain-panel-${key}`);
    modeButtons[key] = tab;
    tabs.append(tab);
    const panel = el('section', 'panel');
    panel.id = `atlas-brain-panel-${key}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    const intro = label('p', 'intro', key === 'sources' ? 'sourcesIntro' : 'conversationIntro');
    const suggestions = el('div', 'suggestions');
    suggestions.append(label('p', 'label', 'suggestions'));
    for (const [suggestion, query, en, es] of [
      ['suggestionMemory', 'memory', 'How does the Brain use memory?', '¿Cómo usa la memoria el Cerebro?'],
      ['suggestionMirror', 'infinity mirror', 'What is Infinity Mirror?', '¿Qué es Infinity Mirror?'],
      ['suggestionProof', 'proof', 'What public proof can I inspect?', '¿Qué pruebas públicas puedo consultar?'],
    ]) {
      const chip = button('suggestion', suggestion);
      chip.addEventListener('click', () => {
        if (busy) return;
        input.value = key === 'sources' ? query : language === 'es' ? es : en;
        drafts[mode] = input.value;
        setStatus('');
        input.focus();
      });
      suggestions.append(chip);
    }
    const history = el('div', 'history');
    panel.append(intro, suggestions, history);
    panels[key] = { panel, history };
  }
  const environment = label('p', 'local', 'local');
  environment.hidden = !local;
  const form = el('form', 'form');
  form.id = 'atlas-brain-form';
  form.noValidate = true;
  const inputLabel = label('label', 'label', 'question');
  inputLabel.htmlFor = 'atlas-brain-input';
  const input = el('textarea', 'input');
  input.id = 'atlas-brain-input';
  input.name = 'atlas-brain-message';
  input.rows = 2;
  input.autocomplete = 'off';
  input.setAttribute('aria-describedby', 'atlas-brain-help atlas-brain-status');
  const help = label('p', 'help', 'helpChat');
  help.id = 'atlas-brain-help';
  const status = el('p', 'status');
  status.id = 'atlas-brain-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const sourceSwitch = button('source-switch', 'useSources');
  sourceSwitch.hidden = true;
  sourceSwitch.addEventListener('click', () => { selectMode('sources'); input.focus(); });
  const submit = label('button', 'submit', 'send');
  submit.type = 'submit';
  const privacy = label('p', 'privacy', 'privacy');
  form.append(inputLabel, input, help, status, sourceSwitch, submit, privacy);
  shell.append(header, tabs, environment, panels.conversation.panel, panels.sources.panel, form);
  dialog.append(shell);
  document.body.append(launcher, dialog);

  function setStatus(key, isError = false, seconds = null) {
    statusKey = key;
    retryAfter = seconds;
    status.classList.toggle('atlas-brain-status-error', isError);
    input.setAttribute('aria-invalid', String(isError && ['empty', 'invalid', 'tooLong', 'invalidRequest'].includes(key)));
    status.textContent = key ? `${t(key)}${seconds ? ` ${t('retry').replace('{seconds}', seconds)}` : ''}` : '';
  }
  function refresh() {
    dialog.lang = language;
    launcher.lang = language;
    document.querySelectorAll('[data-brain-label]').forEach((node) => { node.textContent = t(node.dataset.brainLabel); });
    close.setAttribute('aria-label', t('close'));
    tabs.setAttribute('aria-label', t('modes'));
    inputLabel.textContent = t(mode === 'sources' ? 'query' : 'question');
    input.placeholder = t(mode === 'sources' ? 'sourcePlaceholder' : 'chatPlaceholder');
    input.maxLength = mode === 'sources' ? MAX_QUERY : MAX_CHAT;
    help.textContent = t(mode === 'sources' ? 'helpSources' : 'helpChat');
    submit.textContent = t(busy ? mode === 'sources' ? 'searching' : 'sending' : mode === 'sources' ? 'search' : 'send');
    submit.disabled = busy;
    input.readOnly = busy;
    sourceSwitch.hidden = mode !== 'conversation' || !unavailable;
    for (const key of Object.keys(panels)) {
      modeButtons[key].setAttribute('aria-selected', String(mode === key));
      modeButtons[key].tabIndex = mode === key ? 0 : -1;
      modeButtons[key].disabled = busy;
      panels[key].panel.hidden = mode !== key;
      panels[key].panel.setAttribute('aria-busy', String(busy && mode === key));
    }
    dialog.querySelectorAll('.atlas-brain-suggestion').forEach((node) => { node.disabled = busy; });
    if (statusKey) status.textContent = `${t(statusKey)}${retryAfter ? ` ${t('retry').replace('{seconds}', retryAfter)}` : ''}`;
  }
  function syncLanguage(event) {
    let candidate = event?.detail?.lang || document.documentElement.lang;
    if (!candidate) {
      try { candidate = localStorage.getItem('uc-lang'); } catch { /* Storage is optional. */ }
    }
    language = String(candidate).toLowerCase().startsWith('es') ? 'es' : 'en';
    refresh();
  }
  function selectMode(next) {
    if (busy || next === mode) return;
    drafts[mode] = input.value;
    mode = next;
    input.value = drafts[mode];
    setStatus(mode === 'conversation' && unavailable ? 'unavailable' : '');
    refresh();
  }
  for (const key of Object.keys(modeButtons)) {
    modeButtons[key].addEventListener('click', () => selectMode(key));
    modeButtons[key].addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || busy) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 'conversation' : event.key === 'End' ? 'sources' : mode === 'sources' ? 'conversation' : 'sources';
      selectMode(next);
      modeButtons[next].focus();
    });
  }

  function closeMenus() {
    document.querySelectorAll('dialog[open]').forEach((other) => { if (other !== dialog) other.close(); });
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle?.getAttribute('aria-expanded') === 'true') navToggle.click();
    document.getElementById('nav-links')?.classList.remove('open');
    document.getElementById('nav')?.classList.remove('menu-open');
    document.body.classList.remove('nav-drawer-open');
    for (const id of ['nav-toggle', 'menu-toggle']) {
      const toggle = document.getElementById(id);
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.classList.remove('active');
    }
    const legacy = document.getElementById('chat-modal');
    if (legacy?.classList.contains('open')) {
      legacy.classList.remove('open');
      legacy.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }
  function open(trigger) {
    if (dialog.open) return;
    returnFocus = trigger instanceof HTMLElement ? trigger : document.activeElement;
    closeMenus();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    launcher.setAttribute('aria-expanded', 'true');
    input.focus({ preventScroll: true });
    // Menu close handlers can restore focus in a later frame; the modal owns focus now.
    requestAnimationFrame(() => { if (dialog.open && !dialog.contains(document.activeElement)) input.focus({ preventScroll: true }); });
  }
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    launcher.setAttribute('aria-expanded', 'false');
    const target = returnFocus?.isConnected && returnFocus.getClientRects().length ? returnFocus : launcher;
    target.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, textarea, a[href], summary, [tabindex="0"]')]
      .filter((node) => !node.disabled && node.getClientRects().length && !node.closest('[hidden]'));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const legacySpanish = {
    'cta.brain.prompt.builder.value': 'Convierte mi idea de producto en una ruta de organismo con pruebas y límites.',
    'cta.brain.prompt.investor.value': 'Muéstrame las pruebas que un inversor debería revisar primero.',
    'cta.brain.prompt.user.value': 'Ayúdame a elegir entre Infinity Mirror y las otras rutas de organismos.',
    'cta.brain.prompt.collab.value': 'Convierte mi idea de colaboración en un primer paquete con límites claros.',
  };
  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element
      ? event.target.closest('#atlas-brain-launcher, [data-ask-brain], #open-chat, #footer-chat-link, [data-chat-prompt]') : null;
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const prompt = language === 'es'
      ? trigger.dataset.brainPromptEs || trigger.dataset.chatPromptEs || legacySpanish[trigger.dataset.chatPromptKey] || trigger.dataset.brainPrompt || trigger.dataset.chatPrompt
      : trigger.dataset.brainPrompt || trigger.dataset.chatPrompt;
    if (prompt && !busy) {
      selectMode('conversation');
      input.value = prompt;
      drafts[mode] = prompt;
      setStatus('');
    }
    open(trigger);
  }, true);

  function appendReference(parent, citation) {
    const text = citation.display_text || `${citation.label || t('source')} · ${citation.route || ''}`;
    const href = safePublicUrl(citation.route, location.origin);
    const node = el(href ? 'a' : 'span', 'citation', text);
    if (href) { node.href = href; node.rel = 'noopener noreferrer'; }
    else node.title = t('unsafeLink');
    parent.append(node);
  }
  function list(parent, key, values) {
    if (!values?.length) return;
    parent.append(label('h4', 'label', key));
    const items = el('ul', 'list');
    values.forEach((value) => items.append(el('li', '', value)));
    parent.append(items);
  }
  function packetCard(packet, review) {
    const card = el('article', 'packet');
    card.append(label('p', 'eyebrow', 'retrievalOnly'), label('h3', 'result-title', review ? 'reviewTitle' : 'sourceTitle'));
    if (review) card.append(label('p', 'body', 'reviewBody'));
    card.append(label('p', 'help', 'sourceLanguage'));
    if (!packet.sources.length) card.append(label('p', 'body', 'noResults'));
    for (const source of packet.sources) {
      const item = el('article', 'source');
      item.append(el('p', 'eyebrow', `${source.type || t('source')} ${(source.citation_display_refs || []).join(' ')}`));
      const heading = el('h4', 'source-title');
      appendReference(heading, { label: source.title, route: source.route, display_text: source.title || t('source') });
      item.append(heading, label('p', 'label', 'excerpt'), el('p', 'body', source.snippet || ''));
      if (source.answer_safety.human_review_required) item.append(label('p', 'review-tag', 'humanReview'));
      const metadata = el('dl', 'metadata');
      for (const [key, value] of [
        ['status', source.review_status], ['claim', source.claim_context?.claim_statuses?.join(', ')],
        ['evidence', source.claim_context?.evidence_statuses?.join(', ')], ['risk', source.claim_context?.risk_levels?.join(', ')],
      ]) if (value) metadata.append(label('dt', '', key), el('dd', '', value));
      item.append(metadata);
      const context = el('details', 'details');
      context.append(label('summary', '', 'sourceContext'));
      // Preserve the endpoint's public safety/approval metadata without interpreting it as authority.
      const fields = ['review_status', 'publication_status', 'manual_approval_required', 'approval_context', 'authority_boundary', 'memory_layers', 'memory_context', 'claim_context', 'answer_generation', 'source_policy', 'retrieval_semantics', 'answer_safety'];
      const projection = Object.fromEntries(fields.filter((field) => source[field] !== undefined).map((field) => [field, source[field]]));
      context.append(el('pre', 'policy-data', JSON.stringify(projection, null, 2)));
      item.append(context);
      card.append(item);
    }
    card.append(label('h4', 'label', 'citations'));
    const citations = el('ul', 'citations');
    packet.citation_display.items.forEach((citation) => { const li = el('li'); appendReference(li, citation); citations.append(li); });
    card.append(citations);
    if (!citations.children.length) card.append(label('p', 'help', 'noCitations'));
    card.append(label('h4', 'label', 'qualifications'));
    if (!packet.required_qualifications.length) card.append(label('p', 'help', 'noQualifications'));
    for (const qualification of packet.required_qualifications) {
      const item = el('section', 'qualification');
      item.append(el('strong', '', qualification.claim_id || ''));
      const meta = el('dl', 'metadata');
      for (const [key, field] of [['claim', 'claim_status'], ['evidence', 'evidence_status'], ['risk', 'risk_level']]) {
        meta.append(label('dt', '', key), el('dd', '', qualification[field] || '—'));
      }
      item.append(meta, el('p', 'body', qualification.interpretation_boundary || ''));
      for (const citation of qualification.citations || []) appendReference(item, citation);
      card.append(item);
    }
    list(card, 'rules', packet.refusal_rules);
    const policy = el('details', 'details');
    policy.append(label('summary', '', 'policy'));
    list(policy, 'flags', packet.review_flags);
    list(policy, 'blocked', packet.answer_policy.blocked_reasons);
    list(policy, 'required', packet.answer_policy.required_before_synthesis);
    card.append(policy);
    return card;
  }

  function messageNode(key, text) {
    const node = el('div', key === 'you' ? 'message-user' : 'message');
    node.append(label('p', 'label', key), el('p', 'body', text));
    return node;
  }
  input.addEventListener('input', () => { drafts[mode] = input.value; if (!busy) setStatus(''); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!busy) form.requestSubmit();
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    const message = input.value.trim();
    if (!message) { setStatus('empty', true); input.focus(); return; }
    if (message.length > (mode === 'sources' ? MAX_QUERY : MAX_CHAT)) { setStatus('tooLong', true); input.focus(); return; }
    if (CONTROL_CHARACTERS.test(message)) { setStatus('invalid', true); input.focus(); return; }
    drafts[mode] = input.value;
    busy = true;
    setStatus(mode === 'sources' ? 'searching' : 'sending');
    refresh();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const response = await fetch(mode === 'sources' ? `/api/grounding?q=${encodeURIComponent(message)}` : '/api/chat', {
        method: mode === 'sources' ? 'GET' : 'POST',
        credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: mode === 'sources' ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' },
        ...(mode === 'conversation' ? { body: JSON.stringify({ message, conversation_id: conversationId }) } : {}),
      });
      if (response.status !== 200 && response.status !== 409) {
        const errors = { 400: 'invalidRequest', 403: 'forbidden', 429: 'limited', 502: 'upstream', 503: mode === 'sources' ? 'sourcesUnavailable' : 'unavailable' };
        if (response.status === 503 && mode === 'conversation') unavailable = true;
        setStatus(errors[response.status] || 'upstream', true, retrySeconds(response.headers.get('Retry-After')));
        return;
      }
      let data;
      try { data = await response.json(); } catch { setStatus('malformed', true); return; }
      let result;
      if (mode === 'sources' && response.status === 200 && data?.success === true && validGroundingPacket(data.packet)) {
        result = packetCard(data.packet, false);
      } else if (mode === 'conversation' && response.status === 409 && validGroundingReview(data)) {
        result = packetCard(data.grounding, true);
      } else if (mode === 'conversation' && response.status === 200 && validChatReply(data)) {
        conversationId = data.conversation_id;
        unavailable = false;
        result = messageNode('brain', data.reply);
      } else { setStatus('malformed', true); return; }
      const history = panels[mode].history;
      if (mode === 'sources') history.replaceChildren();
      const request = messageNode(mode === 'sources' ? 'searchLabel' : 'you', message);
      history.append(request, result);
      // A review is not a successful answer: leave its question editable, without automatic retry.
      if (response.status === 200) { input.value = ''; drafts[mode] = ''; }
      setStatus(mode === 'sources' || response.status === 409 ? 'found' : 'received');
      panels[mode].panel.scrollTop = request.offsetTop - panels[mode].panel.offsetTop;
    } catch {
      setStatus(controller.signal.aborted ? 'timeout' : 'network', true);
    } finally {
      clearTimeout(timer);
      busy = false;
      refresh();
    }
  });
  document.addEventListener('uc:languagechange', syncLanguage);
  new MutationObserver(() => syncLanguage()).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  syncLanguage();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountBrain, { once: true });
  else mountBrain();
}
