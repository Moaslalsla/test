// Test de l'API Vercel corrigée
const fetch = globalThis.fetch || require('node-fetch');

const VERCEL_API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';

async function testVercelAPI() {
    console.log('🧪 TEST API VERCEL CORRIGÉE');
    console.log('============================');
    
    try {
        console.log('📤 Envoi du test...');
        
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🔧 TEST API VERCEL CORRIGÉE !\n✅ API fonctionne maintenant\n📱 Message de test envoyé',
                type: 'test'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ SUCCÈS !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('📄 Contenu:', result.telegramResponse?.result?.text);
            console.log('🎯 Vérifiez votre Telegram !');
        } else {
            console.log('❌ ÉCHEC !');
            console.log('Erreur:', result.error);
            console.log('Détails:', result.details);
        }
        
    } catch (error) {
        console.error('❌ ERREUR:', error.message);
    }
}

async function testPaymentMessage() {
    console.log('\n💰 TEST MESSAGE DE PAIEMENT');
    console.log('============================');
    
    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '💰 NOUVEAU PAIEMENT REÇU !\n👤 Nom: Test Client\n📧 Email: test@example.com\n💳 Carte: 1234 **** **** 5678\n💶 Montant: 99.99€\n🔒 Vérifiez immédiatement !',
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ PAIEMENT ENVOYÉ !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('🎯 Vérifiez votre Telegram pour le message de paiement !');
        } else {
            console.log('❌ ÉCHEC PAIEMENT !');
            console.log('Erreur:', result.error);
        }
        
    } catch (error) {
        console.error('❌ ERREUR PAIEMENT:', error.message);
    }
}

async function runTests() {
    await testVercelAPI();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testPaymentMessage();
}

runTests();
