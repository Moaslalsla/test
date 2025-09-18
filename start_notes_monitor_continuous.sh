#!/bin/bash

echo "📝 MONITEUR CONTINU POUR NOTES"
echo "=============================="
echo ""
echo "🔄 Ce script surveille en continu les messages Cacapaybot"
echo "📝 et les colle automatiquement dans l'application Notes"
echo ""
echo "💡 Commandes disponibles :"
echo "   - Ctrl+C : Arrêter la surveillance"
echo "   - Le script vérifie toutes les 5 secondes"
echo ""
echo "🚀 Démarrage de la surveillance..."

# Lancer le moniteur en mode continu
node auto_paste_to_notes.js
