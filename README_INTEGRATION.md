# 🚀 Intégration Cacapay

## 📋 Vue d'ensemble

Ce package contient tout ce dont vous avez besoin pour intégrer les notifications Cacapay dans votre site de paiement.

## 📁 Fichiers inclus

- `integration.js` - Code principal d'intégration
- `exemple_utilisation.html` - Exemple d'utilisation
- `site_paiement_complet.html` - Site de paiement complet
- `site_paiement_react.jsx` - Exemple React/Next.js
- `site_paiement_php.php` - Exemple PHP
- `GUIDE_INTEGRATION.md` - Guide détaillé

## 🚀 Installation rapide

### 1. Inclure le fichier JavaScript

```html
<script src="integration.js"></script>
```

### 2. Utiliser la fonction

```javascript
// Données du paiement
const paymentData = {
    customerName: 'Jean Dupont',
    email: 'jean@example.com',
    product: 'Produit Premium',
    amount: 99.99,
    cardNumber: '1234 **** **** 5678'
};

// Envoyer la notification
const result = await sendCacapayNotification(paymentData);

if (result.success) {
    console.log('✅ Notification envoyée !', result.messageId);
} else {
    console.error('❌ Erreur:', result.error);
}
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

### Fonctions utilitaires

```javascript
// Formater un numéro de carte
const formatted = formatCardNumber('1234567890123456');
// Résultat: "1234 5678 9012 3456"

// Formater une date d'expiration
const formatted = formatExpiry('1225');
// Résultat: "12/25"

// Valider un email
const isValid = isValidEmail('test@example.com');
// Résultat: true

// Valider un montant
const isValid = isValidAmount(99.99);
// Résultat: true
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

1. Ouvrez `exemple_utilisation.html` dans votre navigateur
2. Remplissez le formulaire
3. Cliquez sur "Tester la notification"
4. Vérifiez que vous recevez le message sur Telegram

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
    <script src="integration.js"></script>
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
            
            const paymentData = {
                customerName: document.getElementById('customerName').value,
                email: document.getElementById('email').value,
                amount: parseFloat(document.getElementById('amount').value)
            };
            
            const result = await sendCacapayNotification(paymentData);
            
            if (result.success) {
                alert('✅ Paiement réussi et notification envoyée !');
            } else {
                alert('❌ Erreur: ' + result.error);
            }
        });
    </script>
</body>
</html>
```

### React/Next.js

```jsx
import { sendCacapayNotification } from './integration.js';

const PaymentForm = () => {
    const handlePayment = async (paymentData) => {
        const result = await sendCacapayNotification(paymentData);
        
        if (result.success) {
            console.log('✅ Notification envoyée !', result.messageId);
        } else {
            console.error('❌ Erreur:', result.error);
        }
    };
    
    return (
        <form onSubmit={handlePayment}>
            {/* Votre formulaire */}
        </form>
    );
};
```

### PHP

```php
<?php
// Inclure le fichier JavaScript côté client
echo '<script src="integration.js"></script>';

// Ou utiliser la fonction PHP directement
function sendCacapayNotification($paymentData) {
    $apiUrl = 'https://test-alpha-lac-68.vercel.app/api/telegram';
    
    $message = "💰 NOUVEAU PAIEMENT REÇU !\n";
    $message .= "👤 Nom: " . $paymentData['customerName'] . "\n";
    $message .= "📧 Email: " . $paymentData['email'] . "\n";
    $message .= "💶 Montant: " . $paymentData['amount'] . "€\n";
    $message .= "🔒 Vérifiez immédiatement !";
    
    $data = [
        'message' => $message,
        'type' => 'payment'
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($apiUrl, false, $context);
    
    return json_decode($result, true);
}
?>
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

- [ ] Fichier `integration.js` inclus
- [ ] Fonction `sendCacapayNotification` appelée après paiement
- [ ] Gestion d'erreur implémentée
- [ ] Test effectué avec succès
- [ ] Notifications reçues sur Telegram

## 🎯 Résultat attendu

Quand un client paie sur votre site :
1. ✅ Le paiement est traité
2. ✅ Une notification est envoyée à Telegram
3. ✅ Vous recevez le message sur votre chat
4. ✅ Le système gère les erreurs automatiquement

---

**🚀 Votre site est maintenant prêt pour les notifications Cacapay !**
