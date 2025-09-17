// API Vercel pour recevoir les notifications de paiement
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    SITE_URL: 'https://test-alpha-lac-68.vercel.app/',
    MAX_NOTIFICATIONS: 200
};

// Stockage en mémoire (pour Vercel serverless)
let notifications = [];
let notificationCount = 0;

// Fonction pour ouvrir le site (simulation)
function openSite() {
    console.log('🚀 Ouverture du site...');
    console.log('🌐 Ouverture du site Cacapay...');
    console.log('✅ Site ouvert avec succès (simulation)');
}

// Fonction pour traiter une notification
function processNotification(notification) {
    notificationCount++;
    
    console.log('🎯 NOTIFICATION CACAPAYBOT REÇUE !');
    console.log('📨 NOTIFICATION TRAITÉE !');
    console.log('==============================');
    console.log(`📝 ID: ${notification.id || 'N/A'}`);
    console.log(`📄 Message: ${notification.message || 'N/A'}`);
    console.log(`👤 Expéditeur: ${notification.sender || 'N/A'}`);
    console.log(`🎯 Type: ${notification.type || 'N/A'}`);
    console.log(`🕒 Date: ${new Date().toLocaleString('fr-FR')}`);
    console.log('==============================');
    
    // Ajouter à la liste des notifications
    notifications.push({
        id: notification.id || Date.now(),
        message: notification.message,
        sender: notification.sender,
        type: notification.type,
        timestamp: new Date().toISOString()
    });
    
    // Garder seulement les dernières notifications
    if (notifications.length > CONFIG.MAX_NOTIFICATIONS) {
        notifications = notifications.slice(-CONFIG.MAX_NOTIFICATIONS);
    }
    
    // Ouvrir le site
    openSite();
}

export default async function handler(req, res) {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method === 'POST') {
        // Recevoir une notification
        try {
            const notification = req.body;
            processNotification(notification);
            
            res.status(200).json({
                success: true,
                message: 'Notification reçue avec succès',
                notificationId: notification.id || Date.now()
            });
        } catch (error) {
            console.error('❌ Erreur lors du traitement de la notification:', error.message);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    } else if (req.method === 'GET') {
        // Obtenir les notifications
        try {
            res.status(200).json({
                totalNotifications: notificationCount,
                notifications: notifications,
                status: 'Actif'
            });
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des notifications:', error.message);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
