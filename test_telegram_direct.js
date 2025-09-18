const fetch = require('node-fetch');

console.log('🧪 TEST DIRECT DE L\'API TELEGRAM');
console.log('=================================');

const TELEGRAM_BOT_TOKEN = '8045865062:AAFoDtE5f3w3RNmaGh3-n2X7Lbzpo0ShXSU';
const TELEGRAM_CHAT_ID = '6523794278';

async function testTelegramAPI() {
    try {
        console.log('📡 Récupération des messages depuis Telegram...');
        
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=5`);
        const data = await response.json();
        
        if (data.ok && data.result && data.result.length > 0) {
            console.log(`📨 ${data.result.length} messages trouvés`);
            
            // Chercher les messages de paiement
            const paymentMessages = data.result.filter(update => {
                if (update.message && update.message.text) {
                    const text = update.message.text.toLowerCase();
                    return text.includes('nouveau paiement') || 
                           text.includes('paiement reçu') || 
                           text.includes('montant:') || 
                           text.includes('carte:') ||
                           text.includes('vérifiez immédiatement') ||
                           text.includes('cacapay') ||
                           text.includes('€');
                }
                return false;
            });
            
            if (paymentMessages.length > 0) {
                console.log(`💰 ${paymentMessages.length} messages de paiement détectés !`);
                
                paymentMessages.forEach((update, index) => {
                    console.log(`\n📋 Message ${index + 1}:`);
                    console.log(`   ID: ${update.message.message_id}`);
                    console.log(`   Heure: ${new Date(update.message.date * 1000).toLocaleString()}`);
                    console.log(`   Contenu: ${update.message.text.substring(0, 100)}...`);
                });
                
                console.log('\n✅ L\'interface desktop devrait détecter et copier ces messages !');
            } else {
                console.log('📭 Aucun message de paiement trouvé dans les derniers messages');
            }
        } else {
            console.log('📭 Aucun message trouvé');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des messages:', error);
    }
}

// Exécuter le test
testTelegramAPI();
