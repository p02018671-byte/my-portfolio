// Enhanced Particle System for High-Tech Background
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.particleCount = 120;
        this.connectionDistance = 150;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.init());
        
        // Track mouse movement for interactive effects
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        
        // Create enhanced particles with more properties
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                opacity: Math.random() * 0.6 + 0.2,
                hue: Math.random() * 60 + 160, // Cyan to purple range
                pulseSpeed: Math.random() * 0.03 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                orbitRadius: Math.random() * 50 + 20,
                orbitSpeed: Math.random() * 0.02 + 0.01,
                orbitPhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        // Create trailing effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Enhanced movement with orbital motion
            particle.orbitPhase += particle.orbitSpeed;
            const orbitX = Math.cos(particle.orbitPhase) * particle.orbitRadius * 0.1;
            const orbitY = Math.sin(particle.orbitPhase) * particle.orbitRadius * 0.1;
            
            particle.x += particle.speedX + orbitX;
            particle.y += particle.speedY + orbitY;
            
            // Mouse interaction - particles are attracted to mouse
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const force = (200 - distance) / 200;
                particle.x += (dx / distance) * force * 0.5;
                particle.y += (dy / distance) * force * 0.5;
            }
            
            // Wrap around edges
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.canvas.height + 50;
            if (particle.y > this.canvas.height + 50) particle.y = -50;
            
            // Enhanced pulse effect
            particle.pulsePhase += particle.pulseSpeed;
            const pulseFactor = Math.sin(particle.pulsePhase) * 0.4 + 0.8;
            
            // Draw particle with glow effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * pulseFactor * 3
            );
            gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity * pulseFactor})`);
            gradient.addColorStop(0.5, `hsla(${particle.hue}, 100%, 50%, ${particle.opacity * pulseFactor * 0.5})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 30%, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * pulseFactor * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Draw core particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${particle.opacity * pulseFactor})`;
            this.ctx.fill();
            
            // Draw enhanced connections between nearby particles
            this.particles.slice(index + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) + 
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.4;
                    
                    // Create gradient for connections
                    const connectionGradient = this.ctx.createLinearGradient(
                        particle.x, particle.y,
                        otherParticle.x, otherParticle.y
                    );
                    connectionGradient.addColorStop(0, `hsla(${particle.hue}, 100%, 50%, ${opacity * pulseFactor})`);
                    connectionGradient.addColorStop(0.5, `hsla(${(particle.hue + otherParticle.hue) / 2}, 100%, 60%, ${opacity * pulseFactor})`);
                    connectionGradient.addColorStop(1, `hsla(${otherParticle.hue}, 100%, 50%, ${opacity * pulseFactor})`);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = connectionGradient;
                    this.ctx.lineWidth = 1.5 * pulseFactor;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system immediately
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem();
    });
} else {
    new ParticleSystem();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate skill bars when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add glow effect to navigation on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 255, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        typeWriter(nameElement, originalText, 80);
    }
});

// Add hover effect to social links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(5deg)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.btn {
    position: relative;
    overflow: hidden;
}
`;

// Inject ripple CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleCSS;
document.head.appendChild(styleSheet);

// Add floating animation to code block
function floatAnimation() {
    const codeBlock = document.querySelector('.code-block');
    if (codeBlock) {
        const time = Date.now() * 0.001;
        const floatY = Math.sin(time) * 10;
        const floatX = Math.cos(time * 0.7) * 5;
        codeBlock.style.transform = `translate(${floatX}px, ${floatY}px)`;
    }
    requestAnimationFrame(floatAnimation);
}

// Start floating animation
floatAnimation();

// Add cursor trail effect
let mouseX = 0;
let mouseY = 0;
let cursorTrail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail particle
    if (Math.random() > 0.9) {
        createTrailParticle(mouseX, mouseY);
    }
});

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'linear-gradient(45deg, #00ffff, #ff00ff)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.opacity = '1';
    particle.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(particle);
    
    // Animate and remove
    setTimeout(() => {
        particle.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0)`;
        particle.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Add intersection observer for fade-in animations
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.filter = 'blur(0px)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Apply fade-in to sections with enhanced effects
document.querySelectorAll('section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.filter = 'blur(2px)';
    section.style.transition = `all 1s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.2}s`;
    fadeObserver.observe(section);
});

// Add staggered fade-in for individual elements within sections
const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply fade-in to individual elements with stagger
document.querySelectorAll('.skill-category, .contact-item, .social-link, .hero-buttons .btn, .service-card').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    elementObserver.observe(element);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = document.querySelectorAll('section');
    const currentSection = Array.from(sections).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
    });
    
    let currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
});

// Add dynamic year to footer
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer p');
    if (footerText) {
        footerText.textContent = footerText.textContent.replace('2024', year);
    }
});
const toggleSwitch = document.querySelector('#checkbox');
toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('light-mode');
        document.querySelector('.icon').textContent = '☀️';
    } else {
        document.body.classList.remove('light-mode');
        document.querySelector('.icon').textContent = '🌙';
    }    
});