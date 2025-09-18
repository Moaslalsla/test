# 📱 Système d'Affichage des Messages Cacapaybot

Ce système vous permet de voir facilement les messages Cacapaybot qui sont envoyés.

## 🚀 Scripts disponibles

### 1. Affichage simple et rapide
```bash
node simple_message_display.js --test
```
- Envoie un message de test et l'affiche immédiatement
- Sauvegarde le message dans `simple_messages.txt`

### 2. Affichage du dernier message reçu
```bash
node simple_message_display.js --show
```
- Affiche le dernier message reçu depuis l'API Vercel
- Sauvegarde le message dans `simple_messages.txt`

### 3. Interface interactive
```bash
./quick_display.sh
```
- Menu interactif pour choisir l'action
- Options : test, affichage, quitter

### 4. Moniteur continu
```bash
./continuous_monitor.sh
```
- Surveille en continu les messages (toutes les 5 secondes)
- Affiche les nouveaux messages dès qu'ils arrivent
- Appuyez sur Ctrl+C pour arrêter

## 📋 Fonctionnalités

- ✅ **Affichage immédiat** des messages dans le terminal
- ✅ **Sauvegarde automatique** dans un fichier texte
- ✅ **Formatage clair** avec séparateurs et informations
- ✅ **Surveillance continue** ou ponctuelle
- ✅ **Messages de test** pour vérifier le fonctionnement

## 📁 Fichiers générés

- `simple_messages.txt` - Dernier message sauvegardé
- `telegram_messages.txt` - Messages depuis Telegram (si utilisé)

## 💡 Utilisation recommandée

1. **Test rapide** : `node simple_message_display.js --test`
2. **Surveillance continue** : `./continuous_monitor.sh`
3. **Interface simple** : `./quick_display.sh`

## 📱 Format d'affichage

```
============================================================
📱 MESSAGE CACAPAYBOT
============================================================
🆔 ID: 197
📅 Date: 9/18/2025, 3:36:24 AM
👤 Expéditeur: Cacapaybot
📝 Type: payment_message

📄 CONTENU:
----------------------------------------
💰 MESSAGE DE TEST SIMPLE !
👤 Nom: Test Simple
📧 Email: test@simple.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !
----------------------------------------
============================================================
```

## 🛠️ Dépendances

- Node.js
- node-fetch

## ⚠️ Notes importantes

- Les messages sont affichés en temps réel
- Chaque message est sauvegardé dans un fichier
- Le système fonctionne avec l'API Vercel
- Appuyez sur Ctrl+C pour arrêter la surveillance continue
