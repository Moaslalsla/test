const { exec } = require('child_process');

console.log('🎯 Test de clic sur le bouton Execute d\'Automa...');

// Script AppleScript pour cliquer sur le bouton Execute
const script = `
tell application "System Events"
    tell process "Automa"
        try
            click button "Execute (option+enter)" of window 1
            return "success - Execute (option+enter)"
        on error
            try
                click button "Execute" of window 1
                return "success - Execute"
            on error
                return "button not found"
            end try
        end try
    end tell
end tell
`;

console.log('🚀 Exécution du clic...');

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
