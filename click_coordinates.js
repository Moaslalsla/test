const { exec } = require('child_process');

console.log('🎯 Test de clic par coordonnées...');

// Script pour cliquer à des coordonnées spécifiques
const script = `tell application "System Events"
click at {100, 100}
return "Clic effectué à 100,100"
end tell`;

console.log('🚀 Exécution du clic par coordonnées...');

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
