import './style.css';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import gsap from 'gsap';
import anime from 'animejs/lib/anime.es.js';

const deck = new Reveal({
    hash: true,
    controls: false,
    progress: false,
    center: false,
    transition: 'none',
    backgroundTransition: 'none',
    width: "100%",
    height: "100%",
    margin: 0,
    minScale: 1,
    maxScale: 1,
    keyboard: true,
});

deck.initialize().then(() => {
    setupCustomProgressBar();
    setupAnimations();
    setupDrag();

    // Trigger current slide animation on start
    setTimeout(() => {
        triggerSlideAnimation(deck.getState().indexh, 'next');
    }, 100);
});

function setupCustomProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const update = () => {
        const total = deck.getTotalSlides();
        const current = deck.getSlidePastCount() + 1;
        progressBar.style.width = `${(current / total) * 100}%`;
    };
    update();
    deck.on('slidechanged', update);
}

function triggerSlideAnimation(indexh, direction) {
    const state = `slide-${indexh + 1}`;
    const slideSel = `section[data-state="${state}"]`;
    const slideEl = document.querySelector(slideSel);

    if (!slideEl) return;

    // Kill previous tweens on this slide to prevent overlapping animations
    gsap.killTweensOf(`${slideSel} *`);

    // Base entry transition for the slide itself
    const fromX = direction === 'next' ? '100vw' : '-100vw';
    gsap.fromTo(slideEl,
        { x: fromX, opacity: 1 },
        { x: '0vw', duration: 0.8, ease: 'power3.out' }
    );

    // Custom internal animations per slide
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
    }
    else if (state === 'slide-2') {
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
    }
    else if (state === 'slide-3') {
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
        gsap.fromTo(`${slideSel} .conn-line`, { strokeDasharray: 400, strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 1, stagger: 0.3, delay: 1 });
    }
    else if (state === 'slide-4') {
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
                            tier.removeEventListener('mouseleave', null); // Clean up placeholder
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
                        // Infinite flowing animation
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
    }
    else if (state === 'slide-5') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.4 });
        gsap.fromTo(`${slideSel} .glow-metric`, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.6 });
        gsap.to(`${slideSel} .glow-metric`, { textShadow: '0 0 80px rgba(0,230,118,0.8)', duration: 1.5, yoyo: true, repeat: -1, delay: 1.6 });

        // Clock Animation
        gsap.fromTo(`${slideSel} #clock-svg`, { scale: 0, opacity: 0, rotate: -90 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'back.out(1.7)', delay: 0.8 });
        gsap.to(`${slideSel} #hour-hand`, { rotation: 360, duration: 12, repeat: -1, ease: "none" });
        gsap.to(`${slideSel} #minute-hand`, { rotation: 360, duration: 2, repeat: -1, ease: "none" });

        gsap.fromTo(`${slideSel} .inline-icon`, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, stagger: 0.4, ease: 'back.out(2)', delay: 0.6 });
        gsap.fromTo(`${slideSel} .body-text`, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.2 });
        gsap.fromTo(`${slideSel} .glass-container`, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.5 });
    }
    else if (state === 'slide-6') {
        gsap.fromTo(`${slideSel} .split-left`, { x: '-100%' }, { x: '0%', duration: 0.8, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo(`${slideSel} .split-right`, { x: '100%' }, { x: '0%', duration: 0.8, ease: 'power3.out', delay: 0.2 });
        gsap.fromTo([`${slideSel} .split-left h2`, `${slideSel} .split-right h2`], { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, delay: 0.8, duration: 0.6, stagger: 0.2 });
        gsap.fromTo([`${slideSel} .split-left p`, `${slideSel} .split-right p`], { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: 1.2, duration: 0.6, stagger: 0.1 });
    }
    else if (state === 'slide-7') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });
        gsap.fromTo(`${slideSel} .flow-node`, { scale: 0 }, { scale: 1, duration: 0.8, stagger: 0.3, ease: 'back.out(1.5)', delay: 0.6 });
        gsap.fromTo(`${slideSel} .flow-text`, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 1.2 });
        gsap.fromTo(`${slideSel} .flow-path`, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.5 });
    }
    else if (state === 'slide-8') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .grid-box`, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.6 });
        document.querySelectorAll(`${slideSel} .grid-box`).forEach(box => {
            box.addEventListener('mouseenter', () => anime({ targets: box, scale: 1.05, duration: 300, easing: 'easeOutExpo' }));
            box.addEventListener('mouseleave', () => anime({ targets: box, scale: 1, duration: 300, easing: 'easeOutExpo' }));
        });
    }
    else if (state === 'slide-9') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .alert-svg`, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.6 });
        gsap.fromTo(`${slideSel} .glass-container`, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.8 });
        gsap.to(`${slideSel} .heartbeat-bg`, { scale: 1.1, opacity: 0.8, duration: 0.8, yoyo: true, repeat: -1, ease: 'power1.inOut', delay: 1 });
        gsap.fromTo(`${slideSel} .risk-card`, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.6, delay: 1 });
    }
    else if (state === 'slide-10') {
        gsap.fromTo(`${slideSel} .section-title`, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
        gsap.fromTo(`${slideSel} .body-text`, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.5 });
        gsap.fromTo(`${slideSel} .gold-card`, { y: 100, opacity: 0, rotationY: -30 }, { y: 0, opacity: 1, rotationY: 0, duration: 1, ease: 'power3.out', delay: 0.8 });
        gsap.to(`${slideSel} .glare`, { x: '400%', duration: 1.5, delay: 2, ease: 'power1.inOut', repeat: -1, repeatDelay: 3 });
    }
}

function setupAnimations() {
    deck.on('slidechanged', (event) => {
        const isNext = event.indexh > (event.previousSlide?.dataset.indexh || -1); // approximate direction

        // Hide previous slide quickly if needed, or let reveal handle taking it out
        if (event.previousSlide) {
            gsap.set(event.previousSlide, { opacity: 0, x: isNext ? '-100vw' : '100vw' });
        }

        triggerSlideAnimation(event.indexh, isNext ? 'next' : 'prev');
    });

    // Button micro interactions
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => anime({ targets: btn, scale: 1.15, duration: 300, easing: 'easeOutElastic(1, .8)' }));
        btn.addEventListener('mouseleave', () => anime({ targets: btn, scale: 1, duration: 300, easing: 'easeOutElastic(1, .8)' }));
    });

    // Routing
    document.querySelector('.btn-nope')?.addEventListener('click', () => swipeOut('-100vw', -15, () => deck.prev()));
    document.querySelector('.btn-like')?.addEventListener('click', () => swipeOut('100vw', 15, () => deck.next()));
    document.querySelector('.btn-superlike')?.addEventListener('click', triggerMatchScreen);
}

function setupDrag() {
    let isDragging = false, startX = 0, currentX = 0;

    document.addEventListener('pointerdown', (e) => {
        // Only drag from section (full-screen slides)
        if (!e.target.closest('section')) return;
        if (e.target.closest('button') || e.target.closest('a')) return;
        isDragging = true;
        startX = e.clientX;
    });

    document.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
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
        else Math.abs(currentX) > 0 && gsap.to(slide, { x: 0, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.7)' });
        currentX = 0;
    }
}

function swipeOut(xOffset, rotation, callback) {
    const slide = deck.getCurrentSlide();
    if (!slide) return callback();
    gsap.to(slide, {
        x: xOffset, rotation: rotation, opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => {
            gsap.set(slide, { opacity: 1, rotation: 0 }); // reset for when we come back
            callback();
        }
    });
}

function triggerMatchScreen() {
    const ms = document.getElementById('match-screen');
    ms.classList.add('active');
    gsap.fromTo('.match-text', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.2 });
    gsap.fromTo('.match-subtext', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4 });
    gsap.fromTo('.match-btn', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.6 });

    document.querySelector('.match-btn').addEventListener('click', () => {
        gsap.to(ms, { opacity: 0, duration: 0.4, onComplete: () => ms.classList.remove('active') });
    }, { once: true });
}
