/* ============================================
   COMING SOON PAGE - INTERACTIVE ANIMATIONS
   ============================================ */

// ==========================================
// PARTICLE CANVAS ANIMATION
// ==========================================
class ParticleCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.animationId = null;

        this.resize();
        this.initParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                radius: Math.random() * 1.5 + 0.5,
                color: this.getRandomColor(),
                opacity: Math.random() * 0.5 + 0.1,
                attractToMouse: Math.random() > 0.7, // 30% of particles are attracted to mouse
            });
        }
    }

    getRandomColor() {
        const colors = ['#FD4E1A', '#FEB52C', '#ff6b35'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Mouse attraction logic
            if (particle.attractToMouse && this.mouseX && this.mouseY) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - distance / maxDistance) * 0.3;
                    particle.vx += Math.cos(angle) * force;
                    particle.vy += Math.sin(angle) * force;
                }
            }

            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply friction
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Draw particle
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw connection lines to nearby particles
            if (index % 3 === 0) {
                this.particles.forEach((otherParticle, otherIndex) => {
                    if (index !== otherIndex) {
                        const dx = particle.x - otherParticle.x;
                        const dy = particle.y - otherParticle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 150) {
                            this.ctx.strokeStyle = particle.color;
                            this.ctx.globalAlpha = (1 - distance / 150) * 0.1;
                            this.ctx.lineWidth = 0.5;
                            this.ctx.beginPath();
                            this.ctx.moveTo(particle.x, particle.y);
                            this.ctx.lineTo(otherParticle.x, otherParticle.y);
                            this.ctx.stroke();
                        }
                    }
                });
            }
        });

        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
    }
}

// ==========================================
// COUNTDOWN TIMER
// ==========================================
class CountdownTimer {
    constructor(launchDate) {
        this.launchDate = new Date(launchDate).getTime();
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');

        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.launchDate - now;

        if (distance < 0) {
            this.complete();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.updateElement(this.daysElement, days);
        this.updateElement(this.hoursElement, hours);
        this.updateElement(this.minutesElement, minutes);
        this.updateElement(this.secondsElement, seconds);
    }

    updateElement(element, value) {
        const formattedValue = String(value).padStart(2, '0');
        if (element.textContent !== formattedValue) {
            element.textContent = formattedValue;
            element.classList.add('tick');
            setTimeout(() => element.classList.remove('tick'), 300);
        }
    }

    complete() {
        clearInterval(this.interval);
        console.log('Countdown complete!');
    }

    destroy() {
        clearInterval(this.interval);
    }
}

// ==========================================
// EMAIL FORM HANDLER
// ==========================================
class EmailFormHandler {
    constructor(form) {
        this.form = form;
        this.input = form.querySelector('#emailInput');
        this.message = form.querySelector('#formMessage');
        this.submitButton = form.querySelector('.submit-button');

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.input.addEventListener('focus', () => this.clearMessage());
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const email = this.input.value.trim();

        // Clear previous message
        this.clearMessage();

        // Validate email
        if (!email) {
            this.showMessage('Please enter your email address', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Sending...';

        try {
            // Simulate API call (replace with actual endpoint if needed)
            await this.sendEmail(email);
            this.showMessage('✓ Thanks! We\'ll notify you when we launch.', 'success');
            this.input.value = '';
            this.input.blur();
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<span class="button-text">Notify Me</span><span class="button-glow"></span>';
        }
    }

    async sendEmail(email) {
        // If you have a backend endpoint, replace this with actual API call
        // Example:
        // const response = await fetch('/api/subscribe', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        // if (!response.ok) throw new Error('Failed to subscribe');

        // For now, simulate a successful submission
        return new Promise((resolve) => {
            setTimeout(resolve, 800);
        });
    }

    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `form-message ${type}`;
    }

    clearMessage() {
        this.message.textContent = '';
        this.message.className = 'form-message';
    }
}

// ==========================================
// PARALLAX MOUSE MOVEMENT
// ==========================================
class MouseParallax {
    constructor(container) {
        this.container = container;
        this.elements = container.querySelectorAll('.floating-element');
        this.mouseX = 0;
        this.mouseY = 0;

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(e) {
        this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        this.elements.forEach((element, index) => {
            const strength = (index + 1) * 20;
            const x = this.mouseX * strength;
            const y = this.mouseY * strength;

            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ==========================================
// SMOOTH SCROLL & PAGE LOAD ANIMATIONS
// ==========================================
class PageAnimations {
    constructor() {
        this.setupScrollAnimations();
        this.observeElements();
    }

    setupScrollAnimations() {
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-animate]').forEach((el) => {
            observer.observe(el);
        });
    }
}

// ==========================================
// COUNTDOWN VALUE TICK ANIMATION
// ==========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes countdownTick {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    .countdown-value.tick {
        animation: countdownTick 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle canvas
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const particleCanvas = new ParticleCanvas(canvas);
    }

    // Initialize countdown timer
    // Set launch date to 90 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 90);
    const countdown = new CountdownTimer(launchDate.toISOString());

    // Initialize email form handler
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        new EmailFormHandler(emailForm);
    }

    // Initialize mouse parallax
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        new MouseParallax(heroSection);
    }

    // Initialize page animations
    new PageAnimations();

    // Log initialization
    console.log('%c🚀 Coming Soon Page Loaded', 'color: #00d9ff; font-size: 14px; font-weight: bold;');
    console.log('%cLaunch Date: ' + launchDate.toLocaleDateString(), 'color: #39ff14;');
});

// ==========================================
// CLEANUP ON PAGE UNLOAD
// ==========================================
window.addEventListener('beforeunload', () => {
    // Clean up animations and intervals if needed
    console.log('Cleaning up coming soon page');
});

// ==========================================
// MOBILE TOUCH OPTIMIZATION
// ==========================================
document.addEventListener('touchmove', (e) => {
    // Smooth touch scrolling
    e.preventDefault();
    window.scrollBy(0, e.touches[0].clientY - e.touches[0].clientY);
}, { passive: true });
