const { exec } = require('child_process');

console.log('🔍 Test simple des boutons...');

const script = `tell application "System Events"
tell process "Google Chrome"
set windowCount to count of windows
return "Fenêtres: " & windowCount
end tell
end tell`;

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur:', error.message);
    } else {
        console.log('✅ Résultat:', stdout.trim());
    }
});

console.log('🔍 Test des boutons dans Chrome...');

const buttonScript = `tell application "System Events"
tell process "Google Chrome"
try
set buttonList to name of every button of window 1
return "Boutons: " & (buttonList as string)
on error
return "Erreur: " & (error message)
end try
end tell
end tell`;

exec(`osascript -e '${buttonScript}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur boutons:', error.message);
    } else {
        console.log('✅ Boutons trouvés:', stdout.trim());
    }
});
