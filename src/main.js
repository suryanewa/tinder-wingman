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

const demoElements = {
    thread: null,
    suggestions: null,
    draftInput: null,
    sendButton: null,
    regenerateButton: null,
    toneLabel: null
};

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
    } else if (state === 'slide-3') {
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
    } else if (state === 'slide-4') {
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
    } else if (state === 'slide-5') {
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
    } else if (state === 'slide-6') {
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
    } else if (state === 'slide-7') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });
        gsap.fromTo(`${slideSel} .flow-node`, { scale: 0 }, { scale: 1, duration: 0.8, stagger: 0.3, ease: 'back.out(1.5)', delay: 0.6 });
        gsap.fromTo(`${slideSel} .flow-text`, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1.2 });
        gsap.fromTo(`${slideSel} .flow-path`, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
    } else if (state === 'slide-8') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });

        // 1. Lines shoot out
        gsap.fromTo(`${slideSel} .nexus-line`,
            { strokeDashoffset: 400 },
            { strokeDashoffset: 0, duration: 1, stagger: 0.15, delay: 0.5, ease: 'power2.out' }
        );

        // 2. Nodes pop in
        gsap.fromTo(`${slideSel} .nexus-node`,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'back.out(1.5)', delay: 1 }
        );

        // 3. Continuous floating effect
        gsap.to(`${slideSel} .nexus-node`, {
            y: (i) => i % 2 === 0 ? 10 : -10,
            duration: (i) => 2 + i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.5
        });
    } else if (state === 'slide-9') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });

        gsap.fromTo(`${slideSel} .alert-svg`, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.6 });
        gsap.to(`${slideSel} .alert-svg path, ${slideSel} .alert-svg line`, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', delay: 0.6, stagger: 0.2 });

        gsap.fromTo(`${slideSel} .risk-layout .glass-container`, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.8 });
        gsap.to(`${slideSel} .heartbeat-bg`, { scale: 1.1, opacity: 0.8, duration: 0.8, yoyo: true, repeat: -1, ease: 'power1.inOut', delay: 1 });
        gsap.fromTo(`${slideSel} .risk-card`, { x: 30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.2, duration: 0.6, delay: 1 });
    } else if (state === 'slide-10') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });
        gsap.fromTo(`${slideSel} .gold-card`, { y: 100, opacity: 0, rotationY: -30 }, { y: 0, opacity: 1, rotationY: 0, duration: 1, ease: 'power3.out', delay: 0.8 });
        gsap.to(`${slideSel} .glare`, { x: '400%', duration: 1.5, delay: 2, ease: 'power1.inOut', repeat: -1, repeatDelay: 3 });
    } else if (state === 'slide-11') {
        gsap.fromTo(`${slideSel} .demo-profile-card`, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(`${slideSel} .demo-inputs-card`, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.4 });
        gsap.fromTo(`${slideSel} .demo-chip`, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.55 });
    } else if (state === 'slide-12') {
        gsap.fromTo(`${slideSel} .demo-phone-shell`, { x: -35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(`${slideSel} .demo-suggestion-panel`, { x: 35, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.35 });
        gsap.fromTo(`${slideSel} .demo-suggestion`, { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, delay: 0.45 });
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
        if (event.indexh === 11) resetDemoChat();
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
    if (actionRow) actionRow.classList.toggle('hidden', indexh !== 0);

    const matchScreen = document.getElementById('match-screen');
    if (matchScreen && indexh !== 0 && matchScreen.classList.contains('active')) {
        gsap.set(matchScreen, { opacity: 0 });
        matchScreen.classList.remove('active');
    }
}

function setupDemoSlides() {
    renderDemoProfile();
    setupDemoChat();
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

    const name = document.getElementById('demo-profile-name');
    const meta = document.getElementById('demo-profile-meta');
    const bio = document.getElementById('demo-profile-bio');
    const promptList = document.getElementById('demo-profile-prompts');
    const interestList = document.getElementById('demo-profile-interests');
    const labelList = document.getElementById('demo-profile-labels');
    const tone = document.getElementById('demo-input-tone');
    const avoidTopics = document.getElementById('demo-avoid-topics');
    const matchName = document.getElementById('demo-chat-match-name');

    if (name) name.textContent = demoProfile.name;
    if (meta) meta.textContent = `${demoProfile.age} · ${demoProfile.city}`;
    if (bio) bio.textContent = demoProfile.bio;
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

function setupDemoChat() {
    demoElements.thread = document.getElementById('demo-chat-thread');
    demoElements.suggestions = document.getElementById('demo-suggestions');
    demoElements.draftInput = document.getElementById('demo-draft-input');
    demoElements.sendButton = document.getElementById('demo-send-btn');
    demoElements.regenerateButton = document.getElementById('demo-regenerate-btn');
    demoElements.toneLabel = document.getElementById('demo-tone-label');

    if (!demoElements.thread || !demoElements.suggestions || !demoElements.draftInput || !demoElements.sendButton || !demoElements.regenerateButton) return;

    demoElements.suggestions.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-suggestion-id]');
        if (!button) return;
        const suggestion = demoChat.suggestions.find((entry) => entry.id === button.dataset.suggestionId);
        if (!suggestion) return;

        demoChat.state = applySuggestionToDraft(demoChat.state, suggestion);
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

    demoElements.regenerateButton.addEventListener('click', () => {
        demoChat.seedOffset += 1;
        demoChat.state = {
            ...demoChat.state,
            selectedSuggestionId: null
        };
        demoChat.suggestions = getDeterministicSuggestions(demoProfile, demoChat.tone, demoSeed + demoChat.seedOffset, 3);
        renderDemoSuggestions();
        renderDraftComposer();
    });
}

function sendCurrentDraft() {
    const previousCount = demoChat.state.messages.length;
    demoChat.state = sendDraftMessage(demoChat.state);

    if (demoChat.state.messages.length > previousCount) {
        renderDemoThread();
        renderDraftComposer();
        if (demoElements.thread) demoElements.thread.scrollTop = demoElements.thread.scrollHeight;
    } else {
        renderDraftComposer();
    }
}

function resetDemoChat() {
    demoChat.seedOffset = 0;
    demoChat.state = createChatState(initialDemoMessages);
    demoChat.suggestions = getDeterministicSuggestions(demoProfile, demoChat.tone, demoSeed + demoChat.seedOffset, 3);
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
        text.textContent = suggestion.text;

        const why = document.createElement('span');
        why.className = 'demo-suggestion-why';
        why.textContent = suggestion.why;

        button.appendChild(text);
        button.appendChild(why);
        demoElements.suggestions.appendChild(button);
    });
}

function renderDraftComposer() {
    if (!demoElements.draftInput || !demoElements.sendButton) return;
    demoElements.draftInput.value = demoChat.state.draft;
    demoElements.sendButton.disabled = demoChat.state.draft.trim().length === 0;
    if (demoElements.toneLabel) demoElements.toneLabel.textContent = demoChat.tone;
}
