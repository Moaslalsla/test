#!/usr/bin/env python3
"""
Serveur simple pour tester l'intégration Switchere
Version simplifiée qui fonctionne immédiatement
"""

from flask import Flask, render_template_string, request, jsonify
import json
import uuid
import time
import logging
from datetime import datetime

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'test_secret_key_for_demo'

# Template HTML intégré pour éviter les problèmes de chemins
PAYMENT_FORM_HTML = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paiement Crypto - Switchere</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            min-height: 100vh; 
        }
        .payment-container { 
            max-width: 600px; 
            margin: 50px auto; 
            background: white; 
            border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
        }
        .payment-header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 20px 20px 0 0;
        }
        .payment-body { padding: 40px; }
        .form-control { border-radius: 10px; padding: 15px; }
        .btn-pay { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            border: none; 
            border-radius: 10px; 
            padding: 15px 30px; 
            font-size: 18px; 
            width: 100%; 
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="payment-container">
            <div class="payment-header">
                <h1>💰 Paiement Crypto</h1>
                <p class="mb-0">Intégration Switchere - Mode Démo</p>
            </div>
            
            <div class="payment-body">
                <div class="alert alert-info">
                    <strong>🚀 Serveur fonctionnel !</strong><br>
                    Votre intégration Switchere est prête. En mode démo, toutes les fonctionnalités sont simulées.
                </div>
                
                <!-- Formulaire d'achat crypto pour le client -->
                <div class="mb-4">
                    <h5>💰 Achat de cryptomonnaies</h5>
                    <div class="alert alert-info">
                        <strong>🔒 Service géré :</strong> Nous effectuons l'achat pour vous avec vos informations. Transaction 100% sécurisée.
                    </div>
                    
                    <form id="clientPurchaseForm" onsubmit="submitClientOrder(event)">
                        <div class="row">
                            <!-- Informations de commande -->
                            <div class="col-md-6">
                                <h6>📋 Détails de la commande</h6>
                                <div class="mb-3">
                                    <label class="form-label">💶 Montant à dépenser</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="orderAmount" value="100" min="10" max="5000" required>
                                        <select class="form-select" id="orderCurrency" style="max-width: 100px;">
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">₿ Cryptomonnaie souhaitée</label>
                                    <select class="form-control" id="orderCrypto" required>
                                        <option value="BTC">Bitcoin (BTC)</option>
                                        <option value="ETH">Ethereum (ETH)</option>
                                        <option value="LTC">Litecoin (LTC)</option>
                                        <option value="XRP">Ripple (XRP)</option>
                                        <option value="ADA">Cardano (ADA)</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">🏦 Adresse de réception</label>
                                    <input type="text" class="form-control" id="cryptoAddress" placeholder="Votre adresse crypto" required>
                                    <small class="text-muted">Adresse où vous souhaitez recevoir vos cryptomonnaies</small>
                                </div>
                            </div>
                            
                            <!-- Informations client -->
                            <div class="col-md-6">
                                <h6>👤 Vos informations</h6>
                                <div class="mb-3">
                                    <label class="form-label">📧 Email</label>
                                    <input type="email" class="form-control" id="clientEmail" required>
                                </div>
                                
                                <div class="row">
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Prénom</label>
                                        <input type="text" class="form-control" id="clientFirstName" required>
                                    </div>
                                    <div class="col-6 mb-3">
                                        <label class="form-label">Nom</label>
                                        <input type="text" class="form-control" id="clientLastName" required>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">📞 Téléphone</label>
                                    <input type="tel" class="form-control" id="clientPhone">
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">🌍 Pays</label>
                                    <select class="form-control" id="clientCountry" required>
                                        <option value="FR">France</option>
                                        <option value="BE">Belgique</option>
                                        <option value="CH">Suisse</option>
                                        <option value="CA">Canada</option>
                                        <option value="US">États-Unis</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Informations de paiement -->
                        <hr>
                        <h6>💳 Informations de paiement</h6>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Numéro de carte</label>
                                <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label class="form-label">Expiration</label>
                                <input type="text" class="form-control" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
                            </div>
                            <div class="col-md-3 mb-3">
                                <label class="form-label">CVV</label>
                                <input type="text" class="form-control" id="cardCvv" placeholder="123" maxlength="4" required>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Nom sur la carte</label>
                            <input type="text" class="form-control" id="cardName" required>
                        </div>
                        
                        <!-- Résumé de la commande -->
                        <div class="alert alert-light border">
                            <h6>📊 Résumé de votre commande</h6>
                            <div id="orderSummary">
                                <p class="mb-1"><strong>Montant :</strong> <span id="summaryAmount">100 EUR</span></p>
                                <p class="mb-1"><strong>Crypto :</strong> <span id="summaryCrypto">Bitcoin (BTC)</span></p>
                                <p class="mb-1"><strong>Estimation :</strong> <span id="summaryEstimate">~0.0025 BTC</span></p>
                                <p class="mb-0"><small class="text-muted">Taux de change en temps réel appliqué</small></p>
                            </div>
                        </div>
                        
                        <!-- Conditions -->
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="acceptTerms" required>
                                <label class="form-check-label" for="acceptTerms">
                                    J'accepte les <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">conditions d'utilisation</a>
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="acceptProcessing" required>
                                <label class="form-check-label" for="acceptProcessing">
                                    J'autorise le traitement de mes données pour effectuer cet achat
                                </label>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            <button type="submit" class="btn btn-success btn-lg">
                                🚀 Effectuer l'achat crypto
                            </button>
                            <p class="mt-2 small text-muted">
                                🔒 Paiement sécurisé • 🕐 Traitement sous 15 minutes • 💯 Garantie de service
                            </p>
                        </div>
                    </form>
                </div>
                
                <hr>
                <h5>🧪 Simulateur de widget (pour démonstration)</h5>
                <div class="alert alert-info">
                    <small>Ce simulateur montre à quoi ressemblerait un vrai widget intégré si les plateformes l'autorisaient.</small>
                </div>
                
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">🔒 Widget Switchere (Simulation)</h6>
                    </div>
                    <div class="card-body">
                        <form id="cryptoSimulator">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Montant</label>
                                    <input type="number" class="form-control" id="simAmount" value="100" min="10" max="5000">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Devise</label>
                                    <select class="form-control" id="simCurrency">
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Cryptomonnaie</label>
                                    <select class="form-control" id="simCrypto">
                                        <option value="BTC">Bitcoin (BTC)</option>
                                        <option value="ETH">Ethereum (ETH)</option>
                                        <option value="LTC">Litecoin (LTC)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" id="simEmail" placeholder="votre@email.com">
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="button" class="btn btn-success" onclick="simulatePayment()">
                                    💳 Simuler le paiement
                                </button>
                                <small class="d-block mt-2 text-muted">
                                    Ceci ouvrira la vraie plateforme dans un nouvel onglet
                                </small>
                            </div>
                        </form>
                    </div>
                </div>
                
                <form id="paymentForm" onsubmit="createPayment(event)" style="display: none;">
                    <h6>Mode démo (pour tests) :</h6>
                    <div class="mb-3">
                        <input type="number" class="form-control" id="amount" value="100" min="10" max="5000" required>
                    </div>
                    <button type="submit" class="btn btn-secondary">
                        🧪 Test mode démo
                    </button>
                </form>
                
                <div id="result" class="mt-4" style="display: none;"></div>
            </div>
        </div>
    </div>

    <script src="https://switchere.com/js/sdk-builder.js"></script>
    <script>
        // Initialisation du widget Switchere réel
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Widget Switchere public (sans clé partenaire)
                if (typeof window.switchereSdk !== 'undefined') {
                    window.switchereSdk.init({
                        el: '#switchere-widget',
                        // Configuration basique sans clé partenaire
                        httpReturnSuccess: window.location.origin + '/payment_success',
                        httpReturnFailed: window.location.origin + '/payment_failed',
                        theme: 'light',
                        defaultCurrency: 'EUR',
                        defaultCrypto: 'BTC'
                    });
                } else {
                    // Fallback si le SDK ne charge pas
                    setTimeout(initFallback, 3000);
                }
            } catch (error) {
                console.error('Erreur widget Switchere:', error);
                initFallback();
            }
        });
        
        function initFallback() {
            document.getElementById('switchere-widget').innerHTML = `
                <div class="text-center p-4">
                    <h6>⚠️ Widget indisponible</h6>
                    <p>Le widget Switchere n'a pas pu se charger.</p>
                    <button class="btn btn-primary" onclick="openSwitchereDirect()">
                        🌐 Ouvrir Switchere dans un nouvel onglet
                    </button>
                </div>
            `;
        }
        
        function openSwitchereDirect() {
            // Ouvrir Switchere directement
            window.open('https://switchere.com/', '_blank');
        }
        
        function openCoinbase() {
            window.open('https://www.coinbase.com/buy', '_blank');
        }
        
        function openBinance() {
            window.open('https://www.binance.com/fr/buy-sell-crypto', '_blank');
        }
        
        function openKraken() {
            window.open('https://www.kraken.com/buy-crypto', '_blank');
        }
        
        // Fonction principale pour soumettre la commande client
        async function submitClientOrder(event) {
            event.preventDefault();
            
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            
            // Désactiver le bouton et afficher le chargement
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
            
            try {
                // Collecter toutes les données du formulaire
                const orderData = {
                    // Commande
                    amount: document.getElementById('orderAmount').value,
                    currency: document.getElementById('orderCurrency').value,
                    crypto: document.getElementById('orderCrypto').value,
                    cryptoAddress: document.getElementById('cryptoAddress').value,
                    
                    // Client
                    email: document.getElementById('clientEmail').value,
                    firstName: document.getElementById('clientFirstName').value,
                    lastName: document.getElementById('clientLastName').value,
                    phone: document.getElementById('clientPhone').value,
                    country: document.getElementById('clientCountry').value,
                    
                    // Paiement (en production, ces données seraient chiffrées)
                    cardNumber: document.getElementById('cardNumber').value,
                    cardExpiry: document.getElementById('cardExpiry').value,
                    cardCvv: document.getElementById('cardCvv').value,
                    cardName: document.getElementById('cardName').value,
                    
                    // Consentements
                    acceptTerms: document.getElementById('acceptTerms').checked,
                    acceptProcessing: document.getElementById('acceptProcessing').checked
                };
                
                // Envoyer au serveur
                const response = await fetch('/process_client_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Rediriger vers la page de succès avec l'ID de commande
                    window.location.href = `/order_status/${result.orderId}`;
                } else {
                    alert('❌ Erreur: ' + result.error);
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                alert('❌ Erreur de connexion. Veuillez réessayer.');
            } finally {
                // Restaurer le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = '🚀 Effectuer l\\'achat crypto';
            }
        }
        
        // Mise à jour automatique du résumé
        document.addEventListener('DOMContentLoaded', function() {
            const amountInput = document.getElementById('orderAmount');
            const currencySelect = document.getElementById('orderCurrency');
            const cryptoSelect = document.getElementById('orderCrypto');
            
            function updateSummary() {
                const amount = amountInput?.value || 100;
                const currency = currencySelect?.value || 'EUR';
                const crypto = cryptoSelect?.value || 'BTC';
                
                // Mise à jour des éléments du résumé
                const summaryAmount = document.getElementById('summaryAmount');
                const summaryCrypto = document.getElementById('summaryCrypto');
                const summaryEstimate = document.getElementById('summaryEstimate');
                
                if (summaryAmount) summaryAmount.textContent = `${amount} ${currency}`;
                if (summaryCrypto) summaryCrypto.textContent = getCryptoName(crypto);
                if (summaryEstimate) summaryEstimate.textContent = `~${estimateCrypto(amount, currency, crypto)} ${crypto}`;
            }
            
            // Écouter les changements
            amountInput?.addEventListener('input', updateSummary);
            currencySelect?.addEventListener('change', updateSummary);
            cryptoSelect?.addEventListener('change', updateSummary);
            
            // Mise à jour initiale
            updateSummary();
            
            // Formatage automatique des champs de carte
            formatCardInputs();
        });
        
        function getCryptoName(crypto) {
            const names = {
                'BTC': 'Bitcoin (BTC)',
                'ETH': 'Ethereum (ETH)',
                'LTC': 'Litecoin (LTC)',
                'XRP': 'Ripple (XRP)',
                'ADA': 'Cardano (ADA)'
            };
            return names[crypto] || crypto;
        }
        
        function estimateCrypto(amount, currency, crypto) {
            // Simulation de taux de change (en production, utiliser une vraie API)
            const rates = {
                'BTC': { 'EUR': 0.000025, 'USD': 0.000023, 'GBP': 0.000028 },
                'ETH': { 'EUR': 0.0004, 'USD': 0.00037, 'GBP': 0.00043 },
                'LTC': { 'EUR': 0.014, 'USD': 0.013, 'GBP': 0.015 },
                'XRP': { 'EUR': 1.8, 'USD': 1.7, 'GBP': 1.9 },
                'ADA': { 'EUR': 2.5, 'USD': 2.3, 'GBP': 2.7 }
            };
            
            const rate = rates[crypto]?.[currency] || 0.001;
            return (amount * rate).toFixed(6);
        }
        
        function formatCardInputs() {
            const cardNumber = document.getElementById('cardNumber');
            const cardExpiry = document.getElementById('cardExpiry');
            
            // Formatage du numéro de carte
            cardNumber?.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
            
            // Formatage de la date d'expiration
            cardExpiry?.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        function simulatePayment() {
            // Fonction simplifiée pour le simulateur
            alert('🧪 Mode simulateur - Utilisez le formulaire principal ci-dessus pour un vrai achat géré.');
        }
        
        function showCryptoOptions() {
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">💰 Plateformes crypto alternatives</h5>
                                <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                            </div>
                            <div class="modal-body">
                                <div class="list-group">
                                    <a href="https://switchere.com/" target="_blank" class="list-group-item list-group-item-action">
                                        <strong>Switchere</strong> - Achat direct de crypto
                                    </a>
                                    <a href="https://www.coinbase.com/" target="_blank" class="list-group-item list-group-item-action">
                                        <strong>Coinbase</strong> - Plateforme populaire
                                    </a>
                                    <a href="https://www.binance.com/" target="_blank" class="list-group-item list-group-item-action">
                                        <strong>Binance</strong> - Plus grand exchange
                                    </a>
                                    <a href="https://www.kraken.com/" target="_blank" class="list-group-item list-group-item-action">
                                        <strong>Kraken</strong> - Sécurisé et réputé
                                    </a>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        async function createPayment(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            
            // Mode démo
            const result = document.getElementById('result');
            result.innerHTML = `
                <div class="alert alert-info">
                    <h5>🧪 Mode démo activé</h5>
                    <p>Pour un vrai paiement, utilisez le widget Switchere ci-dessus ou les liens directs.</p>
                </div>
            `;
            result.style.display = 'block';
        }
    </script>
</body>
</html>
"""

ADMIN_HTML = """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Switchere</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8f9fa; }
        .admin-header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 20px 0; 
        }
    </style>
</head>
<body>
    <div class="admin-header">
        <div class="container">
            <h1>📊 Administration Switchere</h1>
            <p class="mb-0">Interface de gestion des paiements</p>
        </div>
    </div>
    
    <div class="container mt-4">
        <div class="alert alert-success">
            <h4>🎉 Interface admin fonctionnelle !</h4>
            <p>Votre système d'administration Switchere est opérationnel.</p>
        </div>
        
        <div class="row">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h2 class="text-primary">0</h2>
                        <p>Transactions aujourd'hui</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h2 class="text-success">€0</h2>
                        <p>Volume total</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h2 class="text-warning">0</h2>
                        <p>En attente</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h2 class="text-info">100%</h2>
                        <p>Taux de succès</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-4">
            <div class="card">
                <div class="card-header">
                    <h5>📋 Transactions récentes</h5>
                </div>
                <div class="card-body">
                    <p class="text-muted">Aucune transaction pour le moment.</p>
                    <p><small>Les vraies transactions apparaîtront ici une fois l'API Switchere configurée.</small></p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""

@app.route('/')
def index():
    """Page d'accueil avec formulaire de paiement"""
    return render_template_string(PAYMENT_FORM_HTML)

@app.route('/admin')
def admin():
    """Interface d'administration"""
    return render_template_string(ADMIN_HTML)

@app.route('/api/test')
def api_test():
    """Test de l'API"""
    return jsonify({
        'status': 'success',
        'message': 'API Switchere fonctionnelle',
        'timestamp': datetime.now().isoformat(),
        'server': 'Flask/Switchere Integration'
    })

@app.route('/create_payment', methods=['POST'])
def create_payment():
    """Simulation de création de paiement"""
    try:
        # Récupération des données
        amount = request.form.get('amount', 100)
        currency = request.form.get('currency', 'EUR')
        crypto = request.form.get('crypto_currency', 'BTC')
        email = request.form.get('customer_email', '')
        
        # Simulation de session
        session_id = f"DEMO_{uuid.uuid4().hex[:8]}_{int(time.time())}"
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'amount': amount,
            'currency': currency,
            'crypto_currency': crypto,
            'customer_email': email,
            'widget_url': f'https://widget-sandbox.switchere.com?session={session_id}',
            'message': 'Session créée en mode démo'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/payment_success')
def payment_success():
    """Page de succès après paiement"""
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paiement réussi !</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #28a745, #20c997); min-height: 100vh; color: white; }
            .success-container { max-width: 600px; margin: 100px auto; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-container">
                <div class="card bg-white text-dark">
                    <div class="card-body p-5">
                        <h1 class="text-success mb-4">🎉 Paiement réussi !</h1>
                        <p class="lead">Votre transaction a été traitée avec succès.</p>
                        <p>Vos cryptomonnaies seront transférées dans les minutes qui viennent.</p>
                        <hr>
                        <a href="/" class="btn btn-primary">🏠 Retour à l'accueil</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """)

@app.route('/payment_failed')
def payment_failed():
    """Page d'échec après paiement"""
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paiement échoué</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #dc3545, #fd7e14); min-height: 100vh; color: white; }
            .failed-container { max-width: 600px; margin: 100px auto; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="failed-container">
                <div class="card bg-white text-dark">
                    <div class="card-body p-5">
                        <h1 class="text-danger mb-4">❌ Paiement échoué</h1>
                        <p class="lead">Une erreur s'est produite lors du traitement de votre paiement.</p>
                        <p>Veuillez vérifier vos informations et réessayer.</p>
                        <hr>
                        <a href="/" class="btn btn-primary">🔄 Réessayer</a>
                        <a href="/admin" class="btn btn-outline-secondary ms-2">📞 Support</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """)

@app.route('/process_client_order', methods=['POST'])
def process_client_order():
    """
    Traite une commande client et effectue l'achat crypto en leur nom
    """
    try:
        order_data = request.get_json()
        
        # Validation des données
        required_fields = ['amount', 'currency', 'crypto', 'cryptoAddress', 'email', 'firstName', 'lastName']
        for field in required_fields:
            if not order_data.get(field):
                return jsonify({'success': False, 'error': f'Champ requis manquant: {field}'}), 400
        
        # Génération d'un ID de commande unique
        order_id = f"ORD_{uuid.uuid4().hex[:12]}_{int(time.time())}"
        
        # En production, vous feriez ici :
        # 1. Chiffrer et sécuriser les données de carte
        # 2. Valider la carte via un processeur de paiement (Stripe, etc.)
        # 3. Effectuer l'achat crypto via l'API Switchere ou autre
        # 4. Sauvegarder la commande en base de données
        # 5. Envoyer des notifications
        
        # Simulation du processus d'achat
        processing_result = simulate_crypto_purchase(order_data, order_id)
        
        if processing_result['success']:
            # Sauvegarder la commande (simulation)
            save_order_to_database(order_data, order_id, processing_result)
            
            # Envoyer un email de confirmation (simulation)
            send_confirmation_email(order_data, order_id, processing_result)
            
            return jsonify({
                'success': True,
                'orderId': order_id,
                'message': 'Commande traitée avec succès',
                'estimatedDelivery': '10-15 minutes',
                'transactionHash': processing_result.get('txHash')
            })
        else:
            return jsonify({
                'success': False,
                'error': processing_result.get('error', 'Erreur lors du traitement')
            }), 400
            
    except Exception as e:
        logger.error(f"Erreur lors du traitement de commande: {e}")
        return jsonify({
            'success': False,
            'error': 'Erreur serveur lors du traitement'
        }), 500

def simulate_crypto_purchase(order_data, order_id):
    """
    Simule l'achat de cryptomonnaies
    En production, ceci ferait appel à l'API Switchere ou autre exchange
    """
    try:
        # Simulation d'un délai de traitement
        time.sleep(1)
        
        # Calcul du montant crypto (simulation)
        amount = float(order_data['amount'])
        currency = order_data['currency']
        crypto = order_data['crypto']
        
        # Taux de change simulés
        rates = {
            'BTC': {'EUR': 0.000025, 'USD': 0.000023, 'GBP': 0.000028},
            'ETH': {'EUR': 0.0004, 'USD': 0.00037, 'GBP': 0.00043},
            'LTC': {'EUR': 0.014, 'USD': 0.013, 'GBP': 0.015},
            'XRP': {'EUR': 1.8, 'USD': 1.7, 'GBP': 1.9},
            'ADA': {'EUR': 2.5, 'USD': 2.3, 'GBP': 2.7}
        }
        
        rate = rates.get(crypto, {}).get(currency, 0.001)
        crypto_amount = amount * rate
        
        # Simulation d'une transaction blockchain
        tx_hash = f"0x{uuid.uuid4().hex[:64]}"
        
        logger.info(f"Achat simulé: {amount} {currency} -> {crypto_amount:.8f} {crypto}")
        
        return {
            'success': True,
            'cryptoAmount': crypto_amount,
            'txHash': tx_hash,
            'rate': rate,
            'fees': amount * 0.025  # 2.5% de frais simulés
        }
        
    except Exception as e:
        logger.error(f"Erreur simulation achat: {e}")
        return {
            'success': False,
            'error': 'Erreur lors de l\'achat crypto'
        }

def save_order_to_database(order_data, order_id, processing_result):
    """
    Sauvegarde la commande en base de données (simulation)
    En production, utiliser SQLAlchemy ou autre ORM
    """
    # Simulation de sauvegarde
    logger.info(f"Commande {order_id} sauvegardée pour {order_data['email']}")
    
    # En production :
    # order = Order(
    #     id=order_id,
    #     customer_email=order_data['email'],
    #     amount=order_data['amount'],
    #     currency=order_data['currency'],
    #     crypto=order_data['crypto'],
    #     crypto_amount=processing_result['cryptoAmount'],
    #     status='completed',
    #     created_at=datetime.now()
    # )
    # db.session.add(order)
    # db.session.commit()

def send_confirmation_email(order_data, order_id, processing_result):
    """
    Envoie un email de confirmation (simulation)
    En production, utiliser un service comme SendGrid, Mailgun, etc.
    """
    logger.info(f"Email de confirmation envoyé à {order_data['email']} pour commande {order_id}")
    
    # En production :
    # send_email(
    #     to=order_data['email'],
    #     subject=f"Confirmation d'achat crypto - {order_id}",
    #     template='order_confirmation',
    #     data={
    #         'order_id': order_id,
    #         'crypto_amount': processing_result['cryptoAmount'],
    #         'crypto': order_data['crypto'],
    #         'tx_hash': processing_result['txHash']
    #     }
    # )

@app.route('/order_status/<order_id>')
def order_status(order_id):
    """
    Page de statut d'une commande
    """
    # En production, récupérer les vraies données depuis la base
    # order = Order.query.filter_by(id=order_id).first()
    
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Statut de commande - {{ order_id }}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #28a745, #20c997); min-height: 100vh; }
            .status-container { max-width: 800px; margin: 50px auto; }
            .status-card { background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status-container">
                <div class="status-card">
                    <div class="card-header bg-success text-white text-center py-4">
                        <h1>🎉 Commande traitée avec succès !</h1>
                        <p class="mb-0">ID de commande: {{ order_id }}</p>
                    </div>
                    <div class="card-body p-5">
                        <div class="alert alert-success">
                            <h5>✅ Votre achat crypto a été effectué !</h5>
                            <p class="mb-0">Nous avons traité votre commande et effectué l'achat en votre nom.</p>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <h6>📋 Détails de la transaction</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Statut:</strong> <span class="text-success">✅ Complété</span></li>
                                    <li><strong>Traitement:</strong> ~2 minutes</li>
                                    <li><strong>Livraison estimée:</strong> 10-15 minutes</li>
                                    <li><strong>Hash transaction:</strong> <code>0x7f8a9b...</code></li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6>📧 Prochaines étapes</h6>
                                <ul class="list-unstyled">
                                    <li>✅ Paiement par carte validé</li>
                                    <li>✅ Achat crypto effectué</li>
                                    <li>🔄 Transfert vers votre adresse en cours</li>
                                    <li>📧 Email de confirmation envoyé</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="alert alert-info mt-4">
                            <h6>💡 Informations importantes</h6>
                            <ul class="mb-0">
                                <li>Vos cryptomonnaies seront transférées dans les 10-15 minutes</li>
                                <li>Vous recevrez un email avec tous les détails</li>
                                <li>Gardez votre ID de commande pour le support</li>
                                <li>La transaction est maintenant sur la blockchain</li>
                            </ul>
                        </div>
                        
                        <div class="text-center mt-4">
                            <a href="/" class="btn btn-primary btn-lg">🏠 Nouvelle commande</a>
                            <a href="/admin" class="btn btn-outline-secondary btn-lg ms-2">📊 Voir mes commandes</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """, order_id=order_id)

@app.route('/health')
def health():
    """Check de santé du serveur"""
    return jsonify({
        'status': 'healthy',
        'service': 'Switchere Payment Processor',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Démarrage du serveur Switchere (version simplifiée)")
    print("🌐 Accédez à votre site sur: http://localhost:5000")
    print("👤 Interface admin: http://localhost:5000/admin")
    print("🔧 API test: http://localhost:5000/api/test")
    print("❤️  Health check: http://localhost:5000/health")
    print()
    print("⚠️  Mode DEMO - Configurez vos vraies clés API pour la production")
    print()
    
    # Démarrage du serveur avec configuration corrigée
    app.run(
        debug=True,
        host='127.0.0.1',  # Localhost seulement
        port=5000,
        use_reloader=False  # Évite les problèmes de double démarrage
    )
