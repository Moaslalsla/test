const { clipboard } = require('electron');

console.log('🔍 VÉRIFICATION DU STATUT DE L\'INTERFACE DESKTOP');
console.log('================================================');

// Vérifier le contenu du presse-papiers
try {
    const clipboardContent = clipboard.readText();
    
    if (clipboardContent) {
        console.log('📋 Contenu actuel du presse-papiers:');
        console.log('=====================================');
        console.log(clipboardContent);
        console.log('=====================================');
        console.log(`📏 Longueur: ${clipboardContent.length} caractères`);
        
        // Vérifier si c'est un message de paiement
        if (clipboardContent.includes('NOUVEAU PAIEMENT') || 
            clipboardContent.includes('Montant:') || 
            clipboardContent.includes('€')) {
            console.log('✅ Message de paiement détecté dans le presse-papiers !');
        } else {
            console.log('ℹ️  Contenu détecté mais pas de message de paiement');
        }
    } else {
        console.log('📭 Le presse-papiers est vide');
    }
} catch (error) {
    console.error('❌ Erreur lors de la vérification du presse-papiers:', error);
}

console.log('\n💡 Instructions:');
console.log('1. Vérifiez que l\'interface desktop est ouverte');
console.log('2. Attendez quelques secondes pour la détection automatique');
console.log('3. Essayez de coller avec Cmd+V dans n\'importe quelle application');
console.log('4. Relancez ce script pour vérifier le contenu du presse-papiers');
