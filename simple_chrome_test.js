const { exec } = require('child_process');

console.log('🔍 Test simple Chrome...');

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

console.log('⏳ Attente...');
