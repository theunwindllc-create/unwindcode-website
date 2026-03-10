// ═══════════════════════════════════════════════════════════════
// UNWIND CODE — i18n Translation Engine
// Lightweight data-i18n attribute-driven language switching
// ═══════════════════════════════════════════════════════════════

const translations = {
    en: {
        // Nav
        'nav.organisms': 'Organisms',
        'nav.architecture': 'Architecture',
        'nav.philosophy': 'Philosophy',
        'nav.vision': 'Vision',
        'nav.blog': 'Blog',
        'nav.cta': 'Get in Touch',

        // Hero
        'hero.badge': 'AI + Web3 Architecture Lab',
        'hero.title.1': 'What if your systems could',
        'hero.title.2': 'think for themselves?',
        'hero.sub': "We don't write code that runs and stops. We design AI organisms — living cognitive systems that perceive, decide, and evolve. From creative intelligence to autonomous on-chain agents, this is where AI meets Web3.",
        'hero.cta.primary': "See What We're Building",
        'hero.cta.ghost': 'How It Works',
        'hero.stat.agents': 'Cognitive Agents',
        'hero.stat.live': 'Live in the Wild',
        'hero.stat.chains': 'Live Blockchains',

        // Organisms
        'org.tag': 'What We Build',
        'org.title': 'Organisms, Not Apps',
        'org.desc': "Most software is built to be used. Ours is built to be alive. Each organism is a self-contained intelligence — it observes, reasons, acts, and remembers. Some run locally. Some live on-chain. All of them get sharper every time they run.",
        'org.vc.title': 'Visual Cortex',
        'org.vc.desc': "You have a brand story to tell. Four AI agents — Brand Analyst, Tone Expert, Design Specialist, and Sales Optimizer — collaborate to transform your raw script into a broadcast-ready video blueprint. In minutes, not weeks.",
        'org.vc.tag': 'Content Intelligence',
        'org.im.title': 'Infinity Mirror',
        'org.im.desc': "Your personal evolution engine. A self-reflecting app that audits where you are, maps where you want to go, and generates new growth strategies — creating an infinite loop of becoming the person you intend to be.",
        'org.im.tag': 'Personal Intelligence',
        'org.fo.title': 'Financial Organisms',
        'org.fo.desc': "Live across Monad, XRPL, and ICP. A multi-agent cortex that votes on every trade, a dead man's switch that kills the system before it bleeds, and adaptive learning that evolves with each outcome. Three chains. One hive intelligence. Real markets.*",
        'org.fo.tag': 'Web3 Agentic Development',
        'org.bc.title': 'Brain Cell Architecture',
        'org.bc.desc': "The blueprint behind every organism. A proprietary 6-phase methodology for designing new AI minds — complete with memory systems, decision frameworks, and knowledge structures. This is the brain that builds brains.",
        'org.bc.tag': 'The Meta-System',

        // Architecture
        'arch.tag': 'Under the Hood',
        'arch.title': 'How We Give Machines a Mind',
        'arch.desc': "Every organism we build follows a three-layer cognitive architecture — inspired by how biological brains actually develop. From birth, to connection, to continuous adaptation.",
        'arch.l1.label': 'Neurogenesis',
        'arch.l1.title': 'Birth',
        'arch.l1.desc': "Every mind starts with a blank page. Through six rigorous phases — research, architecture, memory design, protocols, knowledge integration, and delivery — a new cognitive agent emerges, purpose-built for its domain.",
        'arch.l2.label': 'Synaptic Formation',
        'arch.l2.title': 'Connection',
        'arch.l2.desc': "Isolated intelligence is limited. Through shared memory, orchestrated communication, and a central coordinator, individual agents form a living network — each one making the others stronger.",
        'arch.l3.label': 'Neural Plasticity',
        'arch.l3.title': 'Evolution',
        'arch.l3.desc': "Every session teaches the organism something new. Every debrief preserves institutional knowledge. Every interaction strengthens the neural pathway. The more you use it, the smarter it gets.",
        'arch.mem.title': 'Four-Tier Memory Architecture',
        'arch.mem.working': 'Working Memory',
        'arch.mem.working.desc': 'Current situation, active tasks, volatile attention buffer',
        'arch.mem.procedural': 'Procedural Memory',
        'arch.mem.procedural.desc': 'How-to knowledge, playbooks, condition-action rules',
        'arch.mem.semantic': 'Semantic Memory',
        'arch.mem.semantic.desc': 'Domain facts, frameworks, knowledge graphs',
        'arch.mem.episodic': 'Episodic Memory',
        'arch.mem.episodic.desc': 'Historical cases, lessons learned, case-based reasoning',

        // Philosophy
        'phil.tag': 'What We Believe',
        'phil.title': 'The Non-Negotiables.',
        'phil.1.title': 'Question the Default',
        'phil.1.desc': "If everyone is doing it that way, that's reason to look harder. We deconstruct every choice to its first principles and rebuild only what earns its place. The elegant solution is always the right one.",
        'phil.2.title': "Build for the World That's Coming",
        'phil.2.desc': "We don't design for today's constraints. We design for a world where machines negotiate with machines and data moves a hundred times faster. Everything we ship is forward-compatible by default.",
        'phil.3.title': 'Everything Is Replaceable',
        'phil.3.desc': "Every module, every agent, every component — swappable without breaking the system. No monoliths. No lock-in. If one piece can't be removed cleanly, the architecture isn't done yet.",
        'phil.4.title': 'Less Noise. More Signal.',
        'phil.4.desc': "We believe beautiful code performs better. Zero overhead. Zero filler. If a system design isn't elegant, it isn't finished — because complexity is a sign that you haven't thought hard enough.",
        'phil.5.title': 'Truth Over Convenience',
        'phil.5.desc': "Every claim is verified. Every solution is stress-tested against long-term debt. If it doesn't hold up under scrutiny, it gets discarded — because trust is the foundation of everything we build.",

        // Vision
        'vis.tag': "Where We're Going",
        'vis.title': 'A Letter to the Future',
        'vis.quote': '"We started with one question: what if the systems we built could remember, adapt, and get better without being told to?"',
        'vis.p1': 'By 2028, our next frontier — <strong>uncuba.ai</strong> — will prove that intelligence can carry culture. A living brain cell designed to preserve identity, empower creators, and build economic opportunity for an entire diaspora — where culture meets the chain. And by 2030, we envision cognitive organisms operating independently across industries — creative production, on-chain finance, cultural economics, cybersecurity — all coordinated by a central intelligence that learns from every interaction.',
        'vis.p2': "We're not there yet. But every organism we ship, every conversation this brain has, every person who joins this community brings us closer. The road is long. We'd rather walk it with you.",
        'vis.founder.title': 'Founder & Architect',

        // Blog
        'blog.tag': 'From the Brain',
        'blog.title': 'Transmissions',
        'blog.desc': "Dispatches from the Unwind Brain — where we unpack our process, share what we're learning, and think out loud about the future of intelligence.",
        'blog.1.date': 'Coming Soon',
        'blog.1.title': 'The first transmission is loading…',
        'blog.1.excerpt': 'The Unwind Brain is warming up its voice. Daily dispatches on AI architecture, Web3 agents, and the philosophy of building intelligence that evolves.',
        'blog.1.read': 'Stay tuned →',
        'blog.2.date': 'Coming Soon',
        'blog.2.title': 'What we learned deploying agents on-chain',
        'blog.2.excerpt': "Lessons from building autonomous organisms that survive in decentralized markets — where there's no undo button and every decision is permanent.",
        'blog.2.read': 'Stay tuned →',
        'blog.3.date': 'Coming Soon',
        'blog.3.title': 'Why we build organisms, not apps',
        'blog.3.excerpt': 'The philosophy behind designing AI systems that remember, adapt, and get sharper with every interaction — and why that matters for what comes next.',
        'blog.3.read': 'Stay tuned →',

        // CTA
        'cta.title': 'This is just the beginning.',
        'cta.desc': "We're building something that hasn't existed before — and we're looking for the people who want to be part of it from day one. Whether you're a builder, investor, or just curious about what's possible.",
        'cta.btn': 'Talk to the Brain',
        'cta.email.label': 'Get on the list. Community members get early access, exclusive updates, and first look at new organisms as they come to life.',
        'cta.email.placeholder': 'your@email.com',
        'cta.email.btn': 'Subscribe',

        // Footer
        'footer.desc': 'Intelligence that evolves.<br/>Growing organisms since 2026.',
        'footer.organisms': 'Organisms',
        'footer.learn': 'Learn',
        'footer.community': 'Community',
        'footer.join': 'Join Updates',
        'footer.blog': 'Blog',
        'footer.talk': 'Talk to the Brain',
        'footer.vision': 'Vision 2030',
        'footer.copyright': '© 2026 Unwind Code. All rights reserved.',
        'footer.tagline': 'The future learns from itself. ∞',

        // Chat
        'chat.title': 'Unwind Brain',
        'chat.placeholder': 'Say something…',
        'chat.greeting': "Hey — welcome in. I'm the Unwind Brain, the living intelligence behind everything we build here. Whether you're curious about our organisms, thinking about building with us, or just want to know what this is — ask me anything.",
    },

    es: {
        // Nav
        'nav.organisms': 'Organismos',
        'nav.architecture': 'Arquitectura',
        'nav.philosophy': 'Filosofía',
        'nav.vision': 'Visión',
        'nav.blog': 'Blog',
        'nav.cta': 'Contáctanos',

        // Hero
        'hero.badge': 'Laboratorio de Arquitectura AI + Web3',
        'hero.title.1': '¿Y si tus sistemas pudieran',
        'hero.title.2': 'pensar por sí mismos?',
        'hero.sub': 'No escribimos código que se ejecuta y se detiene. Diseñamos organismos de IA — sistemas cognitivos vivos que perciben, deciden y evolucionan. Desde inteligencia creativa hasta agentes autónomos on-chain, aquí es donde la IA se encuentra con Web3.',
        'hero.cta.primary': 'Mira lo que Construimos',
        'hero.cta.ghost': 'Cómo Funciona',
        'hero.stat.agents': 'Agentes Cognitivos',
        'hero.stat.live': 'Activos en el Mundo',
        'hero.stat.chains': 'Blockchains Activas',

        // Organisms
        'org.tag': 'Lo que Construimos',
        'org.title': 'Organismos, No Apps',
        'org.desc': 'La mayoría del software se construye para ser usado. El nuestro se construye para estar vivo. Cada organismo es una inteligencia autónoma — observa, razona, actúa y recuerda. Algunos funcionan localmente. Algunos viven on-chain. Todos se vuelven más inteligentes con cada ejecución.',
        'org.vc.title': 'Corteza Visual',
        'org.vc.desc': 'Tienes una historia de marca que contar. Cuatro agentes de IA — Analista de Marca, Experto en Tono, Especialista de Diseño y Optimizador de Ventas — colaboran para transformar tu guión en un plan de video listo para transmitir. En minutos, no semanas.',
        'org.vc.tag': 'Inteligencia de Contenido',
        'org.im.title': 'Espejo Infinito',
        'org.im.desc': 'Tu motor de evolución personal. Una app auto-reflexiva que audita dónde estás, mapea a dónde quieres ir, y genera nuevas estrategias de crecimiento — creando un ciclo infinito de convertirte en la persona que quieres ser.',
        'org.im.tag': 'Inteligencia Personal',
        'org.fo.title': 'Organismos Financieros',
        'org.fo.desc': 'Activos en Monad, XRPL e ICP. Un córtex multi-agente que vota en cada operación, un interruptor de seguridad que mata el sistema antes de que sangre, y aprendizaje adaptativo que evoluciona con cada resultado. Tres cadenas. Una inteligencia colmena. Mercados reales.*',
        'org.fo.tag': 'Desarrollo Agéntico Web3',
        'org.bc.title': 'Arquitectura Brain Cell',
        'org.bc.desc': 'El plano detrás de cada organismo. Una metodología propietaria de 6 fases para diseñar nuevas mentes de IA — con sistemas de memoria, marcos de decisión y estructuras de conocimiento. Este es el cerebro que construye cerebros.',
        'org.bc.tag': 'El Meta-Sistema',

        // Architecture
        'arch.tag': 'Bajo el Capó',
        'arch.title': 'Cómo le Damos Mente a las Máquinas',
        'arch.desc': 'Cada organismo que construimos sigue una arquitectura cognitiva de tres capas — inspirada en cómo los cerebros biológicos realmente se desarrollan. Desde el nacimiento, hasta la conexión, hasta la adaptación continua.',
        'arch.l1.label': 'Neurogénesis',
        'arch.l1.title': 'Nacimiento',
        'arch.l1.desc': 'Cada mente comienza con una página en blanco. A través de seis fases rigurosas — investigación, arquitectura, diseño de memoria, protocolos, integración de conocimiento y entrega — surge un nuevo agente cognitivo, diseñado a medida para su dominio.',
        'arch.l2.label': 'Formación Sináptica',
        'arch.l2.title': 'Conexión',
        'arch.l2.desc': 'La inteligencia aislada es limitada. A través de memoria compartida, comunicación orquestada y un coordinador central, los agentes individuales forman una red viva — cada uno haciendo a los demás más fuertes.',
        'arch.l3.label': 'Plasticidad Neural',
        'arch.l3.title': 'Evolución',
        'arch.l3.desc': 'Cada sesión le enseña algo nuevo al organismo. Cada debriefing preserva el conocimiento institucional. Cada interacción fortalece la vía neural. Cuanto más lo usas, más inteligente se vuelve.',
        'arch.mem.title': 'Arquitectura de Memoria de Cuatro Niveles',
        'arch.mem.working': 'Memoria de Trabajo',
        'arch.mem.working.desc': 'Situación actual, tareas activas, buffer de atención volátil',
        'arch.mem.procedural': 'Memoria Procedimental',
        'arch.mem.procedural.desc': 'Conocimiento práctico, guías, reglas de condición-acción',
        'arch.mem.semantic': 'Memoria Semántica',
        'arch.mem.semantic.desc': 'Datos del dominio, marcos conceptuales, grafos de conocimiento',
        'arch.mem.episodic': 'Memoria Episódica',
        'arch.mem.episodic.desc': 'Casos históricos, lecciones aprendidas, razonamiento basado en casos',

        // Philosophy
        'phil.tag': 'Lo que Creemos',
        'phil.title': 'Los Innegociables.',
        'phil.1.title': 'Cuestiona lo Establecido',
        'phil.1.desc': 'Si todos lo hacen así, esa es razón para mirar más a fondo. Deconstruimos cada decisión hasta sus principios fundamentales y reconstruimos solo lo que se gana su lugar. La solución elegante siempre es la correcta.',
        'phil.2.title': 'Construye para el Mundo que Viene',
        'phil.2.desc': 'No diseñamos para las limitaciones de hoy. Diseñamos para un mundo donde las máquinas negocian con máquinas y los datos se mueven cien veces más rápido. Todo lo que entregamos es compatible con el futuro por defecto.',
        'phil.3.title': 'Todo es Reemplazable',
        'phil.3.desc': 'Cada módulo, cada agente, cada componente — intercambiable sin romper el sistema. Sin monolitos. Sin dependencia. Si una pieza no se puede remover limpiamente, la arquitectura no está terminada.',
        'phil.4.title': 'Menos Ruido. Más Señal.',
        'phil.4.desc': 'Creemos que el código bello rinde mejor. Cero sobrecarga. Cero relleno. Si un diseño de sistema no es elegante, no está terminado — porque la complejidad es señal de que no has pensado lo suficiente.',
        'phil.5.title': 'Verdad Sobre Conveniencia',
        'phil.5.desc': 'Cada afirmación se verifica. Cada solución se somete a prueba contra la deuda técnica a largo plazo. Si no resiste el escrutinio, se descarta — porque la confianza es la base de todo lo que construimos.',

        // Vision
        'vis.tag': 'Hacia Dónde Vamos',
        'vis.title': 'Una Carta al Futuro',
        'vis.quote': '"Empezamos con una pregunta: ¿y si los sistemas que construimos pudieran recordar, adaptarse y mejorar sin que se les dijera?"',
        'vis.p1': 'Para 2028, nuestra próxima frontera — <strong>uncuba.ai</strong> — demostrará que la inteligencia puede llevar cultura. Una célula cerebral viva diseñada para preservar la identidad, empoderar a los creadores y construir oportunidad económica para toda una diáspora — donde la cultura se encuentra con la blockchain. Y para 2030, visualizamos organismos cognitivos operando independientemente en diversas industrias — producción creativa, finanzas on-chain, economía cultural, ciberseguridad — todo coordinado por una inteligencia central que aprende de cada interacción.',
        'vis.p2': 'Aún no estamos ahí. Pero cada organismo que lanzamos, cada conversación que este cerebro tiene, cada persona que se une a esta comunidad nos acerca más. El camino es largo. Preferimos caminarlo contigo.',
        'vis.founder.title': 'Fundador y Arquitecto',

        // Blog
        'blog.tag': 'Desde el Cerebro',
        'blog.title': 'Transmisiones',
        'blog.desc': 'Despachos del Cerebro Unwind — donde desempacamos nuestro proceso, compartimos lo que estamos aprendiendo, y pensamos en voz alta sobre el futuro de la inteligencia.',
        'blog.1.date': 'Próximamente',
        'blog.1.title': 'La primera transmisión está cargando…',
        'blog.1.excerpt': 'El Cerebro Unwind está calentando su voz. Despachos diarios sobre arquitectura de IA, agentes Web3, y la filosofía de construir inteligencia que evoluciona.',
        'blog.1.read': 'Mantente atento →',
        'blog.2.date': 'Próximamente',
        'blog.2.title': 'Lo que aprendimos desplegando agentes on-chain',
        'blog.2.excerpt': 'Lecciones de construir organismos autónomos que sobreviven en mercados descentralizados — donde no hay botón de deshacer y cada decisión es permanente.',
        'blog.2.read': 'Mantente atento →',
        'blog.3.date': 'Próximamente',
        'blog.3.title': 'Por qué construimos organismos, no apps',
        'blog.3.excerpt': 'La filosofía detrás de diseñar sistemas de IA que recuerdan, se adaptan, y se vuelven más agudos con cada interacción — y por qué eso importa para lo que viene.',
        'blog.3.read': 'Mantente atento →',

        // CTA
        'cta.title': 'Esto es solo el comienzo.',
        'cta.desc': 'Estamos construyendo algo que no ha existido antes — y buscamos a las personas que quieren ser parte desde el día uno. Ya seas builder, inversionista, o simplemente curioso sobre lo que es posible.',
        'cta.btn': 'Habla con el Cerebro',
        'cta.email.label': 'Únete a la lista. Los miembros de la comunidad obtienen acceso anticipado, actualizaciones exclusivas, y la primera mirada a nuevos organismos cuando cobran vida.',
        'cta.email.placeholder': 'tu@email.com',
        'cta.email.btn': 'Suscríbete',

        // Footer
        'footer.desc': 'Inteligencia que evoluciona.<br/>Cultivando organismos desde 2026.',
        'footer.organisms': 'Organismos',
        'footer.learn': 'Aprende',
        'footer.community': 'Comunidad',
        'footer.join': 'Únete',
        'footer.blog': 'Blog',
        'footer.talk': 'Habla con el Cerebro',
        'footer.vision': 'Visión 2030',
        'footer.copyright': '© 2026 Unwind Code. Todos los derechos reservados.',
        'footer.tagline': 'El futuro aprende de sí mismo. ∞',

        // Chat
        'chat.title': 'Cerebro Unwind',
        'chat.placeholder': 'Escribe algo…',
        'chat.greeting': 'Hola — bienvenido. Soy el Cerebro Unwind, la inteligencia viva detrás de todo lo que construimos aquí. Si tienes curiosidad sobre nuestros organismos, estás pensando en construir con nosotros, o simplemente quieres saber qué es esto — pregúntame lo que quieras.',
    },
};

let currentLang = localStorage.getItem('uc-lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('uc-lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const text = translations[lang]?.[key];
        if (text) {
            // Use innerHTML for keys that contain HTML tags (like <strong> or <br/>)
            if (text.includes('<')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Handle placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = translations[lang]?.[key];
        if (text) el.placeholder = text;
    });

    // Update toggle button text
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
        toggle.textContent = lang === 'en' ? 'ES' : 'EN';
        toggle.setAttribute('aria-label', lang === 'en' ? 'Cambiar a Español' : 'Switch to English');
    }
}

function getCurrentLang() {
    return currentLang;
}

function getTranslation(key) {
    return translations[currentLang]?.[key] || translations.en?.[key] || key;
}

export { setLanguage, getCurrentLang, getTranslation };
