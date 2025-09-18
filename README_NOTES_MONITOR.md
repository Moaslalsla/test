# 📝 Moniteur Notes Cacapaybot

Ce système surveille automatiquement les messages Cacapaybot et les colle directement dans l'application Notes de macOS.

## 🚀 Scripts disponibles

### 1. Test simple
```bash
./test_notes_paste.js
```
- Teste le collage d'un message de test dans Notes
- Ne nécessite pas de connexion à l'API

### 2. Test complet du système
```bash
node auto_paste_to_notes.js --test
```
- Envoie un message de test via l'API Vercel
- Attend 3 secondes
- Colle le message dans Notes

### 3. Vérification ponctuelle
```bash
./check_and_paste_once.sh
```
- Vérifie s'il y a de nouveaux messages
- Colle dans Notes si nouveau message trouvé
- Se termine après une vérification

### 4. Surveillance continue
```bash
./start_notes_monitor_continuous.sh
```
- Surveille en continu (toutes les 5 secondes)
- Colle automatiquement les nouveaux messages dans Notes
- Appuyez sur Ctrl+C pour arrêter

## 📋 Fonctionnalités

- ✅ **Détection automatique** des messages de paiement
- ✅ **Collage automatique** dans Notes avec formatage
- ✅ **Surveillance continue** ou ponctuelle
- ✅ **Formatage spécial** avec séparateurs
- ✅ **Gestion des erreurs** et logs détaillés

## 🔧 Configuration

Le script utilise :
- **API Vercel** : `https://test-alpha-lac-68.vercel.app/api/notifications`
- **Intervalle** : 5 secondes pour la surveillance continue
- **Application** : Notes de macOS (via AppleScript)

## 📱 Format des messages dans Notes

```
=== NOUVEAU MESSAGE CACAPAYBOT ===
💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Client Name
📧 Email: client@example.com
💳 Carte: 1234 **** **** 5678
📅 Expiration: 12/25
🔐 CVV: 123
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !
=== FIN DU MESSAGE ===
```

## 🛠️ Dépendances

- Node.js
- node-fetch
- AppleScript (intégré à macOS)

## 💡 Utilisation recommandée

1. **Test initial** : `node test_notes_paste.js`
2. **Test complet** : `node auto_paste_to_notes.js --test`
3. **Surveillance continue** : `./start_notes_monitor_continuous.sh`

## ⚠️ Notes importantes

- L'application Notes doit être autorisée dans les paramètres de sécurité
- Le script utilise AppleScript pour automatiser Notes
- Les messages sont ajoutés à la fin de la note actuelle
- Appuyez sur Ctrl+C pour arrêter la surveillance continue
