#!/bin/bash

echo "🧪 TEST COMPLET DU SYSTÈME NOTES"
echo "================================="
echo ""

echo "1️⃣ Test du collage simple..."
node test_notes_paste.js
echo ""

echo "2️⃣ Test du système complet..."
node auto_paste_to_notes.js --test
echo ""

echo "3️⃣ Vérification ponctuelle..."
./check_and_paste_once.sh
echo ""

echo "✅ Tous les tests sont terminés !"
echo "📝 Vérifiez l'application Notes pour voir les messages collés"
echo ""
echo "💡 Pour la surveillance continue, utilisez :"
echo "   ./start_notes_monitor_continuous.sh"
