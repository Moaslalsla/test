# 🖥️ Interface Desktop Cacapaybot Monitor

## 📋 Description

Interface desktop native pour surveiller les messages Cacapaybot en temps réel sur votre PC. Cette application utilise Electron pour créer une vraie application desktop (pas un navigateur web).

## ✨ Fonctionnalités

- 🖥️ **Interface desktop native** - Application standalone sur votre PC
- ⚡ **Temps réel** - Mise à jour automatique toutes les 2 secondes
- 📊 **Statistiques** - Nombre de messages, dernière mise à jour, status API
- 🔔 **Notifications** - Alertes visuelles pour les nouveaux messages
- 🧪 **Test API** - Bouton pour tester la connectivité
- 📱 **Tray icon** - Icône dans la barre des tâches pour accès rapide
- 🎨 **Interface moderne** - Design élégant et responsive

## 🚀 Installation et démarrage

### Méthode 1: Script automatique (recommandé)
```bash
./start_desktop_monitor.sh
```

### Méthode 2: Manuel
```bash
# Installer les dépendances
npm install

# Démarrer l'application
npm run electron
```

## 🎯 Utilisation

1. **Lancement** : Exécutez `./start_desktop_monitor.sh`
2. **Interface** : L'application s'ouvre dans une nouvelle fenêtre
3. **Surveillance** : Les messages apparaissent automatiquement
4. **Tray** : Double-clic sur l'icône pour afficher/masquer
5. **Test** : Cliquez sur "🧪 Tester" pour envoyer un message de test

## 📊 Interface

### Barre de titre
- **Titre** : Nom de l'application
- **Status** : Indicateur de connexion (vert = en ligne)
- **Boutons** : Actualiser et Tester

### Panneau latéral (gauche)
- **Statistiques** : Messages totaux, dernière mise à jour, status API
- **Configuration** : URL API, intervalle de mise à jour

### Zone principale (droite)
- **Liste des messages** : Affichage en temps réel
- **Détails** : Client, montant, email, carte pour chaque message
- **Format** : Messages formatés avec couleurs et icônes

## 🔧 Configuration

### Variables dans `desktop_monitor.js`
```javascript
const CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/notifications',
    UPDATE_INTERVAL: 2000, // 2 secondes
    WINDOW_WIDTH: 1200,
    WINDOW_HEIGHT: 800
};
```

### Personnalisation
- **Couleurs** : Modifiez le CSS dans `public/index.html`
- **Taille** : Ajustez `WINDOW_WIDTH` et `WINDOW_HEIGHT`
- **Intervalle** : Changez `UPDATE_INTERVAL`

## 📱 Fonctionnalités avancées

### Tray (barre des tâches)
- **Icône** : Apparaît dans la barre des tâches
- **Menu contextuel** : Clic droit pour options
- **Double-clic** : Afficher/masquer la fenêtre

### Raccourcis clavier
- **Cmd+Q** (Mac) / **Alt+F4** (Windows) : Quitter
- **Cmd+M** (Mac) : Minimiser

### Notifications
- **Nouveaux messages** : Alertes visuelles
- **Erreurs API** : Notifications d'erreur
- **Tests** : Confirmation des tests

## 🛠️ Développement

### Structure des fichiers
```
desktop_monitor.js     # Application Electron principale
public/
  index.html          # Interface utilisateur
package.json          # Configuration npm
start_desktop_monitor.sh  # Script de démarrage
```

### Commandes de développement
```bash
# Mode développement (avec DevTools)
NODE_ENV=development npm run electron

# Build de production
npm run build
```

## 🔍 Dépannage

### Problèmes courants

1. **Application ne démarre pas**
   - Vérifiez que Node.js est installé
   - Exécutez `npm install` pour installer les dépendances

2. **Messages ne s'affichent pas**
   - Vérifiez la connectivité internet
   - Testez l'API avec le bouton "🧪 Tester"

3. **Interface ne se met pas à jour**
   - Redémarrez l'application
   - Vérifiez les logs dans la console

### Logs de débogage
```bash
# Activer les DevTools
NODE_ENV=development ./start_desktop_monitor.sh
```

## 📈 Avantages

- ✅ **Application native** - Pas besoin de navigateur
- ✅ **Temps réel** - Mise à jour automatique
- ✅ **Interface dédiée** - Optimisée pour la surveillance
- ✅ **Tray icon** - Accès rapide depuis la barre des tâches
- ✅ **Notifications** - Alertes visuelles
- ✅ **Statistiques** - Vue d'ensemble des données
- ✅ **Test intégré** - Vérification de l'API

## 🎯 Résultat

Vous avez maintenant une interface desktop professionnelle pour surveiller vos messages Cacapaybot en temps réel, directement sur votre PC !

---

**🚀 Votre interface desktop Cacapaybot Monitor est prête !**
