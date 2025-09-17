#!/bin/bash

echo "🖥️ DÉMARRAGE DE L'INTERFACE DESKTOP CACAPAYBOT"
echo "=============================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier si Electron est installé
if ! npm list electron &> /dev/null; then
    echo "📦 Installation d'Electron..."
    npm install electron --save-dev
fi

echo "🚀 Lancement de l'interface desktop..."
echo "💡 L'interface va s'ouvrir dans une nouvelle fenêtre"
echo "📱 Les messages seront mis à jour en temps réel"
echo ""

# Démarrer l'application
npm run electron
