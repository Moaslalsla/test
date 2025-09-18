const { exec } = require('child_process');

console.log('🧪 TEST DE COLLAGE DANS NOTES');
console.log('=============================');

// Fonction pour tester le collage dans Notes
function testPasteToNotes() {
    return new Promise((resolve, reject) => {
        const testMessage = `💰 TEST DE COLLAGE DANS NOTES !
👤 Nom: Test Notes
📧 Email: test@notes.com
💳 Carte: 1234 **** **** 5678
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !`;

        console.log('📝 Ouverture de Notes et collage du message de test...');
        
        const appleScript = `
tell application "Notes"
    activate
    delay 1
    tell application "System Events"
        keystroke "\\n\\n=== TEST CACAPAYBOT ===\\n"
        keystroke "${testMessage.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"
        keystroke "\\n\\n=== FIN DU TEST ===\\n\\n"
    end tell
end tell
`;

        exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erreur AppleScript:', error);
                reject(error);
            } else {
                console.log('✅ Message de test collé dans Notes avec succès !');
                console.log('📱 Vérifiez l\'application Notes - le message devrait y être !');
                resolve(stdout);
            }
        });
    });
}

// Exécuter le test
testPasteToNotes().catch(console.error);
