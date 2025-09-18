const { exec } = require('child_process');

console.log('🎯 Test de clic sur le bouton Execute...');

// Script pour envoyer le raccourci Option+Enter
const script = `tell application "System Events"
tell process "Google Chrome"
key down {option}
key down {return}
key up {return}
key up {option}
return "Raccourci Option+Enter envoyé"
end tell
end tell`;

console.log('🚀 Envoi du raccourci Option+Enter...');

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur:', error.message);
    } else {
        console.log('✅ Résultat:', stdout.trim());
    }
    
    if (stderr) {
        console.log('⚠️ Stderr:', stderr);
    }
});

console.log('⏳ Attente du résultat...');
