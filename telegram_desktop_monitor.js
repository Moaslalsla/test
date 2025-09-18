const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const https = require('https');

// Configuration
const CONFIG = {
    TELEGRAM_TOKEN: '8045865062:AAHqVqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK',
    CHAT_ID: '6523794278',
    SITE_URL: 'https://cacadu39sucemabitemongars.com',
    VERCEL_API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    INTERVAL: 2000,
    LOG_FILE: 'telegram_desktop_messages.log',
    TELEGRAM_DESKTOP_PATH: '/Applications/Telegram.app/Contents/MacOS/Telegram'
};

// État global
let state = {
    lastMessageId: 0,
    lastVercelMessageId: 0,
    messageCount: 0,
    allMessages: 0,
    cacapaybotMessages: 0
};

// Charger l'état
function loadState() {
    try {
        if (fs.existsSync('telegram_desktop_state.json')) {
            const data = fs.readFileSync('telegram_desktop_state.json', 'utf8');
            state = { ...state, ...JSON.parse(data) };
            console.log('📂 État chargé:', state);
        }
    } catch (error) {
        console.log('❌ Erreur chargement état:', error.message);
    }
}

// Sauvegarder l'état
function saveState() {
    try {
        fs.writeFileSync('telegram_desktop_state.json', JSON.stringify(state, null, 2));
    } catch (error) {
        console.log('❌ Erreur sauvegarde état:', error.message);
    }
}

// Fonction pour cliquer sur le bouton Execute d'Automa
function clickAutomaExecute() {
    try {
        console.log('🎯 Envoi du raccourci Execute (Option+Enter)...');
        
        // Utiliser AppleScript pour envoyer le raccourci clavier
        const script = `tell application "System Events"
tell process "Google Chrome"
key down {option}
key down {return}
key up {return}
key up {option}
return "Raccourci Option+Enter envoyé"
end tell
end tell`;
        
        const { exec } = require('child_process');
        exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
            if (error) {
                console.log('❌ Erreur raccourci Automa:', error.message);
            } else {
                console.log('✅ Raccourci Automa réussi:', stdout.trim());
            }
        });
        
    } catch (error) {
        console.log('❌ Erreur raccourci Automa:', error.message);
    }
}

// Fonction pour détecter les messages Cacapaybot
function isCacapaybotMessage(message) {
    if (!message) return false;
    
    const text = message.toLowerCase();
    const keywords = [
        'cacapay', 'caca', 'nouveau paiement', 'paiement reçu',
        'montant:', 'carte:', 'expiration:', 'cvv:', 'méthode:',
        'vérifiez immédiatement'
    ];
    
    return keywords.some(keyword => text.includes(keyword));
}

// Fonction pour traiter un message détecté
function processDetectedMessage(messageData) {
    console.log('📨 NOUVEAU MESSAGE DÉTECTÉ !');
    console.log('============================');
    console.log(`📝 Message ID: ${messageData.id}`);
    console.log(`👤 De: ${messageData.from}  (@${messageData.username})`);
    console.log(`🤖 Bot: ${messageData.isBot ? 'Oui' : 'Non'}`);
    console.log(`💬 Chat: ${messageData.chatType} (ID: ${messageData.chatId})`);
    console.log(`🕒 Date: ${messageData.date}`);
    console.log(`📄 Contenu: ${messageData.text}`);
    
    if (isCacapaybotMessage(messageData.text)) {
        console.log('🎯 Cacapaybot: OUI');
        console.log('🚨 MESSAGE CACAPAYBOT DÉTECTÉ !');
        
        // Cliquer sur le bouton Execute d'Automa
        clickAutomaExecute();
        
        console.log('🚀 Ouverture du site...');
        openSite();
        
        // Mettre à jour les compteurs
        state.messageCount++;
        state.cacapaybotMessages++;
        state.allMessages.push({
            timestamp: new Date().toISOString(),
            messageId: messageData.id,
            from: messageData.from,
            text: messageData.text,
            date: messageData.date,
            chatId: messageData.chatId,
            chatType: messageData.chatType,
            isCacapaybot: true
        });
        
        state.lastMessageId = messageData.id;
        saveState();
    } else {
        console.log('🎯 Cacapaybot: NON');
    }
    
    console.log('============================');
}

// Fonction pour ouvrir le site
function openSite() {
    try {
        console.log('🌐 Ouverture du site Cacapay...');
        const { exec } = require('child_process');
        exec(`open "${CONFIG.SITE_URL}"`, (error) => {
            if (error) {
                console.log('❌ Erreur ouverture site:', error.message);
            } else {
                console.log('✅ Site ouvert avec succès');
            }
        });
    } catch (error) {
        console.log('❌ Erreur ouverture site:', error.message);
    }
}

// Fonction pour récupérer les paiements depuis Vercel
function fetchVercelPayments() {
    const url = new URL(CONFIG.VERCEL_API_URL);
    
    const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
            'User-Agent': 'Telegram-Desktop-Monitor/1.0'
        }
    };
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
        
                if (jsonData.notifications && jsonData.notifications.length > 0) {
                    const latestNotification = jsonData.notifications[jsonData.notifications.length - 1];
            
            if (latestNotification.id > state.lastVercelMessageId) {
                console.log('📨 NOUVEAU PAIEMENT VERCEL DÉTECTÉ !');
                console.log('============================');
                console.log(`📝 Message ID: ${latestNotification.id}`);
                console.log(`👤 De: ${latestNotification.sender}`);
                console.log(`🕒 Date: ${latestNotification.timestamp}`);
                console.log(`📄 Contenu: ${latestNotification.message}`);
                console.log('🎯 Cacapaybot: OUI');
                console.log('🚨 MESSAGE CACAPAYBOT DÉTECTÉ !');
                
                // Cliquer sur le bouton Execute d'Automa
                clickAutomaExecute();
                
                console.log('🚀 Ouverture du site...');
                openSite();
                
                // Mettre à jour les compteurs
                state.messageCount++;
                state.cacapaybotMessages++;
                state.allMessages.push({
                    timestamp: new Date().toISOString(),
                    messageId: latestNotification.id,
                    from: { username: latestNotification.sender },
                    text: latestNotification.message,
                    date: latestNotification.timestamp,
                    chatId: CONFIG.CHAT_ID,
                    chatType: 'private',
                    isCacapaybot: true
                });
                
                state.lastVercelMessageId = latestNotification.id;
                state.lastMessageId = latestNotification.id;
                saveState();
            }
        }
    } catch (error) {
        console.log('❌ Erreur récupération Vercel:', error.message);
    }
}

// Fonction pour surveiller Telegram Desktop
function monitorTelegramDesktop() {
    console.log('🔍 Surveillance des logs de Telegram Desktop...');
    
    // Chemins des logs Telegram Desktop
    const logPaths = [
        path.join(os.homedir(), 'Library/Logs/Telegram Desktop/'),
        path.join(os.homedir(), 'Library/Application Support/Telegram Desktop/'),
        path.join(os.homedir(), 'Library/Application Support/Telegram Desktop/logs/')
    ];
    
    logPaths.forEach(logPath => {
        if (fs.existsSync(logPath)) {
            console.log(`📂 Surveillance: ${logPath}`);
            
            // Surveiller les nouveaux fichiers
            fs.watch(logPath, (eventType, filename) => {
                if (filename && filename.endsWith('.log')) {
                    const filePath = path.join(logPath, filename);
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        const lines = content.split('\n');
                        
                        lines.forEach(line => {
                            if (line.includes('message') && line.includes('text')) {
                                // Simuler la détection d'un message
                                const messageData = {
                                    id: Date.now(),
                                    from: 'Cacapaybot',
                                    username: 'Cacapaybot',
                                    isBot: true,
                                    chatType: 'private',
                                    chatId: CONFIG.CHAT_ID,
                                    date: new Date().toLocaleString('fr-FR'),
                                    text: '💰 NOUVEAU PAIEMENT REÇU !\n👤 Nom: Test\n📧 Email: test@test.com\n💳 Carte: 1234 **** **** 5678\n💶 Montant: 99.99€\n🔒 Vérifiez immédiatement !'
                                };
                                
                                processDetectedMessage(messageData);
                            }
                        });
                    } catch (error) {
                        // Ignorer les erreurs de lecture
                    }
                }
            });
        }
    });
}

// Fonction pour surveiller l'activité de Telegram Desktop
function monitorTelegramActivity() {
    console.log('🖥️ Surveillance de l\'activitée de Telegram Desktop...');
    
    setInterval(() => {
        const { exec } = require('child_process');
        exec('pgrep -f "Telegram"', (error, stdout) => {
            if (stdout.trim()) {
                console.log('✅ Telegram Desktop est actif');
            } else {
                console.log('❌ Telegram Desktop n\'est pas actif');
            }
        });
    }, 5000);
}

// Fonction pour surveiller les notifications système
function monitorSystemNotifications() {
    console.log('🔔 Surveillance des notifications système...');
    
    // Surveiller les notifications macOS
    const { exec } = require('child_process');
    exec('log stream --predicate \'subsystem == "com.apple.notifications"\' --style compact', (error, stdout) => {
        if (stdout.includes('Telegram') && stdout.includes('message')) {
            console.log('📨 Notification Telegram détectée');
        }
    });
}

// Fonction principale
function startMonitor() {
    console.log('🖥️ MONITEUR TELEGRAM DESKTOP DÉMARRÉ !');
    console.log('=====================================');
    console.log('📊 Configuration:');
    console.log(`   - Token: ${CONFIG.TELEGRAM_TOKEN.substring(0, 20)}...`);
    console.log(`   - Chat ID: ${CONFIG.CHAT_ID}`);
    console.log(`   - Site: ${CONFIG.SITE_URL}`);
    console.log(`   - API Vercel: ${CONFIG.VERCEL_API_URL}`);
    console.log(`   - Intervalle: ${CONFIG.INTERVAL}ms`);
    console.log(`   - Log file: ${CONFIG.LOG_FILE}`);
    console.log(`   - Telegram Desktop: ${CONFIG.TELEGRAM_DESKTOP_PATH}`);
    console.log('🔍 Critères de détection Cacapaybot:');
    console.log('   - Username contient "cacapay" ou "caca"');
    console.log('   - Prénom contient "cacapay" ou "caca"');
    console.log('   - Message contient "cacapay", "caca", "nouveau paiement", "paiement reçu", "montant:", "carte:", "expiration:", "cvv:", "méthode:", "vérifiez immédiatement"');
    console.log('   - ID utilisateur correspond à votre bot');
    console.log('📡 Endpoints disponibles:');
    console.log('   - http://localhost:3007/messages');
    console.log('   - http://localhost:3007/cacapaybot-messages');
    console.log('   - http://localhost:3007/all-messages');
    console.log('   - http://localhost:3007/status');
    console.log('   - http://localhost:3007/clear-logs');
    console.log('⏰ Surveillance en cours...');
    console.log('💡 Le moniteur surveille les logs et notifications de Telegram Desktop');
    console.log('🌐 + Récupération des paiements depuis Vercel');
    
    loadState();
    
    // Démarrer la surveillance
    monitorTelegramDesktop();
    monitorTelegramActivity();
    monitorSystemNotifications();
    
    // Récupérer les paiements Vercel toutes les 5 secondes
    setInterval(fetchVercelPayments, 5000);
    
    // Sauvegarder l'état toutes les 30 secondes
    setInterval(saveState, 30000);
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du moniteur...');
    saveState();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt du moniteur...');
    saveState();
    process.exit(0);
});

// Serveur HTTP pour exposer les endpoints
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/messages') {
        res.end(JSON.stringify({
            totalMessages: state.messageCount,
            lastMessageId: state.lastMessageId,
            status: 'Actif'
        }));
    } else if (req.url === '/cacapaybot-messages') {
        res.end(JSON.stringify({
            totalCacapaybotMessages: state.cacapaybotMessages,
            status: 'Actif'
        }));
    } else if (req.url === '/all-messages') {
        res.end(JSON.stringify({
            totalAllMessages: state.allMessages,
            status: 'Actif'
        }));
    } else if (req.url === '/status') {
        res.end(JSON.stringify({
            status: 'Actif',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            state: state
        }));
    } else if (req.url === '/clear-logs') {
        state = {
            lastMessageId: 0,
            messageCount: 0,
            allMessages: 0,
            cacapaybotMessages: 0
        };
        saveState();
        res.end(JSON.stringify({ message: 'Logs effacés', status: 'OK' }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Endpoint non trouvé' }));
    }
});

// Démarrer le serveur
server.listen(3007, () => {
    console.log('🌐 Serveur HTTP démarré sur le port 3007');
    startMonitor();
});
