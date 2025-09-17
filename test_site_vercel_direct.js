// Test direct du site Vercel
const fetch = globalThis.fetch || require('node-fetch');

async function testSiteVercel() {
    console.log('🌐 TEST SITE VERCEL DIRECT');
    console.log('==========================');
    
    try {
        // Test 1: Vérifier que le site répond
        console.log('📡 Test 1: Vérification du site...');
        const siteResponse = await fetch('https://test-alpha-lac-68.vercel.app/');
        console.log('✅ Site accessible:', siteResponse.ok);
        
        // Test 2: Tester l'API directement
        console.log('\n📡 Test 2: Test API direct...');
        const apiResponse = await fetch('https://test-alpha-lac-68.vercel.app/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🧪 TEST SITE VERCEL DIRECT !\n✅ Test depuis le site\n📱 Vérifiez Telegram',
                type: 'test'
            })
        });
        
        const apiResult = await apiResponse.json();
        
        if (apiResult.success) {
            console.log('✅ API fonctionne !');
            console.log('📱 Message ID:', apiResult.telegramResponse?.result?.message_id);
        } else {
            console.log('❌ API échoue:', apiResult.error);
        }
        
        // Test 3: Simuler un paiement depuis le site
        console.log('\n📡 Test 3: Simulation paiement...');
        const paymentResponse = await fetch('https://test-alpha-lac-68.vercel.app/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '💰 NOUVEAU PAIEMENT REÇU !\n👤 Nom: Test Site\n📧 Email: test@site.com\n💳 Carte: 1234 **** **** 5678\n💶 Montant: 99.99€\n🔒 Vérifiez immédiatement !',
                type: 'payment'
            })
        });
        
        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
            console.log('✅ Paiement simulé !');
            console.log('📱 Message ID:', paymentResult.telegramResponse?.result?.message_id);
            console.log('🎯 Vérifiez votre Telegram !');
        } else {
            console.log('❌ Paiement échoue:', paymentResult.error);
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testSiteVercel();
