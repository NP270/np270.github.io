function getRandomParticles() {
    const isMobile = window.innerWidth <= 768;
    const maxParticles = isMobile ? 150 : 160;
    const minParticles = 90;
    
    return Math.floor(Math.random() * (maxParticles - minParticles + 1)) + minParticles;
}


function getRandomPushParticles() {
    return Math.floor(Math.random() * (8 - 4 + 1)) + 4;
}

// Initialize particlesJS
particlesJS("particles-js", {
    particles: {
        number: { value: getRandomParticles() },
        color: { value: "#ffffff" },
        shape: { type: "star" },
        size: { value: 3, random: true }, 
        opacity: { value: 1, random: true, anim: { enable: true, speed: 1 } },
        size: { value: 3.5, random: true, anim: { enable: false } },
        line_linked: { enable: false },
        move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: { enable: true, mode: "bubble" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            bubble: { distance: 175, size: 0.5, opacity: 0.4, duration: 2 },
            push: { particles_nb: getRandomPushParticles() }
        }
    },
    retina_detect: true
});
