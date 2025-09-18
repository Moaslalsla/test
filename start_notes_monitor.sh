#!/bin/bash

echo "📝 DÉMARRAGE DU MONITEUR NOTES CACAPAYBOT"
echo "========================================="
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

echo "🚀 Lancement du moniteur Notes..."
echo "💡 Les messages Cacapaybot seront automatiquement collés dans Notes"
echo "📱 Appuyez sur Ctrl+C pour arrêter"
echo ""

# Lancer le script
node auto_paste_to_notes.js
