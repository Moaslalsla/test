const { exec } = require('child_process');

console.log('🔍 Test des boutons corrigé...');

const script = `tell application "System Events"
tell process "Google Chrome"
try
set buttonList to name of every button of window 1
return "Boutons: " & (buttonList as string)
on error errMsg
return "Erreur: " & errMsg
end try
end tell
end tell`;

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur:', error.message);
    } else {
        console.log('✅ Résultat:', stdout.trim());
    }
});
