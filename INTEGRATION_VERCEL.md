# 🚀 Intégration Cacapay pour Vercel

## 📋 Vue d'ensemble

Ce guide vous explique comment intégrer les notifications Cacapay dans votre site Vercel.

## 🔧 Fichiers d'intégration

- `site_vercel_integration.js` - Code JavaScript d'intégration
- `site_vercel_complet.html` - Site de paiement complet
- `INTEGRATION_VERCEL.md` - Ce guide

## 🚀 Installation rapide

### 1. Ajouter le fichier JavaScript

Créez un fichier `site_vercel_integration.js` dans votre projet Vercel :

```javascript
// Copiez le contenu de site_vercel_integration.js
```

### 2. Modifier votre page de paiement

Ajoutez ce code dans votre page de paiement :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💳 Paiement Sécurisé</title>
    <!-- Votre CSS -->
</head>
<body>
    <!-- Votre formulaire de paiement -->
    <form id="paymentForm">
        <input type="text" id="customerName" placeholder="Nom" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="number" id="amount" placeholder="Montant" required>
        <button type="submit">💳 Payer</button>
    </form>
    
    <!-- Boutons de test -->
    <button onclick="testTelegram()">🧪 Tester Telegram</button>
    <button onclick="testSimple()">🔧 Test Simple</button>
    
    <!-- Inclure le fichier d'intégration -->
    <script src="site_vercel_integration.js"></script>
    
    <script>
        // Gestion du formulaire
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await processPayment();
        });
    </script>
</body>
</html>
```

## 🔧 Configuration

### Variables disponibles

```javascript
const CACAPAY_CONFIG = {
    API_URL: 'https://test-alpha-lac-68.vercel.app/api/telegram',
    TIMEOUT: 10000, // 10 secondes
    RETRY_ATTEMPTS: 3
};
```

### Fonctions disponibles

```javascript
// Traiter un paiement
await processPayment();

// Tester Telegram
await testTelegram();

// Test simple
await testSimple();

// Envoyer une notification personnalisée
const result = await sendCacapayNotification({
    customerName: 'Jean Dupont',
    email: 'jean@example.com',
    amount: 99.99
});
```

## 📱 Format du message

Le message envoyé à Telegram sera formaté comme ceci :

```
💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: Jean Dupont
📧 Email: jean@example.com
🛍️ Produit: Produit Premium
💳 Carte: 1234 **** **** 5678
💶 Montant: 99.99€
🔒 Vérifiez immédiatement !
```

## 🧪 Test

### 1. Test avec le bouton "🧪 Tester Telegram"

Cliquez sur le bouton pour envoyer un message de test.

### 2. Test avec le bouton "🔧 Test Simple"

Cliquez sur le bouton pour tester la connectivité API.

### 3. Test avec un vrai paiement

Remplissez le formulaire et cliquez sur "Payer".

## 🔄 Retry automatique

Le système inclut un mécanisme de retry automatique :

- **3 tentatives** maximum
- **Backoff exponentiel** : 1s, 2s, 4s
- **Timeout** : 10 secondes par tentative
- **Gestion d'erreurs** complète

## 📊 Exemples d'intégration

### HTML simple

```html
<!DOCTYPE html>
<html>
<head>
    <script src="site_vercel_integration.js"></script>
</head>
<body>
    <form id="paymentForm">
        <input type="text" id="customerName" placeholder="Nom" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="number" id="amount" placeholder="Montant" required>
        <button type="submit">Payer</button>
    </form>
    
    <script>
        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await processPayment();
        });
    </script>
</body>
</html>
```

### React/Next.js

```jsx
import { useEffect } from 'react';

const PaymentForm = () => {
    useEffect(() => {
        // Charger le script d'intégration
        const script = document.createElement('script');
        script.src = '/site_vercel_integration.js';
        script.onload = () => {
            // Le script est chargé
        };
        document.head.appendChild(script);
    }, []);

    const handlePayment = async () => {
        if (window.processPayment) {
            await window.processPayment();
        }
    };

    return (
        <form onSubmit={handlePayment}>
            {/* Votre formulaire */}
        </form>
    );
};
```

## 🆘 Support

### Problèmes courants

1. **Erreur de CORS** : Vérifiez que votre site peut faire des requêtes HTTPS
2. **Timeout** : Augmentez la valeur `TIMEOUT` dans la configuration
3. **Retry échoué** : Vérifiez la connectivité réseau

### Logs

Le système log automatiquement :
- ✅ Succès des envois
- ⚠️ Tentatives de retry
- ❌ Erreurs détaillées

### Debug

```javascript
// Activer les logs détaillés
console.log('Configuration Cacapay:', CACAPAY_CONFIG);

// Tester la connectivité
fetch(CACAPAY_CONFIG.API_URL, { method: 'POST', body: '{}' })
    .then(response => console.log('API accessible:', response.ok))
    .catch(error => console.error('API inaccessible:', error));
```

## ✅ Checklist d'intégration

- [ ] Fichier `site_vercel_integration.js` ajouté
- [ ] Fonction `processPayment` appelée après paiement
- [ ] Gestion d'erreur implémentée
- [ ] Test effectué avec succès
- [ ] Notifications reçues sur Telegram

## 🎯 Résultat attendu

Quand un client paie sur votre site :
1. ✅ Le paiement est traité
2. ✅ Une notification est envoyée à Telegram
3. ✅ Vous recevez le message sur votre chat
4. ✅ Le système gère les erreurs automatiquement

## 🚀 Déploiement

1. Ajoutez les fichiers à votre projet Vercel
2. Déployez sur Vercel
3. Testez avec les boutons de test
4. Vérifiez que les notifications arrivent sur Telegram

---

**🚀 Votre site Vercel est maintenant prêt pour les notifications Cacapay !**
