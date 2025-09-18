const { exec } = require('child_process');

console.log('🎯 Simulation de clic avec pkill et open...');

// Fonction pour simuler un clic
function simulateClick() {
    console.log('🚀 Simulation du clic...');
    
    // Essayer d'ouvrir Automa si il n'est pas ouvert
    exec('open -a "Automa"', (error) => {
        if (error) {
            console.log('⚠️ Automa pas trouvé, essai avec Chrome...');
            
            // Essayer de cliquer dans Chrome
            exec('osascript -e "tell application \\"Google Chrome\\" to activate"', (error2) => {
                if (error2) {
                    console.log('❌ Impossible d\'activer Chrome');
                } else {
                    console.log('✅ Chrome activé');
                    
                    // Attendre un peu puis simuler un clic
                    setTimeout(() => {
                        console.log('🎯 Simulation du clic sur Execute...');
                        console.log('💡 Tu peux maintenant cliquer manuellement sur Execute');
                    }, 2000);
                }
            });
        } else {
            console.log('✅ Automa ouvert');
            
            // Attendre un peu puis simuler un clic
            setTimeout(() => {
                console.log('🎯 Simulation du clic sur Execute...');
                console.log('💡 Tu peux maintenant cliquer manuellement sur Execute');
            }, 2000);
        }
    });
}

// Démarrer la simulation
simulateClick();

console.log('⏳ Simulation en cours...');
