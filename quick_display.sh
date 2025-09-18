#!/bin/bash

echo "📱 AFFICHAGE RAPIDE DES MESSAGES"
echo "==============================="
echo ""

echo "Choisissez une option :"
echo "1) Envoyer un message de test et l'afficher"
echo "2) Afficher le dernier message reçu"
echo "3) Quitter"
echo ""

read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "🧪 Envoi d'un message de test..."
        node simple_message_display.js --test
        ;;
    2)
        echo "🔍 Affichage du dernier message..."
        node simple_message_display.js --show
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
