#!/usr/bin/env python3
"""
Intégration Switchere comme processeur de paiement
Solution complète pour intégrer Switchere sur votre site web
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import requests
import json
import hashlib
import hmac
import time
import uuid
from datetime import datetime
import logging
from typing import Dict, Any, Optional

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'your_secret_key_change_this'

class SwitcherePaymentProcessor:
    """
    Processeur de paiement Switchere pour intégration web
    """
    
    def __init__(self, api_key: str, secret_key: str, partner_id: str, sandbox: bool = True):
        """
        Initialise le processeur de paiement
        
        Args:
            api_key: Clé API Switchere
            secret_key: Clé secrète pour signatures
            partner_id: ID partenaire Switchere
            sandbox: Mode sandbox (True pour tests)
        """
        self.api_key = api_key
        self.secret_key = secret_key
        self.partner_id = partner_id
        self.sandbox = sandbox
        
        # URLs selon l'environnement
        if sandbox:
            self.api_base_url = "https://api-sandbox.switchere.com"
            self.widget_url = "https://widget-sandbox.switchere.com"
        else:
            self.api_base_url = "https://api.switchere.com"
            self.widget_url = "https://widget.switchere.com"
    
    def generate_signature(self, method: str, endpoint: str, params: Dict = None, body: str = "") -> tuple:
        """
        Génère la signature pour l'authentification API
        """
        timestamp = str(int(time.time()))
        
        params_str = ""
        if params:
            params_str = "&".join([f"{k}={v}" for k, v in sorted(params.items())])
        
        string_to_sign = f"{method}\n{endpoint}\n{params_str}\n{body}\n{timestamp}"
        
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature, timestamp
    
    def create_payment_session(self, amount: float, currency: str, crypto_currency: str, 
                             customer_email: str, order_id: str, return_url: str) -> Dict:
        """
        Crée une session de paiement Switchere
        
        Args:
            amount: Montant à payer
            currency: Devise (EUR, USD, etc.)
            crypto_currency: Cryptomonnaie cible (BTC, ETH, etc.)
            customer_email: Email du client
            order_id: ID de commande unique
            return_url: URL de retour après paiement
            
        Returns:
            Données de la session de paiement
        """
        endpoint = "/api/v2/payment/session"
        
        data = {
            "partnerId": self.partner_id,
            "orderId": order_id,
            "amount": amount,
            "currency": currency,
            "cryptoCurrency": crypto_currency,
            "customer": {
                "email": customer_email
            },
            "returnUrl": return_url,
            "webhookUrl": f"{return_url}/webhook",  # URL pour notifications
            "metadata": {
                "integration": "custom_website",
                "timestamp": datetime.now().isoformat()
            }
        }
        
        body = json.dumps(data)
        signature, timestamp = self.generate_signature("POST", endpoint, body=body)
        
        headers = {
            'Content-Type': 'application/json',
            'X-API-KEY': self.api_key,
            'X-SIGNATURE': signature,
            'X-TIMESTAMP': timestamp
        }
        
        try:
            response = requests.post(
                f"{self.api_base_url}{endpoint}",
                data=body,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Erreur lors de la création de session: {e}")
            raise
    
    def get_payment_status(self, session_id: str) -> Dict:
        """
        Récupère le statut d'un paiement
        
        Args:
            session_id: ID de la session de paiement
            
        Returns:
            Statut du paiement
        """
        endpoint = f"/api/v2/payment/session/{session_id}"
        
        signature, timestamp = self.generate_signature("GET", endpoint)
        
        headers = {
            'X-API-KEY': self.api_key,
            'X-SIGNATURE': signature,
            'X-TIMESTAMP': timestamp
        }
        
        try:
            response = requests.get(
                f"{self.api_base_url}{endpoint}",
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Erreur lors de la récupération du statut: {e}")
            raise
    
    def generate_widget_url(self, session_id: str) -> str:
        """
        Génère l'URL du widget de paiement
        
        Args:
            session_id: ID de la session de paiement
            
        Returns:
            URL du widget
        """
        return f"{self.widget_url}?session={session_id}"

# Instance globale du processeur (à configurer avec vos vraies clés)
processor = SwitcherePaymentProcessor(
    api_key="your_api_key_here",
    secret_key="your_secret_key_here",
    partner_id="your_partner_id_here",
    sandbox=True
)

# Routes Flask pour l'intégration

@app.route('/')
def index():
    """Page d'accueil avec formulaire de paiement"""
    return render_template('payment_form.html')

@app.route('/create_payment', methods=['POST'])
def create_payment():
    """
    Crée une nouvelle session de paiement
    """
    try:
        # Récupération des données du formulaire
        amount = float(request.form.get('amount', 0))
        currency = request.form.get('currency', 'EUR')
        crypto_currency = request.form.get('crypto_currency', 'BTC')
        customer_email = request.form.get('customer_email', '')
        
        # Validation des données
        if amount <= 0:
            return jsonify({'error': 'Montant invalide'}), 400
        
        if not customer_email:
            return jsonify({'error': 'Email requis'}), 400
        
        # Génération d'un ID de commande unique
        order_id = f"ORDER_{uuid.uuid4().hex[:8]}_{int(time.time())}"
        
        # URL de retour
        return_url = request.url_root + 'payment_result'
        
        # Création de la session de paiement
        session_data = processor.create_payment_session(
            amount=amount,
            currency=currency,
            crypto_currency=crypto_currency,
            customer_email=customer_email,
            order_id=order_id,
            return_url=return_url
        )
        
        # Génération de l'URL du widget
        widget_url = processor.generate_widget_url(session_data['sessionId'])
        
        logger.info(f"Session de paiement créée: {order_id}")
        
        return jsonify({
            'success': True,
            'session_id': session_data['sessionId'],
            'widget_url': widget_url,
            'order_id': order_id
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la création du paiement: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/payment_widget/<session_id>')
def payment_widget(session_id):
    """
    Page avec le widget de paiement intégré
    """
    widget_url = processor.generate_widget_url(session_id)
    return render_template('payment_widget.html', 
                         widget_url=widget_url, 
                         session_id=session_id)

@app.route('/payment_result')
def payment_result():
    """
    Page de résultat après paiement
    """
    session_id = request.args.get('session_id')
    status = request.args.get('status', 'unknown')
    
    if session_id:
        try:
            # Vérification du statut réel via API
            payment_status = processor.get_payment_status(session_id)
            return render_template('payment_result.html', 
                                 session_id=session_id,
                                 status=payment_status.get('status', status),
                                 payment_data=payment_status)
        except Exception as e:
            logger.error(f"Erreur lors de la vérification du statut: {e}")
    
    return render_template('payment_result.html', 
                         session_id=session_id, 
                         status=status)

@app.route('/webhook', methods=['POST'])
def webhook_handler():
    """
    Gestionnaire de webhooks pour les notifications Switchere
    """
    try:
        # Récupération des données du webhook
        webhook_data = request.get_json()
        
        # Vérification de la signature (recommandé en production)
        # signature = request.headers.get('X-Signature')
        # if not verify_webhook_signature(webhook_data, signature):
        #     return jsonify({'error': 'Signature invalide'}), 401
        
        # Traitement selon le type d'événement
        event_type = webhook_data.get('event_type')
        session_id = webhook_data.get('session_id')
        
        logger.info(f"Webhook reçu: {event_type} pour session {session_id}")
        
        if event_type == 'payment_completed':
            # Paiement complété avec succès
            handle_payment_completed(webhook_data)
        elif event_type == 'payment_failed':
            # Paiement échoué
            handle_payment_failed(webhook_data)
        elif event_type == 'payment_pending':
            # Paiement en attente
            handle_payment_pending(webhook_data)
        
        return jsonify({'status': 'received'}), 200
        
    except Exception as e:
        logger.error(f"Erreur dans le webhook: {e}")
        return jsonify({'error': 'Erreur serveur'}), 500

def handle_payment_completed(webhook_data):
    """Traite un paiement complété"""
    session_id = webhook_data.get('session_id')
    order_id = webhook_data.get('order_id')
    
    logger.info(f"Paiement complété: {order_id}")
    
    # Ici vous pouvez :
    # - Mettre à jour votre base de données
    # - Envoyer un email de confirmation
    # - Déclencher la livraison du produit/service
    # - Etc.

def handle_payment_failed(webhook_data):
    """Traite un paiement échoué"""
    session_id = webhook_data.get('session_id')
    order_id = webhook_data.get('order_id')
    error_reason = webhook_data.get('error_reason')
    
    logger.warning(f"Paiement échoué: {order_id} - Raison: {error_reason}")
    
    # Traitement des échecs de paiement

def handle_payment_pending(webhook_data):
    """Traite un paiement en attente"""
    session_id = webhook_data.get('session_id')
    order_id = webhook_data.get('order_id')
    
    logger.info(f"Paiement en attente: {order_id}")
    
    # Traitement des paiements en attente

@app.route('/admin/payments')
def admin_payments():
    """
    Interface d'administration pour voir les paiements
    """
    # En production, ajoutez une authentification admin
    return render_template('admin_payments.html')

if __name__ == '__main__':
    print("🚀 Démarrage du serveur Switchere Payment Processor")
    print("📝 N'oubliez pas de configurer vos clés API !")
    print("🌐 Interface disponible sur: http://localhost:5000")
    
    # Création des templates s'ils n'existent pas
    import os
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    app.run(debug=True, host='0.0.0.0', port=5000)
