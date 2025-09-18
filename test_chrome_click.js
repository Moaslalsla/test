const { exec } = require('child_process');

console.log('🎯 Test de clic sur le bouton Execute dans Chrome...');

// Script AppleScript pour cliquer sur le bouton Execute dans Chrome
const script = `
tell application "System Events"
    tell process "Google Chrome"
        try
            -- Essayer de trouver le bouton Execute dans la fenêtre principale
            click button "Execute" of window 1
            return "success - Execute dans Chrome"
        on error
            try
                -- Essayer de trouver le bouton Execute (option+enter)
                click button "Execute (option+enter)" of window 1
                return "success - Execute (option+enter) dans Chrome"
            on error
                try
                    -- Lister tous les boutons disponibles
                    set buttonList to name of every button of window 1
                    return "Boutons disponibles: " & (buttonList as string)
                on error
                    return "Aucun bouton trouvé dans Chrome"
                end try
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
