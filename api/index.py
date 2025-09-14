from flask import Flask, render_template_string, request, jsonify
import json
import uuid
import time
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'automated_crypto_buyer_2025'

# Base de données en mémoire pour stocker les commandes
pending_orders = {}
completed_orders = {}

# Template HTML principal
MAIN_TEMPLATE = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Acheteur Crypto Automatisé</title>
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
            color: white;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 16px;
        }

        .btn {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 20px;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.3);
        }

        .status {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }

        .status.success {
            background: rgba(46, 213, 115, 0.2);
            border: 1px solid #2ed573;
        }

        .status.error {
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid #ff6b6b;
        }

        .status.pending {
            background: rgba(255, 165, 0, 0.2);
            border: 1px solid #ffa500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 Acheteur Crypto Automatisé</h1>
            <p>Version Vercel - Déployé avec succès!</p>
        </div>

        <div class="card">
            <h2>💰 Formulaire d'achat</h2>
            <form id="orderForm">
                <div class="form-group">
                    <label for="crypto">Cryptomonnaie :</label>
                    <select id="crypto" name="crypto" required>
                        <option value="">Sélectionnez une crypto</option>
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="ADA">Cardano (ADA)</option>
                        <option value="DOT">Polkadot (DOT)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="amount">Montant (€) :</label>
                    <input type="number" id="amount" name="amount" min="10" max="10000" step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="email">Email :</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <button type="submit" class="btn">🚀 Lancer l'achat automatique</button>
            </form>
        </div>

        <div id="result"></div>
    </div>

    <script>
        document.getElementById('orderForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '<div class="status pending">⏳ Traitement de votre commande...</div>';
            
            try {
                const response = await fetch('/api/buy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    resultDiv.innerHTML = `
                        <div class="status success">
                            ✅ Commande créée avec succès !<br>
                            ID: ${result.order_id}<br>
                            <small>Note: Ceci est une démo. L'achat automatique nécessite une configuration locale avec Selenium.</small>
                        </div>
                    `;
                } else {
                    resultDiv.innerHTML = `<div class="status error">❌ Erreur: ${result.error}</div>`;
                }
            } catch (error) {
                resultDiv.innerHTML = `<div class="status error">❌ Erreur de connexion</div>`;
            }
        });
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Page principale"""
    return render_template_string(MAIN_TEMPLATE)

@app.route('/api/buy', methods=['POST'])
def api_buy():
    """API pour créer une commande d'achat"""
    try:
        data = request.get_json()
        
        # Validation des données
        if not data or not all(k in data for k in ['crypto', 'amount', 'email']):
            return jsonify({'success': False, 'error': 'Données manquantes'})
        
        # Créer une commande
        order_id = str(uuid.uuid4())[:8]
        order = {
            'id': order_id,
            'crypto': data['crypto'],
            'amount': float(data['amount']),
            'email': data['email'],
            'status': 'demo_created',
            'created_at': datetime.now().isoformat(),
            'message': 'Commande créée en mode démo. Pour l\'automatisation complète, utilisez la version locale avec Selenium.'
        }
        
        pending_orders[order_id] = order
        
        return jsonify({
            'success': True,
            'order_id': order_id,
            'message': 'Commande créée avec succès (mode démo)'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/status/<order_id>')
def api_status(order_id):
    """Vérifier le statut d'une commande"""
    if order_id in pending_orders:
        return jsonify(pending_orders[order_id])
    elif order_id in completed_orders:
        return jsonify(completed_orders[order_id])
    else:
        return jsonify({'error': 'Commande non trouvée'}), 404

@app.route('/admin')
def admin():
    """Interface admin simple"""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Admin - Acheteur Crypto</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .order { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <h1>🔧 Administration</h1>
        <h2>Commandes en attente ({{ pending_count }})</h2>
        {% for order in pending_orders %}
        <div class="order">
            <strong>ID:</strong> {{ order.id }}<br>
            <strong>Crypto:</strong> {{ order.crypto }}<br>
            <strong>Montant:</strong> {{ order.amount }}€<br>
            <strong>Email:</strong> {{ order.email }}<br>
            <strong>Créé:</strong> {{ order.created_at }}<br>
        </div>
        {% endfor %}
        
        <h2>Commandes terminées ({{ completed_count }})</h2>
        {% for order in completed_orders %}
        <div class="order">
            <strong>ID:</strong> {{ order.id }}<br>
            <strong>Crypto:</strong> {{ order.crypto }}<br>
            <strong>Montant:</strong> {{ order.amount }}€<br>
            <strong>Statut:</strong> {{ order.status }}<br>
        </div>
        {% endfor %}
    </body>
    </html>
    """, 
    pending_orders=list(pending_orders.values()),
    completed_orders=list(completed_orders.values()),
    pending_count=len(pending_orders),
    completed_count=len(completed_orders))

# Export de l'application pour Vercel
def handler(request):
    return app(request.environ, lambda *args: None)
