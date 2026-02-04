/* =====================================================
   SNACKANARCHY - ANIMATION ENGINE
   Animations et effets pour le site 2D
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initClientSpawner();
    initParallax();
    initChefAnimations();
    initScrollEffects();
    initInteractions();
});

/* =====================================================
   SPAWN DE CLIENTS QUI MARCHENT
   ===================================================== */

const clientSprites = [
    'assets/client.png',
    'assets/client1.png',
    'assets/client2.png'
];

function initClientSpawner() {
    const container = document.getElementById('clients');
    if (!container) return;
    
    // Spawn initial de clients
    for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnClient(container), i * 2000);
    }
    
    // Spawn continu
    setInterval(() => {
        if (document.querySelectorAll('.walking-client').length < 8) {
            spawnClient(container);
        }
    }, 3000);
}

function spawnClient(container) {
    const client = document.createElement('img');
    client.className = 'walking-client';
    client.src = clientSprites[Math.floor(Math.random() * clientSprites.length)];
    
    // Direction aléatoire
    const goingRight = Math.random() > 0.5;
    const speed = 10 + Math.random() * 10; // 10-20 secondes
    const yOffset = Math.random() * 40 - 20; // Variation verticale
    
    client.style.bottom = `${20 + yOffset}px`;
    client.style.animationDuration = `${speed}s`;
    client.style.zIndex = Math.floor(10 + yOffset);
    
    if (!goingRight) {
        client.style.transform = 'scaleX(-1)';
        client.style.animationName = 'walk-left';
    }
    
    container.appendChild(client);
    
    // Supprimer après l'animation
    setTimeout(() => {
        client.remove();
    }, speed * 1000);
}

// Ajouter l'animation walk-left
const style = document.createElement('style');
style.textContent = `
    @keyframes walk-left {
        from { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
        to { transform: translateX(-100px) scaleX(-1); }
    }
`;
document.head.appendChild(style);

/* =====================================================
   EFFET PARALLAX
   ===================================================== */

function initParallax() {
    const sky = document.querySelector('.sky');
    const buildings = document.querySelector('.background-buildings');
    const mainScene = document.querySelector('.main-scene');
    const title = document.querySelector('.floating-title');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        
        // Parallax layers
        if (sky) sky.style.transform = `translateY(${scrollY * 0.1}px)`;
        if (buildings) buildings.style.transform = `translateY(${scrollY * 0.2}px)`;
        if (mainScene) mainScene.style.transform = `translateY(${scrollY * 0.4}px)`;
        
        // Fade out title
        if (title) {
            const opacity = Math.max(0, 1 - scrollY / (vh * 0.5));
            title.style.opacity = opacity;
        }
    });
}

/* =====================================================
   ANIMATIONS DES CHEFS
   ===================================================== */

function initChefAnimations() {
    const chef1 = document.getElementById('chef1');
    const chef2 = document.getElementById('chef2');
    
    // Mouvement aléatoire des chefs
    if (chef1) {
        setInterval(() => {
            const xOffset = (Math.random() - 0.5) * 30;
            chef1.style.transform = `translateX(${xOffset}px)`;
        }, 2000);
    }
    
    if (chef2) {
        setInterval(() => {
            const xOffset = (Math.random() - 0.5) * 30;
            chef2.style.transform = `translateX(${xOffset}px)`;
        }, 2500);
    }
    
    // Changement de sprite (flip) occasionnel
    document.querySelectorAll('.chef-sprite').forEach(sprite => {
        setInterval(() => {
            if (Math.random() > 0.7) {
                sprite.style.transform = sprite.style.transform === 'scaleX(-1)' ? 'scaleX(1)' : 'scaleX(-1)';
            }
        }, 3000);
    });
}

/* =====================================================
   EFFETS AU SCROLL
   ===================================================== */

function initScrollEffects() {
    // Observer pour animations à l'entrée
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // Observer les éléments
    document.querySelectorAll('.feature-card, .mechanic, .gallery-item, .download-box').forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });
    
    // Ajouter les styles d'animation
    const animStyles = document.createElement('style');
    animStyles.textContent = `
        .animate-target {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .animate-target.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        .feature-card.animate-target { transition-delay: 0.1s; }
        .feature-card:nth-child(2).animate-target { transition-delay: 0.2s; }
        .feature-card:nth-child(3).animate-target { transition-delay: 0.3s; }
        .mechanic:nth-child(1).animate-target { transition-delay: 0.1s; }
        .mechanic:nth-child(2).animate-target { transition-delay: 0.2s; }
        .mechanic:nth-child(3).animate-target { transition-delay: 0.3s; }
        .mechanic:nth-child(4).animate-target { transition-delay: 0.4s; }
    `;
    document.head.appendChild(animStyles);
}

/* =====================================================
   INTERACTIONS
   ===================================================== */

function initInteractions() {
    // Effet hover sur les façades
    document.querySelectorAll('.restaurant').forEach(resto => {
        resto.addEventListener('mouseenter', () => {
            resto.querySelector('.chef')?.classList.add('excited');
        });
        resto.addEventListener('mouseleave', () => {
            resto.querySelector('.chef')?.classList.remove('excited');
        });
    });
    
    // Style pour l'excitation
    const excitedStyle = document.createElement('style');
    excitedStyle.textContent = `
        .chef.excited {
            animation: chef-excited 0.3s ease-in-out infinite !important;
        }
        @keyframes chef-excited {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
        }
    `;
    document.head.appendChild(excitedStyle);
    
    // Copier le code terminal au clic
    document.querySelectorAll('.terminal-body').forEach(terminal => {
        terminal.style.cursor = 'pointer';
        terminal.title = 'Cliquer pour copier';
        
        terminal.addEventListener('click', async () => {
            const code = Array.from(terminal.querySelectorAll('code'))
                .map(c => c.textContent.replace(/^\$\s*/, ''))
                .join('\n');
            
            try {
                await navigator.clipboard.writeText(code);
                showNotification('Code copié !');
            } catch (err) {
                console.log('Erreur copie');
            }
        });
    });
    
    // Boutons avec effet son (simulé)
    document.querySelectorAll('.btn-download, .play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Redirection...');
        });
    });
}

/* =====================================================
   NOTIFICATIONS
   ===================================================== */

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(90deg, #FF6B35, #4A90D9);
        color: white;
        padding: 15px 30px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7rem;
        border: 4px solid white;
        z-index: 10000;
        animation: notif-in 0.3s ease;
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'notif-out 0.3s ease forwards';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}

// Animations notification
const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes notif-in {
        from { transform: translateX(-50%) translateY(100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes notif-out {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

/* =====================================================
   EASTER EGG - Konami Code
   ===================================================== */

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateAnarchy();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateAnarchy() {
    document.body.style.animation = 'rainbow 0.5s linear infinite';
    showNotification('🔥 MODE ANARCHIE ACTIVÉ 🔥');
    
    // Spawn massif de clients
    const container = document.getElementById('clients');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => spawnClient(container), i * 100);
    }
    
    setTimeout(() => {
        document.body.style.animation = 'none';
    }, 5000);
}

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

/* =====================================================
   CONSOLE BRANDING
   ===================================================== */

console.log('%c🌮 SNACKANARCHY 🥙', 'font-size: 2rem; font-weight: bold; color: #FF6B35; text-shadow: 2px 2px 0 #4A90D9;');
console.log('%cLe chaos culinaire vous attend...', 'font-size: 1rem; color: #FFD700;');
console.log('%cTape le Konami Code pour un easter egg !', 'font-size: 0.8rem; color: #888;');
