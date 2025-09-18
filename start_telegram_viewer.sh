#!/bin/bash

echo "📱 VISIONNEUSE TELEGRAM CACAPAYBOT"
echo "=================================="
echo ""

# Fonction pour afficher le dernier message
show_last() {
    echo "🔍 Vérification du dernier message..."
    node telegram_message_viewer.js
}

# Fonction pour envoyer un test et l'afficher
test_and_show() {
    echo "🧪 Envoi d'un message de test et affichage..."
    node telegram_message_viewer.js --test
}

# Fonction pour surveillance continue
monitor_continuous() {
    echo "🔄 Surveillance continue (Ctrl+C pour arrêter)..."
    node telegram_message_viewer.js --monitor
}

# Menu principal
echo "Choisissez une option :"
echo "1) Afficher le dernier message"
echo "2) Envoyer un test et l'afficher"
echo "3) Surveillance continue"
echo "4) Quitter"
echo ""

read -p "Votre choix (1-4): " choice

case $choice in
    1)
        show_last
        ;;
    2)
        test_and_show
        ;;
    3)
        monitor_continuous
        ;;
    4)
        echo "👋 Au revoir !"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
