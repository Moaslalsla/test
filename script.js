// Configuration des particules d'arrière-plan
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Animation des statistiques
function animateStats() {
    const stats = [
        { id: 'totalUsers', target: 1247, prefix: '', suffix: '' },
        { id: 'totalOrders', target: 8932, prefix: '', suffix: '' },
        { id: 'totalVolume', target: 2.4, prefix: '€', suffix: 'M' }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        let current = 0;
        const increment = stat.target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
                current = stat.target;
                clearInterval(timer);
            }
            
            let displayValue;
            if (stat.id === 'totalVolume') {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current).toLocaleString();
            }
            
            element.textContent = `${stat.prefix}${displayValue}${stat.suffix}`;
        }, 50);
    });
}

// Lancer l'animation des stats quand la page est chargée
window.addEventListener('load', () => {
    setTimeout(animateStats, 1000);
});

// Gestion du formulaire
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    const resultDiv = document.getElementById('result');
    const submitBtn = this.querySelector('.btn-primary');
    const originalBtnContent = submitBtn.innerHTML;
    
    // Animation de chargement
    submitBtn.innerHTML = `
        <div class="loading"></div>
        <span>Traitement en cours...</span>
    `;
    submitBtn.disabled = true;
    
    resultDiv.innerHTML = `
        <div class="status pending">
            <i class="fas fa-spinner fa-spin"></i>
            Traitement de votre commande d'achat de ${data.crypto}...
        </div>
    `;
    
    // Simulation d'un délai de traitement
    setTimeout(() => {
        // Génération d'un ID de commande
        const orderId = generateOrderId();
        
        // Simulation de succès (90% de chance)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
            resultDiv.innerHTML = `
                <div class="status success">
                    <i class="fas fa-check-circle"></i>
                    <h3>✅ Commande créée avec succès !</h3>
                    <div style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                        <p><strong>ID de commande :</strong> ${orderId}</p>
                        <p><strong>Crypto :</strong> ${getCryptoFullName(data.crypto)}</p>
                        <p><strong>Montant :</strong> ${parseFloat(data.amount).toFixed(2)}€</p>
                        <p><strong>Stratégie :</strong> ${getStrategyName(data.strategy)}</p>
                        <p><strong>Email :</strong> ${data.email}</p>
                    </div>
                    <p><small><i class="fas fa-info-circle"></i> Ceci est une démo. Dans la version complète, l'ordre serait transmis à votre plateforme d'échange.</small></p>
                    <button onclick="trackOrder('${orderId}')" class="btn-secondary" style="margin-top: 15px; padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; cursor: pointer;">
                        <i class="fas fa-search"></i> Suivre la commande
                    </button>
                </div>
            `;
            
            // Effet confetti
            createConfetti();
            
        } else {
            resultDiv.innerHTML = `
                <div class="status error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>❌ Erreur lors du traitement</h3>
                    <p>Impossible de traiter votre commande pour le moment.</p>
                    <p><small>Code d'erreur: ERR_${Math.floor(Math.random() * 1000)}</small></p>
                    <button onclick="retryOrder()" class="btn-secondary" style="margin-top: 15px; padding: 10px 20px; background: rgba(255,107,107,0.3); border: none; border-radius: 8px; color: white; cursor: pointer;">
                        <i class="fas fa-redo"></i> Réessayer
                    </button>
                </div>
            `;
        }
        
        // Restaurer le bouton
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        
        // Scroll vers les résultats
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    }, 2000 + Math.random() * 1000); // Délai aléatoire entre 2-3 secondes
});

// Fonctions utilitaires
function generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'ORD-';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getCryptoFullName(crypto) {
    const names = {
        'BTC': 'Bitcoin (BTC)',
        'ETH': 'Ethereum (ETH)',
        'ADA': 'Cardano (ADA)',
        'DOT': 'Polkadot (DOT)',
        'SOL': 'Solana (SOL)',
        'MATIC': 'Polygon (MATIC)'
    };
    return names[crypto] || crypto;
}

function getStrategyName(strategy) {
    const names = {
        'instant': 'Achat instantané',
        'dca': 'DCA - Achat périodique',
        'limit': 'Ordre à cours limité',
        'stop': 'Stop-loss automatique'
    };
    return names[strategy] || strategy;
}

function trackOrder(orderId) {
    alert(`🔍 Suivi de la commande ${orderId}\n\nDans la version complète, vous seriez redirigé vers l'interface de suivi en temps réel.`);
}

function retryOrder() {
    document.getElementById('orderForm').dispatchEvent(new Event('submit'));
}

// Effet confetti
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = 'confettiFall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// CSS pour l'animation confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .btn-secondary:hover {
        background: rgba(255,255,255,0.3) !important;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Effet de parallaxe léger
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.header');
    const speed = 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// Animation au scroll pour les éléments
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observer tous les éléments avec la classe .feature-card
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.feature-card, .stat-card');
    elements.forEach(el => observer.observe(el));
});

console.log('🚀 Acheteur Crypto Automatisé - Interface chargée avec succès!');
