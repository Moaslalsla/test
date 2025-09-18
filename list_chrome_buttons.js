const { exec } = require('child_process');

console.log('🔍 Liste de TOUS les boutons dans Chrome...');

const script = `
tell application "System Events"
    tell process "Google Chrome"
        try
            set windowCount to count of windows
            set result to "Nombre de fenêtres: " & windowCount & return
            
            repeat with i from 1 to windowCount
                try
                    set windowName to name of window i
                    set result to result & "Fenêtre " & i & ": " & windowName & return
                    
                    try
                        set buttonList to name of every button of window i
                        set result to result & "  Boutons: " & (buttonList as string) & return
                    on error
                        set result to result & "  Aucun bouton trouvé" & return
                    end try
                    
                    try
                        set textFieldList to name of every text field of window i
                        set result to result & "  Champs texte: " & (textFieldList as string) & return
                    on error
                        set result to result & "  Aucun champ texte trouvé" & return
                    end try
                    
                on error
                    set result to result & "Fenêtre " & i & ": Erreur d'accès" & return
                end try
            end repeat
            
            return result
        on error
            return "Erreur d'accès à Chrome"
        end try
    end tell
end tell
`;

console.log('🚀 Exécution de la liste...');

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur:', error.message);
    } else {
        console.log('📋 Résultat:');
        console.log(stdout);
    }
    
    if (stderr) {
        console.log('⚠️ Stderr:', stderr);
    }
});

console.log('⏳ Attente du résultat...');
