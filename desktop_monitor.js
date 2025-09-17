const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fetch = require('node-fetch');

// Configuration
const CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    UPDATE_INTERVAL: 2000, // 2 secondes
    WINDOW_WIDTH: 1200,
    WINDOW_HEIGHT: 800
};

let mainWindow;
let tray;
let isQuitting = false;

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

// Récupérer les messages depuis l'API
async function fetchMessages() {
    try {
        const response = await fetch(CONFIG.API_URL);
        const data = await response.json();
        
        if (data.success && data.notifications) {
            return data.notifications.reverse(); // Plus récents en premier
        }
        return [];
    } catch (error) {
        console.error('❌ Erreur récupération messages:', error);
        return [];
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
        
    } catch (error) {
        console.error('❌ Erreur mise à jour messages:', error);
    }
}

// Gestionnaires IPC
ipcMain.handle('get-messages', async () => {
    return await fetchMessages();
});

ipcMain.handle('test-api', async () => {
    try {
        const response = await fetch('https://test-alpha-lac-68.vercel.app/api/telegram', {
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
        return result;
    } catch (error) {
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
