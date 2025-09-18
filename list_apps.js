const { exec } = require('child_process');

console.log('🔍 Liste des applications ouvertes...');

const script = `
tell application "System Events"
    set appList to name of every process
    return appList as string
end tell
`;

exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur:', error.message);
    } else {
        console.log('📱 Applications ouvertes:');
        const apps = stdout.trim().split(', ');
        apps.forEach(app => {
            if (app.toLowerCase().includes('automa') || app.toLowerCase().includes('chrome') || app.toLowerCase().includes('safari')) {
                console.log('🎯', app);
            }
        });
    }
});

console.log('🔍 Liste des fenêtres...');

const windowScript = `
tell application "System Events"
    set windowList to {}
    repeat with proc in every process
        try
            set windowNames to name of every window of proc
            repeat with windowName in windowNames
                set end of windowList to (name of proc) & " - " & windowName
            end repeat
        end try
    end repeat
    return windowList as string
end tell
`;

exec(`osascript -e '${windowScript}'`, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Erreur fenêtres:', error.message);
    } else {
        console.log('🪟 Fenêtres disponibles:');
        const windows = stdout.trim().split(', ');
        windows.forEach(window => {
            if (window.toLowerCase().includes('automa') || window.toLowerCase().includes('cacapay')) {
                console.log('🎯', window);
            }
        });
    }
});
