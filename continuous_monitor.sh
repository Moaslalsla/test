#!/bin/bash

echo "📱 MONITEUR CONTINU DES MESSAGES"
echo "==============================="
echo ""
echo "🔄 Ce script surveille en continu les messages Cacapaybot"
echo "📱 et les affiche dès qu'ils arrivent"
echo ""
echo "💡 Appuyez sur Ctrl+C pour arrêter"
echo ""

# Fonction pour envoyer un message de test
send_test() {
    echo "🧪 Envoi d'un message de test..."
    node simple_message_display.js --test
}

# Fonction pour surveillance continue
monitor_continuous() {
    echo "🔄 Démarrage de la surveillance continue..."
    echo "⏳ Vérification toutes les 5 secondes..."
    echo ""
    
    while true; do
        echo "🔍 Vérification des messages... $(date)"
        node simple_message_display.js --show
        echo ""
        echo "⏳ Attente de 5 secondes..."
        sleep 5
    done
}

# Menu principal
echo "Choisissez une option :"
echo "1) Envoyer un message de test"
echo "2) Surveillance continue"
echo "3) Quitter"
echo ""

read -p "Votre choix (1-3): " choice

case $choice in
    1)
        send_test
        ;;
    2)
        monitor_continuous
        ;;
    3)
        echo "👋 Au revoir !"
        exit 0
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
