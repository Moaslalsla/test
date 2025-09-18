const { clipboard } = require('electron');

console.log('🧪 TEST DE LA FONCTIONNALITÉ DE COPIE');
console.log('=====================================');

// Test 1: Copie simple
console.log('\n📋 Test 1: Copie simple');
try {
    const testText = '💰 NOUVEAU PAIEMENT REÇU !\n👤 Nom: Test User\n📧 Email: test@example.com\n💳 Carte: 1234 **** **** 5678\n💶 Montant: 99.99€\n🔒 Vérifiez immédiatement !';
    
    clipboard.writeText(testText);
    console.log('✅ Texte copié avec succès');
    
    // Vérifier ce qui est dans le presse-papiers
    const clipboardContent = clipboard.readText();
    console.log('📄 Contenu du presse-papiers:');
    console.log(clipboardContent);
    
    if (clipboardContent === testText) {
        console.log('✅ Copie vérifiée - Le contenu correspond !');
    } else {
        console.log('❌ Erreur - Le contenu ne correspond pas');
    }
    
} catch (error) {
    console.error('❌ Erreur lors du test de copie:', error);
}

// Test 2: Copie d'un message de paiement
console.log('\n📋 Test 2: Message de paiement complet');
try {
    const paymentMessage = `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Jean Dupont
📧 Email: jean.dupont@example.com
💳 Carte: 4111 **** **** 1111
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 149.99€
🔒 Vérifiez immédiatement !`;

    clipboard.writeText(paymentMessage);
    console.log('✅ Message de paiement copié');
    
    const clipboardContent = clipboard.readText();
    console.log('📄 Contenu copié:');
    console.log(clipboardContent.substring(0, 100) + '...');
    
} catch (error) {
    console.error('❌ Erreur lors de la copie du message de paiement:', error);
}

console.log('\n🎯 Test terminé !');
console.log('💡 Vérifiez votre presse-papiers - vous devriez pouvoir coller le contenu avec Cmd+V');
