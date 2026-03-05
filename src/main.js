import './style.css';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import gsap from 'gsap';
import anime from 'animejs/lib/anime.es.js';
import {
    demoProfile,
    demoUserPrefs,
    demoSeed,
    initialDemoMessages,
    getDeterministicSuggestions,
    createChatState,
    applySuggestionToDraft,
    updateChatDraft,
    sendDraftMessage
} from './demoData.js';

const deck = new Reveal({
    hash: true,
    controls: false,
    progress: false,
    center: false,
    transition: 'none',
    backgroundTransition: 'none',
    width: '100%',
    height: '100%',
    margin: 0,
    minScale: 1,
    maxScale: 1,
    keyboard: true
});

const demoChat = {
    tone: demoUserPrefs.tone,
    seedOffset: 0,
    state: createChatState(initialDemoMessages),
    suggestions: []
};

const pageLoadSeed = Math.floor(Math.random() * 1_000_000_000);

const demoProfileView = {
    currentScreen: 0,
    dragStartX: 0,
    dragCurrentX: 0,
    dragging: false
};

const demoElements = {
    thread: null,
    suggestions: null,
    draftInput: null,
    sendButton: null,
    regenerateButton: null,
    toneButtons: []
};

function getCurrentSuggestionSeed() {
    return demoSeed + pageLoadSeed + demoChat.seedOffset;
}

deck.initialize().then(() => {
    setupCustomProgressBar();
    setupAnimations();
    setupDrag();
    setupDemoSlides();
    syncFixedUi(deck.getState().indexh);

    setTimeout(() => {
        triggerSlideAnimation(deck.getState().indexh, 'next');
    }, 100);
});

function setupCustomProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    const update = () => {
        const total = deck.getTotalSlides();
        const current = deck.getSlidePastCount() + 1;
        progressBar.style.width = `${(current / total) * 100}%`;
    };

    update();
    deck.on('slidechanged', update);
}

function parseSlideIndexFromState(value) {
    if (!value) return null;
    const parsed = Number(value.replace('slide-', '')) - 1;
    return Number.isFinite(parsed) ? parsed : null;
}

function triggerSlideAnimation(indexh, direction) {
    const state = `slide-${indexh + 1}`;
    const slideSel = `section[data-state="${state}"]`;
    const slideEl = document.querySelector(slideSel);

    if (!slideEl) return;

    gsap.killTweensOf(`${slideSel} *`);

    const fromX = direction === 'next' ? '100vw' : '-100vw';
    gsap.fromTo(slideEl,
        { x: fromX, opacity: 1 },
        { x: '0vw', duration: 0.8, ease: 'power3.out' }
    );

    if (state === 'slide-1') {
        gsap.fromTo('.hero-flame .flame-path', { strokeDasharray: 1000, strokeDashoffset: 1000 }, { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut', delay: 0.3 });
        gsap.to('.hero-flame .flame-fill', { opacity: 1, duration: 1, delay: 2.5 });
        gsap.fromTo('.hero-content h1', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'back.out(1.5)' });
        gsap.fromTo('.hero-content p', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.1 });

        setTimeout(() => {
            const actionRow = document.getElementById('action-row');
            if (actionRow) actionRow.classList.remove('hidden');
            gsap.fromTo('.action-btn', { scale: 0, y: 30 }, { scale: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'back.out(2)' });
        }, 1500);
    } else if (state === 'slide-2') {
        gsap.fromTo(`${slideSel} .reflection-phone-shell`,
            { y: 90, scale: 0.88, opacity: 0, rotationX: 18, transformPerspective: 1200 },
            { y: 0, scale: 1, opacity: 1, rotationX: 0, duration: 1.1, ease: 'power3.out', delay: 0.2 }
        );
        gsap.fromTo(`${slideSel} .reflection-phone-screen`,
            { opacity: 0.35 },
            { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.5 }
        );
        gsap.fromTo(`${slideSel} .reflection-phone-sheen`,
            { xPercent: -85, opacity: 0 },
            { xPercent: 85, opacity: 0.72, duration: 2.2, ease: 'sine.inOut', delay: 0.8, repeat: -1, repeatDelay: 0.6 }
        );
    } else if (state === 'slide-3') {
        gsap.fromTo(`${slideSel} .glass-container`, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo(`${slideSel} .impact-text`, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, delay: 0.6 });
        gsap.fromTo(`${slideSel} .fade-text`, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.3 });

        const bubblePath = document.querySelector(`${slideSel} .bubble-path`);
        if (bubblePath) {
            const len = bubblePath.getTotalLength();
            gsap.set(bubblePath, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(bubblePath, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.8 });
        }

        gsap.fromTo(`${slideSel} .dot`, { y: 5, opacity: 0 }, { y: -5, opacity: 1, duration: 0.5, stagger: 0.2, yoyo: true, repeat: -1, delay: 1.8 });
    } else if (state === 'slide-4') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });

        const orbs = document.querySelectorAll(`${slideSel} .orb`);
        gsap.fromTo(orbs,
            { scale: 0, opacity: 0 },
            {
                scale: 1, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'back.out(1.5)', delay: 0.6,
                onComplete: () => {
                    orbs.forEach((orb, i) => {
                        gsap.to(orb, {
                            y: i % 2 === 0 ? 10 : -10,
                            duration: 2 + i * 0.5,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut"
                        });
                    });
                }
            }
        );
        gsap.fromTo(`${slideSel} .orb-icon svg`, { scale: 0, rotate: -45, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(2)', delay: 1 });
        gsap.fromTo(`${slideSel} .conn-line`, { strokeDasharray: 500, strokeDashoffset: 500 }, { strokeDashoffset: 0, duration: 1, stagger: 0.3, delay: 1 });
    } else if (state === 'slide-5') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });

        const tiers = document.querySelectorAll(`${slideSel} .h-tier`);
        if (tiers.length > 0) {
            gsap.fromTo(tiers,
                { y: 300, opacity: 0, rotationX: 80, rotationZ: -10 },
                {
                    y: 0, opacity: 1, rotationX: 45, rotationZ: -15, stagger: 0.2, duration: 1.2, ease: 'power3.out', delay: 0.7,
                    onComplete: () => {
                        tiers.forEach(tier => {
                            tier.addEventListener('mouseenter', () => {
                                gsap.to(tier, {
                                    rotationX: 0,
                                    rotationZ: 0,
                                    z: 60,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    duration: 0.5,
                                    ease: 'back.out(1.2)',
                                    overwrite: true
                                });
                                tier.style.zIndex = "20";
                            });
                            tier.removeEventListener('mouseleave', null);
                            tier.addEventListener('mouseleave', () => {
                                gsap.to(tier, {
                                    rotationX: 45,
                                    rotationZ: -15,
                                    z: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    duration: 0.5,
                                    ease: 'power2.inOut',
                                    overwrite: true
                                });
                                tier.style.zIndex = "";
                            });
                        });
                    }
                }
            );
        }

        const conns = document.querySelectorAll(`${slideSel} .h-conn`);
        if (conns.length > 0) {
            gsap.fromTo(conns,
                { opacity: 0, strokeDashoffset: 24 },
                {
                    opacity: 1, strokeDashoffset: 0, duration: 1.2, stagger: 0.3, delay: 1.5, ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(conns, {
                            strokeDashoffset: -24,
                            duration: 1.2,
                            ease: "none",
                            repeat: -1
                        });
                    }
                }
            );
        }
    } else if (state === 'slide-6') {
        gsap.fromTo(`${slideSel} .metric-col`,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.3, ease: 'power2.out', delay: 0.2 }
        );

        gsap.fromTo(`${slideSel} .glow-metric`,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.6, stagger: 0.3 }
        );

        gsap.fromTo(`${slideSel} #clock-svg`, { scale: 0, opacity: 0, rotate: -90 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 1 });
        gsap.fromTo(`${slideSel} #hour-hand`, { rotation: 0 }, { rotation: 360, duration: 12, repeat: -1, ease: "none", svgOrigin: "50 50" });
        gsap.fromTo(`${slideSel} #minute-hand`, { rotation: 0 }, { rotation: 360, duration: 2, repeat: -1, ease: "none", svgOrigin: "50 50" });

        gsap.fromTo(`${slideSel} .shield-main-icon`, { scale: 0, opacity: 0, rotate: 15 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 1.3 });
        gsap.to(`${slideSel} .shield-main-icon`, { y: -5, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.3 });

        gsap.fromTo(`${slideSel} .body-text`, { opacity: 0, y: 10 }, { opacity: 0.8, y: 0, duration: 1, delay: 1.6, stagger: 0.3 });
    } else if (state === 'slide-7') {
        gsap.fromTo(`${slideSel} .split-left`, { x: '-100%' }, { x: '0%', duration: 0.8, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(`${slideSel} .split-right`, { x: '100%' }, { x: '0%', duration: 0.8, ease: 'power3.out', delay: 0.2 });

        // Indicator Arrows
        gsap.fromTo(`${slideSel} .indicator-arrow`,
            { scale: 0, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.8, delay: 1, stagger: 0.3, ease: 'back.out(2)' }
        );
        gsap.to(`${slideSel} .arrow-up`, {
            y: -15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.8
        });
        gsap.to(`${slideSel} .arrow-down`, {
            y: 15,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.1
        });

        gsap.fromTo([`${slideSel} .split-left h2`, `${slideSel} .split-right h2`], { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, delay: 0.8, duration: 0.6, stagger: 0.2 });
        gsap.fromTo([`${slideSel} .split-left p`, `${slideSel} .split-right p`], { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 1.2, duration: 0.6, stagger: 0.1 });
    } else if (state === 'slide-8') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.2 });

        // 1. Lines shoot out from center junction
        gsap.fromTo(`${slideSel} .nexus-line`,
            { strokeDashoffset: 400, opacity: 0 },
            { strokeDashoffset: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.4, ease: 'power2.out' }
        );

        // 2. Nodes pop out from center following the line trajectory
        gsap.fromTo(`${slideSel} .nexus-node`,
            {
                scale: 0,
                opacity: 0,
                x: (i) => (i === 0 || i === 3) ? 150 : -150,
                y: (i) => (i < 2) ? 100 : -100, // Resets previous floating offsets
                rotation: (i) => i % 2 === 0 ? -10 : 10
            },
            {
                scale: 1,
                opacity: 1,
                x: 0,
                y: 0,
                rotation: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'expo.out',
                delay: 0.6
            }
        );

        // 3. Continuous floating effect with refined movement
        gsap.to(`${slideSel} .nexus-node`, {
            y: (i) => i % 2 === 0 ? 12 : -12,
            duration: (i) => 2.5 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.2
        });
    } else if (state === 'slide-9') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
    } else if (state === 'slide-10') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });

        gsap.fromTo(`${slideSel} .alert-svg`, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.6 });
        gsap.to(`${slideSel} .alert-svg path, ${slideSel} .alert-svg line`, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: 0.6, stagger: 0.2 });

        gsap.fromTo(`${slideSel} .risk-layout .glass-container`, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.8 });
        gsap.to(`${slideSel} .heartbeat-bg`, { scale: 1.1, opacity: 0.8, duration: 0.8, yoyo: true, repeat: -1, ease: 'power1.inOut', delay: 1 });
        gsap.fromTo(`${slideSel} .risk-card`, { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 0.6, delay: 1 });
    } else if (state === 'slide-11') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });
        gsap.fromTo(`${slideSel} .gold-card`, { y: 100, opacity: 0, rotationY: -30 }, { y: 0, opacity: 1, rotationY: 0, duration: 1, ease: 'power3.out', delay: 0.8 });
        gsap.to(`${slideSel} .glare`, { x: '400%', duration: 1.5, delay: 2, ease: 'power1.inOut', repeat: -1, repeatDelay: 3 });
    } else if (state === 'slide-12') {
        // High-Budget 3D Presentation Entry
        gsap.fromTo(`${slideSel} .tinder-device`,
            { y: 800, z: -400, rotationY: -45, rotationX: 20, rotationZ: -10, opacity: 0, transformPerspective: 1200 },
            { y: 0, z: 0, rotationY: 0, rotationX: 0, rotationZ: 0, opacity: 1, duration: 1.8, ease: 'power4.out', delay: 0.1 }
        );
        gsap.fromTo(`${slideSel} .demo-inputs-card`,
            { x: 200, opacity: 0, scale: 0.8, rotationY: 20, transformPerspective: 1000 },
            { x: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.5, ease: 'back.out(1.2)', delay: 0.4 }
        );

        // AI Parsing Sequence with Text Scramble Effect
        const label = document.querySelector(`${slideSel} .demo-input-label`);
        if (label) {
            const originalText = label.textContent;
            gsap.set(label, { textContent: '' });
            gsap.to(label, { textContent: originalText, duration: 1.2, ease: 'none', delay: 0.9 });
        }

        // Dynamic Telemetry Node Staggering
        gsap.fromTo(`${slideSel} .demo-telemetry-node`,
            { scale: 0.2, opacity: 0, y: 40, rotation: -10 },
            { scale: 1, opacity: 1, y: 0, rotation: 0, duration: 0.8, stagger: { each: 0.15, from: "start" }, ease: 'back.out(2)', delay: 1.2 }
        );

        // Threat/Blocked Node Pulsing
        gsap.to(`${slideSel} .demo-telemetry-node.blocked`,
            { filter: 'brightness(1.8) drop-shadow(0 0 20px rgba(255, 51, 51, 0.8))', duration: 0.3, yoyo: true, repeat: 3, delay: 2.2 }
        );

        // Continuous Scanning Sweeper
        const scanningLine = document.querySelector(`${slideSel} .demo-scanning-line`);
        if (scanningLine) {
            gsap.fromTo(scanningLine,
                { y: '-10%', opacity: 0 },
                { y: '160%', opacity: 1, duration: 2.0, ease: 'power2.inOut', repeat: -1, repeatDelay: 1.5, delay: 0.8 }
            );
        }

        gsap.fromTo(`${slideSel} .tinder-swipe-hint`,
            { y: -20, opacity: 0, letterSpacing: '0.2em' },
            { y: 0, opacity: 1, letterSpacing: '0', duration: 1, ease: 'power3.out', delay: 1.8 }
        );

    } else if (state === 'slide-13') {
        const device = document.querySelector(`${slideSel} .demo-chat-device`);
        if (device) {
            gsap.fromTo(device,
                { y: 200, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.7)', delay: 0.1 }
            );
        }

        const thread = document.querySelector(`${slideSel} .demo-chat-thread`);
        if (thread) {
            gsap.fromTo(thread,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', delay: 0.5 }
            );
        }

        const suggestionsWrap = document.querySelector(`${slideSel} .demo-inline-suggestions-wrap`);
        if (suggestionsWrap) {
            gsap.fromTo(suggestionsWrap,
                { y: '100%', opacity: 0 },
                { y: '0%', opacity: 1, duration: 1, ease: 'power4.out', delay: 0.8 }
            );
        }
    }
}

function setupAnimations() {
    deck.on('slidechanged', (event) => {
        const previousState = event.previousSlide?.dataset.state;
        const previousIndex = parseSlideIndexFromState(previousState);
        const isNext = previousIndex === null ? true : event.indexh >= previousIndex;

        if (event.previousSlide) {
            gsap.set(event.previousSlide, { opacity: 0, x: isNext ? '-100vw' : '100vw' });
        }

        syncFixedUi(event.indexh);
        if (event.indexh === 11) resetDemoProfileCarousel();
        if (event.indexh === 12) resetDemoChat();
        triggerSlideAnimation(event.indexh, isNext ? 'next' : 'prev');
    });

    document.querySelectorAll('.action-btn').forEach((btn) => {
        btn.addEventListener('mouseenter', () => anime({ targets: btn, scale: 1.15, duration: 300, easing: 'easeOutElastic(1, .8)' }));
        btn.addEventListener('mouseleave', () => anime({ targets: btn, scale: 1, duration: 300, easing: 'easeOutElastic(1, .8)' }));
    });

    document.querySelector('.btn-nope')?.addEventListener('click', () => swipeOut('-100vw', -15, () => deck.prev()));
    document.querySelector('.btn-like')?.addEventListener('click', () => swipeOut('100vw', 15, () => deck.next()));
    document.querySelector('.btn-superlike')?.addEventListener('click', triggerMatchScreen);
}

function setupDrag() {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    document.addEventListener('pointerdown', (event) => {
        if (!event.target.closest('section')) return;
        if (event.target.closest('.no-slide-drag')) return;
        if (event.target.closest('button') || event.target.closest('a') || event.target.closest('textarea')) return;
        isDragging = true;
        startX = event.clientX;
    });

    document.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        currentX = event.clientX - startX;
        const slide = deck.getCurrentSlide();
        if (slide) gsap.set(slide, { x: currentX, rotation: currentX * 0.02 });
    });

    document.addEventListener('pointerup', endDrag);
    document.addEventListener('pointercancel', endDrag);

    function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        const slide = deck.getCurrentSlide();
        if (!slide) return;

        if (currentX > 150) swipeOut('100vw', 15, () => deck.next());
        else if (currentX < -150) swipeOut('-100vw', -15, () => deck.prev());
        else if (Math.abs(currentX) > 0) gsap.to(slide, { x: 0, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.7)' });
        currentX = 0;
    }
}

function swipeOut(xOffset, rotation, callback) {
    const slide = deck.getCurrentSlide();
    if (!slide) return callback();
    gsap.to(slide, {
        x: xOffset,
        rotation,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            gsap.set(slide, { opacity: 1, rotation: 0 });
            callback();
        }
    });
}

function triggerMatchScreen() {
    const matchScreen = document.getElementById('match-screen');
    if (!matchScreen) return;
    matchScreen.classList.add('active');
    gsap.fromTo('.match-text', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.2 });
    gsap.fromTo('.match-subtext', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4 });
    gsap.fromTo('.match-btn', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.6 });

    document.querySelector('.match-btn')?.addEventListener('click', () => {
        gsap.to(matchScreen, { opacity: 0, duration: 0.4, onComplete: () => matchScreen.classList.remove('active') });
    }, { once: true });
}

function syncFixedUi(indexh) {
    const actionRow = document.getElementById('action-row');
    if (actionRow) actionRow.classList.remove('hidden');

    const matchScreen = document.getElementById('match-screen');
    if (matchScreen && indexh !== 0 && matchScreen.classList.contains('active')) {
        gsap.set(matchScreen, { opacity: 0 });
        matchScreen.classList.remove('active');
    }
}

function setupDemoSlides() {
    renderDemoProfile();
    setupDemoProfileCarousel();
    setupDemoChat();
    resetDemoProfileCarousel();
    resetDemoChat();
}

function createChip(text) {
    const chip = document.createElement('span');
    chip.className = 'demo-chip';
    chip.textContent = text;
    return chip;
}

function renderDemoProfile() {
    const photo = document.getElementById('demo-profile-photo');
    if (photo) {
        photo.addEventListener('error', () => {
            photo.src = '/images/wingman-demo-persona.svg';
        }, { once: true });
    }

    const name = document.getElementById('demo-tinder-name');
    const age = document.getElementById('demo-tinder-age');
    const promptList = document.getElementById('demo-profile-prompts');
    const interestList = document.getElementById('demo-profile-interests');
    const labelList = document.getElementById('demo-profile-labels');
    const tone = document.getElementById('demo-input-tone');
    const avoidTopics = document.getElementById('demo-avoid-topics');
    const matchName = document.getElementById('demo-chat-match-name');

    if (name) name.textContent = demoProfile.name;
    if (age) age.textContent = demoProfile.age;
    if (tone) tone.textContent = demoUserPrefs.tone;
    if (matchName) matchName.textContent = demoProfile.name;

    if (promptList) {
        promptList.innerHTML = '';
        demoProfile.prompts.forEach((prompt) => {
            const li = document.createElement('li');
            li.textContent = prompt;
            promptList.appendChild(li);
        });
    }

    if (interestList) {
        interestList.innerHTML = '';
        demoProfile.interests.forEach((interest) => {
            interestList.appendChild(createChip(interest));
        });
    }

    if (labelList) {
        labelList.innerHTML = '';
        demoProfile.photoCaptionLabels.forEach((label) => {
            labelList.appendChild(createChip(label));
        });
    }

    if (avoidTopics) {
        avoidTopics.innerHTML = '';
        demoUserPrefs.avoidTopics.forEach((topic) => {
            avoidTopics.appendChild(createChip(topic));
        });
    }
}

function getProfileScreens() {
    return Array.isArray(demoProfile.profileScreens) && demoProfile.profileScreens.length > 0
        ? demoProfile.profileScreens
        : [
            {
                id: 'fallback',
                meta: 'Looking for',
                body: demoProfile.bio,
                highlight: demoProfile.lookingFor,
                bullets: demoProfile.profileFacts
            }
        ];
}

function resetDemoProfileCarousel() {
    goToDemoProfileScreen(0, false);
}

function setupDemoProfileCarousel() {
    const carousel = document.getElementById('demo-profile-carousel');
    const photo = document.getElementById('demo-profile-photo');
    if (!carousel || !photo) return;
    if (carousel.dataset.bound === 'true') return;
    carousel.dataset.bound = 'true';

    carousel.querySelector('.tinder-photo-nav.prev')?.addEventListener('click', () => {
        goToDemoProfileScreen(demoProfileView.currentScreen - 1);
    });

    carousel.querySelector('.tinder-photo-nav.next')?.addEventListener('click', () => {
        goToDemoProfileScreen(demoProfileView.currentScreen + 1);
    });

    carousel.querySelectorAll('[data-profile-screen]').forEach((segment) => {
        segment.addEventListener('click', () => {
            const target = Number(segment.dataset.profileScreen);
            if (Number.isFinite(target)) goToDemoProfileScreen(target);
        });
    });

    carousel.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) return;
        demoProfileView.dragging = true;
        demoProfileView.dragStartX = event.clientX;
        demoProfileView.dragCurrentX = 0;
        carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener('pointermove', (event) => {
        if (!demoProfileView.dragging) return;
        demoProfileView.dragCurrentX = event.clientX - demoProfileView.dragStartX;
        gsap.set(photo, { x: demoProfileView.dragCurrentX * 0.12 });
    });

    const endDrag = (event) => {
        if (!demoProfileView.dragging) return;
        demoProfileView.dragging = false;
        if (event.pointerId !== undefined) carousel.releasePointerCapture(event.pointerId);

        const delta = demoProfileView.dragCurrentX;
        demoProfileView.dragCurrentX = 0;
        gsap.to(photo, { x: 0, duration: 0.24, ease: 'power2.out' });

        if (delta > 48) goToDemoProfileScreen(demoProfileView.currentScreen - 1);
        if (delta < -48) goToDemoProfileScreen(demoProfileView.currentScreen + 1);
    };

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
}

function goToDemoProfileScreen(targetIndex, animate = true) {
    const screens = getProfileScreens();
    if (!screens.length) return;

    const normalized = (targetIndex + screens.length) % screens.length;
    demoProfileView.currentScreen = normalized;
    const screen = screens[normalized];

    const photo = document.getElementById('demo-profile-photo');
    const meta = document.getElementById('demo-tinder-screen-meta');
    const body = document.getElementById('demo-tinder-screen-body');
    const highlight = document.getElementById('demo-tinder-screen-highlight');
    const bullets = document.getElementById('demo-tinder-screen-bullets');
    const badge = document.getElementById('demo-tinder-screen-badge');
    const anthem = document.getElementById('demo-tinder-anthem');
    const trackTitle = document.getElementById('demo-tinder-track-title');
    const trackArtist = document.getElementById('demo-tinder-track-artist');

    if (photo && screen.photoPosition) {
        photo.style.objectPosition = screen.photoPosition;
        if (animate) {
            gsap.fromTo(photo, { opacity: 0.84, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' });
        }
    }

    if (meta) {
        meta.textContent = screen.meta || '';
        meta.style.display = screen.meta ? 'flex' : 'none';
        meta.hidden = !screen.meta;
    }

    if (body) {
        const bodyText = screen.body || '';
        body.textContent = bodyText;
        body.style.display = bodyText ? 'block' : 'none';
        body.hidden = !bodyText;
    }

    if (highlight) {
        const highlightText = screen.highlight || '';
        highlight.textContent = highlightText;
        highlight.style.display = highlightText ? 'inline-flex' : 'none';
        highlight.hidden = !highlightText;
    }

    if (bullets) {
        const listItems = Array.isArray(screen.bullets) && screen.bullets.length ? screen.bullets : [];
        bullets.innerHTML = '';
        listItems.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            bullets.appendChild(li);
        });
        bullets.style.display = listItems.length === 0 ? 'none' : 'flex';
        bullets.hidden = listItems.length === 0;
    }

    if (badge) {
        const badgeText = screen.badge || '';
        badge.textContent = badgeText;
        badge.style.display = badgeText ? 'inline-block' : 'none';
        badge.hidden = !badgeText;
    }

    if (anthem && trackTitle && trackArtist) {
        const hasTrack = Boolean(screen.trackTitle);
        anthem.style.display = hasTrack ? 'block' : 'none';
        anthem.hidden = !hasTrack;
        trackTitle.textContent = hasTrack ? screen.trackTitle : '';
        trackArtist.textContent = hasTrack ? screen.trackArtist || '' : '';
    }

    const slide11 = document.querySelector('section[data-state="slide-12"]');
    slide11?.querySelectorAll('[data-profile-screen]').forEach((segment) => {
        segment.classList.toggle('active', Number(segment.dataset.profileScreen) === normalized);
    });
}

function setupDemoChat() {
    demoElements.thread = document.getElementById('demo-chat-thread');
    demoElements.suggestions = document.getElementById('demo-suggestions');
    demoElements.draftInput = document.getElementById('demo-draft-input');
    demoElements.sendButton = document.getElementById('demo-send-btn');
    demoElements.regenerateButton = document.getElementById('demo-regenerate-btn');
    demoElements.toneButtons = document.querySelectorAll('.demo-tone-btn');

    if (!demoElements.thread || !demoElements.suggestions || !demoElements.draftInput || !demoElements.sendButton) return;
    if (demoElements.suggestions.dataset.bound === 'true') return;
    demoElements.suggestions.dataset.bound = 'true';

    demoElements.suggestions.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-suggestion-id]');
        if (!button) return;

        if (demoChat.tone === 'raunchy') {
            const modal = document.getElementById('paywall-modal');
            if (modal) modal.classList.remove('hidden');
            return;
        }

        const suggestion = demoChat.suggestions.find((entry) => entry.id === button.dataset.suggestionId);
        if (!suggestion) return;

        demoChat.state = createChatState(initialDemoMessages);
        demoChat.state = applySuggestionToDraft(demoChat.state, suggestion);
        renderDemoThread();
        renderDemoSuggestions();
        renderDraftComposer();
    });

    demoElements.draftInput.addEventListener('input', (event) => {
        demoChat.state = updateChatDraft(demoChat.state, event.target.value);
        renderDraftComposer();
    });

    demoElements.draftInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendCurrentDraft();
        }
    });

    demoElements.sendButton.addEventListener('click', sendCurrentDraft);
    if (demoElements.toneButtons) {
        demoElements.toneButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                demoChat.tone = btn.dataset.tone;
                demoChat.seedOffset = 0;
                demoChat.state = {
                    ...demoChat.state,
                    selectedSuggestionId: null
                };
                demoChat.suggestions = getDeterministicSuggestions(demoProfile, demoChat.tone, getCurrentSuggestionSeed(), 3);
                renderDemoSuggestions();
                renderDraftComposer();
            });
        });
    }

    if (demoElements.regenerateButton) {
        demoElements.regenerateButton.addEventListener('click', () => {
            demoChat.seedOffset += 1;
            demoChat.state = {
                ...demoChat.state,
                selectedSuggestionId: null
            };
            demoChat.suggestions = getDeterministicSuggestions(demoProfile, demoChat.tone, getCurrentSuggestionSeed(), 3);
            renderDemoSuggestions();
            renderDraftComposer();
        });
    }

    const paywallModal = document.getElementById('paywall-modal');
    document.getElementById('paywall-close-btn')?.addEventListener('click', () => {
        if (paywallModal) paywallModal.classList.add('hidden');
    });
    document.getElementById('paywall-cancel-btn')?.addEventListener('click', () => {
        if (paywallModal) paywallModal.classList.add('hidden');
    });
    paywallModal?.addEventListener('click', (event) => {
        if (event.target === paywallModal) paywallModal.classList.add('hidden');
    });
}

function sendCurrentDraft() {
    const previousCount = demoChat.state.messages.length;
    demoChat.state = sendDraftMessage(demoChat.state);

    if (demoChat.state.messages.length > previousCount) {
        renderDemoThread();
        renderDraftComposer();
        if (demoElements.thread) demoElements.thread.scrollTop = demoElements.thread.scrollHeight;

        // Auto-reply simulation
        setTimeout(() => {
            demoChat.state = {
                ...demoChat.state,
                messages: [
                    ...demoChat.state.messages,
                    {
                        id: `msg-${demoChat.state.messages.length + 1}`,
                        author: 'match',
                        text: "What's your number?"
                    }
                ]
            };
            renderDemoThread();
            if (demoElements.thread) demoElements.thread.scrollTop = demoElements.thread.scrollHeight;
        }, 1500);
    } else {
        renderDraftComposer();
    }
}

function resetDemoChat() {
    demoChat.seedOffset = 0;
    demoChat.state = createChatState(initialDemoMessages);
    demoChat.suggestions = getDeterministicSuggestions(demoProfile, demoChat.tone, getCurrentSuggestionSeed(), 3);
    renderDemoThread();
    renderDemoSuggestions();
    renderDraftComposer();
}

function renderDemoThread() {
    if (!demoElements.thread) return;
    demoElements.thread.innerHTML = '';

    demoChat.state.messages.forEach((message) => {
        const bubble = document.createElement('div');
        bubble.className = `demo-message ${message.author === 'you' ? 'outgoing' : 'incoming'}`;
        bubble.textContent = message.text;
        demoElements.thread.appendChild(bubble);
    });
}

function renderDemoSuggestions() {
    if (!demoElements.suggestions) return;
    demoElements.suggestions.innerHTML = '';

    demoChat.suggestions.forEach((suggestion) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'demo-suggestion';
        if (demoChat.state.selectedSuggestionId === suggestion.id) button.classList.add('active');
        button.dataset.suggestionId = suggestion.id;

        const text = document.createElement('span');
        text.className = 'demo-suggestion-text';
        if (demoChat.tone === 'raunchy') text.classList.add('paywall-blurred');
        text.textContent = suggestion.text;

        button.appendChild(text);

        if (demoChat.tone === 'raunchy') {
            const lockIcon = document.createElement('div');
            lockIcon.className = 'paywall-lock-overlay';
            lockIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
            button.appendChild(lockIcon);
        }

        demoElements.suggestions.appendChild(button);
    });
}

function renderDraftComposer() {
    if (!demoElements.draftInput || !demoElements.sendButton) return;
    demoElements.draftInput.value = demoChat.state.draft;
    demoElements.sendButton.disabled = demoChat.state.draft.trim().length === 0;

    if (demoElements.toneButtons) {
        demoElements.toneButtons.forEach((btn) => {
            if (btn.dataset.tone === demoChat.tone) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}
