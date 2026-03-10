/* ═══════════════════════════════════════════════════════════════
   UNWIND CODE — Neural Interface
   Zero dependencies. Maximum signal.
   ═══════════════════════════════════════════════════════════════ */

import { setLanguage, getCurrentLang, getTranslation } from './i18n.js';

const SUPABASE_URL = 'https://rxsjhikbmvstsivrqqyg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4c2poaWtibXZzdHNpdnJxcXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTI1MDYsImV4cCI6MjA4NzI4ODUwNn0.Wt1i-HBRzX6eF0EzSPHbRLoh6wVKDFMGQqqUyiVdKbo';

// ── Language Toggle ─────────────────────────────────────────────
const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
    const next = getCurrentLang() === 'en' ? 'es' : 'en';
    setLanguage(next);
});

// Initialize language from localStorage
setLanguage(getCurrentLang());

// ── Neural Particle Canvas ──────────────────────────────────────
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles = [], mouse = { x: -1000, y: -1000 };

function resize() {
    const hero = document.getElementById('hero');
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
}

function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((w * h) / 12000));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * w, y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2.5 + 1,
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    const maxDist = 140;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Mouse gravity
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            const force = (200 - dist) / 200 * 0.015;
            p.vx += dx * force; p.vy += dy * force;
        }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 45, 190, ${0.3 + p.r / 5})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const d = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (d < maxDist) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(110, 45, 190, ${0.08 * (1 - d / maxDist)})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}

resize();
createParticles();
drawParticles();
window.addEventListener('resize', () => { resize(); createParticles(); });
document.getElementById('hero').addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});
document.getElementById('hero').addEventListener('mouseleave', () => {
    mouse.x = -1000; mouse.y = -1000;
});

// ── Scroll Reveal ───────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = e.target.dataset.delay || 0;
            setTimeout(() => e.target.classList.add('visible'), +delay);
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Nav Scroll ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile Nav Toggle ───────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ── Smooth Anchor ───────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        if (a.id === 'footer-chat-link') { e.preventDefault(); openChat(); return; }
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Organism Card Glow ──────────────────────────────────────────
document.querySelectorAll('.organism-card').forEach(card => {
    const glow = card.querySelector('.card-glow');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        glow.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(110, 45, 190, 0.12), transparent 60%)`;
    });
    card.addEventListener('mouseleave', () => { glow.style.background = 'transparent'; });
});

// ── Email Signup ────────────────────────────────────────────────
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const signupStatus = document.getElementById('signup-status');

emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    signupStatus.className = 'signup-status';
    signupStatus.textContent = 'Subscribing…';

    try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON}` },
            body: JSON.stringify({ email }),
        });

        if (res.ok) {
            signupStatus.textContent = "You're in. The organism will reach out. ∞";
            signupStatus.className = 'signup-status success';
            emailInput.value = '';
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Failed');
        }
    } catch (err) {
        signupStatus.textContent = `Error: ${err.message}`;
        signupStatus.className = 'signup-status error';
    }
});

// ── Wallet Copy ─────────────────────────────────────────────────
document.querySelectorAll('.wallet-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
        const address = btn.dataset.address;
        try {
            await navigator.clipboard.writeText(address);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        } catch { btn.textContent = 'Failed'; }
    });
});

// ── Chat Modal ──────────────────────────────────────────────────
const chatModal = document.getElementById('chat-modal');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
let conversationId = null;

function openChat() {
    chatModal.classList.add('open');
    chatModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    chatInput.focus();

    // Greeting on first open
    if (chatMessages.children.length === 0) {
        addMessage('organism', getTranslation('chat.greeting'));
    }
}

function closeChat() {
    chatModal.classList.remove('open');
    chatModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

document.getElementById('open-chat').addEventListener('click', openChat);
document.getElementById('close-chat').addEventListener('click', closeChat);
document.getElementById('footer-chat-link')?.addEventListener('click', (e) => { e.preventDefault(); openChat(); });
chatModal.querySelector('.chat-overlay').addEventListener('click', closeChat);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatModal.classList.contains('open')) closeChat();
});

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;

    addMessage('user', msg);
    chatInput.value = '';
    showTyping();

    try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON}` },
            body: JSON.stringify({ conversation_id: conversationId, message: msg }),
        });

        hideTyping();

        if (res.ok) {
            const data = await res.json();
            conversationId = data.conversation_id;
            addMessage('organism', data.reply);
        } else {
            addMessage('organism', 'The organism encountered interference. Please try again.');
        }
    } catch {
        hideTyping();
        addMessage('organism', 'Connection lost. The organism is recalibrating.');
    }
});
