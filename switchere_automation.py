#!/usr/bin/env python3
"""
Script d'automatisation pour Switchere.com
Ce script automatise les étapes préparatoires pour un achat de cryptomonnaies
tout en respectant les mesures de sécurité et les conditions d'utilisation.
"""

import requests
import json
import time
import hashlib
import hmac
from datetime import datetime
from typing import Dict, Any, Optional
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SwitchereAutomation:
    """
    Classe pour automatiser les interactions avec l'API Switchere
    """
    
    def __init__(self, api_key: str, secret_key: str, sandbox: bool = True):
        """
        Initialise l'automation Switchere
        
        Args:
            api_key: Clé API Switchere
            secret_key: Clé secrète pour la signature
            sandbox: True pour utiliser l'environnement de test
        """
        self.api_key = api_key
        self.secret_key = secret_key
        self.base_url = "https://api-sandbox.switchere.com" if sandbox else "https://api.switchere.com"
        self.session = requests.Session()
        
        # Headers par défaut
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'SwitchereAutomation/1.0'
        })
    
    def _generate_signature(self, method: str, endpoint: str, params: Dict = None, body: str = "") -> str:
        """
        Génère la signature requise pour l'authentification API
        
        Args:
            method: Méthode HTTP (GET, POST, etc.)
            endpoint: Endpoint de l'API
            params: Paramètres de requête
            body: Corps de la requête
            
        Returns:
            Signature HMAC-SHA256
        """
        timestamp = str(int(time.time()))
        
        # Construction de la chaîne à signer
        params_str = ""
        if params:
            params_str = "&".join([f"{k}={v}" for k, v in sorted(params.items())])
        
        string_to_sign = f"{method}\n{endpoint}\n{params_str}\n{body}\n{timestamp}"
        
        # Génération de la signature
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            string_to_sign.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature, timestamp
    
    def _make_request(self, method: str, endpoint: str, params: Dict = None, data: Dict = None) -> Dict:
        """
        Effectue une requête authentifiée vers l'API
        
        Args:
            method: Méthode HTTP
            endpoint: Endpoint de l'API
            params: Paramètres de requête
            data: Données à envoyer
            
        Returns:
            Réponse de l'API
        """
        url = f"{self.base_url}{endpoint}"
        body = json.dumps(data) if data else ""
        
        signature, timestamp = self._generate_signature(method, endpoint, params, body)
        
        headers = {
            'X-API-KEY': self.api_key,
            'X-SIGNATURE': signature,
            'X-TIMESTAMP': timestamp
        }
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, params=params, headers=headers)
            elif method.upper() == 'POST':
                response = self.session.post(url, data=body, headers=headers)
            else:
                raise ValueError(f"Méthode HTTP non supportée: {method}")
            
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Erreur lors de la requête API: {e}")
            raise
    
    def get_exchange_rates(self, from_currency: str = "EUR", to_currency: str = "BTC") -> Dict:
        """
        Récupère les taux de change actuels
        
        Args:
            from_currency: Devise source (EUR, USD, etc.)
            to_currency: Cryptomonnaie cible (BTC, ETH, etc.)
            
        Returns:
            Taux de change et informations
        """
        logger.info(f"Récupération du taux de change {from_currency} -> {to_currency}")
        
        params = {
            'from': from_currency,
            'to': to_currency
        }
        
        return self._make_request('GET', '/api/v2/exchange/rate', params=params)
    
    def get_supported_currencies(self) -> Dict:
        """
        Récupère la liste des devises supportées
        
        Returns:
            Liste des devises supportées
        """
        logger.info("Récupération des devises supportées")
        return self._make_request('GET', '/api/v2/currencies')
    
    def create_quote(self, from_currency: str, to_currency: str, amount: float, 
                    amount_type: str = "from") -> Dict:
        """
        Crée un devis pour un échange
        
        Args:
            from_currency: Devise source
            to_currency: Cryptomonnaie cible
            amount: Montant
            amount_type: Type de montant ("from" ou "to")
            
        Returns:
            Informations du devis
        """
        logger.info(f"Création d'un devis: {amount} {from_currency} -> {to_currency}")
        
        data = {
            'from': from_currency,
            'to': to_currency,
            'amount': amount,
            'amountType': amount_type
        }
        
        return self._make_request('POST', '/api/v2/exchange/quote', data=data)
    
    def get_payment_methods(self, currency: str = "EUR") -> Dict:
        """
        Récupère les méthodes de paiement disponibles
        
        Args:
            currency: Devise pour laquelle récupérer les méthodes
            
        Returns:
            Méthodes de paiement disponibles
        """
        logger.info(f"Récupération des méthodes de paiement pour {currency}")
        
        params = {'currency': currency}
        return self._make_request('GET', '/api/v2/payment-methods', params=params)
    
    def prepare_order_data(self, quote_id: str, customer_email: str, 
                          payment_method: str, crypto_address: str) -> Dict:
        """
        Prépare les données pour créer une commande
        
        Args:
            quote_id: ID du devis
            customer_email: Email du client
            payment_method: Méthode de paiement choisie
            crypto_address: Adresse de réception des cryptomonnaies
            
        Returns:
            Données préparées pour la commande
        """
        logger.info("Préparation des données de commande")
        
        order_data = {
            'quoteId': quote_id,
            'customer': {
                'email': customer_email
            },
            'paymentMethod': payment_method,
            'cryptoAddress': crypto_address
        }
        
        return order_data
    
    def simulate_order_creation(self, order_data: Dict) -> Dict:
        """
        Simule la création d'une commande (pour les tests)
        
        Args:
            order_data: Données de la commande
            
        Returns:
            Simulation de la réponse
        """
        logger.info("🚨 SIMULATION: Création de commande (pas d'achat réel)")
        
        simulated_response = {
            'status': 'simulation',
            'message': 'Commande simulée - aucun achat réel effectué',
            'order_id': f"SIM_{int(time.time())}",
            'data': order_data,
            'next_steps': [
                "1. Vérification manuelle requise par l'utilisateur",
                "2. Authentification 3D Secure nécessaire",
                "3. Confirmation finale par l'utilisateur"
            ]
        }
        
        return simulated_response

def main():
    """
    Fonction principale pour démontrer l'utilisation
    """
    print("🔄 Démarrage de l'automatisation Switchere")
    print("⚠️  ATTENTION: Ce script respecte les conditions d'utilisation")
    print("⚠️  Les achats nécessitent une validation manuelle pour la sécurité")
    print()
    
    # Configuration (remplacez par vos vraies clés API)
    API_KEY = "your_api_key_here"
    SECRET_KEY = "your_secret_key_here"
    
    if API_KEY == "your_api_key_here":
        print("❌ Veuillez configurer vos clés API dans le script")
        print("📖 Consultez https://developer.switchere.com pour obtenir vos clés")
        return
    
    try:
        # Initialisation
        automation = SwitchereAutomation(API_KEY, SECRET_KEY, sandbox=True)
        
        # 1. Récupération des devises supportées
        print("📋 Récupération des devises supportées...")
        currencies = automation.get_supported_currencies()
        print(f"✅ {len(currencies.get('data', []))} devises disponibles")
        
        # 2. Vérification des taux de change
        print("\n💱 Vérification des taux de change EUR -> BTC...")
        rates = automation.get_exchange_rates("EUR", "BTC")
        print(f"✅ Taux actuel: {rates.get('rate', 'N/A')}")
        
        # 3. Création d'un devis
        print("\n📊 Création d'un devis pour 100 EUR...")
        quote = automation.create_quote("EUR", "BTC", 100.0)
        print(f"✅ Devis créé: ID {quote.get('id', 'N/A')}")
        
        # 4. Récupération des méthodes de paiement
        print("\n💳 Récupération des méthodes de paiement...")
        payment_methods = automation.get_payment_methods("EUR")
        print(f"✅ {len(payment_methods.get('data', []))} méthodes disponibles")
        
        # 5. Préparation des données de commande
        print("\n📝 Préparation des données de commande...")
        order_data = automation.prepare_order_data(
            quote_id=quote.get('id', 'test_quote'),
            customer_email="test@example.com",
            payment_method="card",
            crypto_address="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
        )
        
        # 6. Simulation de création de commande
        print("\n🔄 Simulation de création de commande...")
        result = automation.simulate_order_creation(order_data)
        
        print("\n" + "="*50)
        print("📋 RÉSULTAT DE LA SIMULATION:")
        print("="*50)
        print(f"Statut: {result['status']}")
        print(f"Message: {result['message']}")
        print(f"ID Commande: {result['order_id']}")
        print("\n📝 Étapes suivantes requises:")
        for step in result['next_steps']:
            print(f"   {step}")
        
        print("\n" + "="*50)
        print("⚠️  IMPORTANT:")
        print("• Ce script automatise uniquement les étapes préparatoires")
        print("• L'achat final nécessite une validation manuelle")
        print("• Respectez toujours les conditions d'utilisation")
        print("• Utilisez l'environnement sandbox pour les tests")
        print("="*50)
        
    except Exception as e:
        logger.error(f"Erreur lors de l'exécution: {e}")
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    main()
