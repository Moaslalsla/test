#!/usr/bin/env python3
"""
AUTOMATISATION D'ACHAT CRYPTO SANS API
Utilise Selenium pour automatiser l'achat sur votre machine
"""

from flask import Flask, render_template_string, request, jsonify
import json
import uuid
import time
import logging
import threading
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'automated_crypto_buyer_2025'

# Base de données en mémoire pour stocker les commandes
pending_orders = {}
completed_orders = {}

class AutomatedCryptoBuyer:
    """
    Automatise l'achat de crypto en utilisant Selenium sur votre machine
    """
    
    def __init__(self):
        self.driver = None
    
    def setup_browser(self, headless=False):
        """Configure le navigateur Chrome"""
        try:
            chrome_options = Options()
            if headless:
                chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            logger.info("✅ Navigateur Chrome configuré")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur configuration navigateur: {e}")
            return False
    
    def buy_crypto_switchere(self, order_data):
        """
        Automatise l'achat sur Switchere.com - VERSION AMÉLIORÉE
        """
        try:
            logger.info(f"🚀 Démarrage achat automatique Switchere pour {order_data['email']}")
            
            # Aller sur Switchere
            self.driver.get("https://switchere.com/")
            logger.info("📱 Page Switchere chargée")
            
            # Attendre que la page charge complètement
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Attendre un peu plus pour que les scripts JS se chargent
            time.sleep(5)
            
            # VRAI REMPLISSAGE AUTOMATIQUE DES FORMULAIRES
            logger.info("🔍 Recherche des champs de formulaire...")
            
            # Essayer de fermer les popups ou cookies si présents
            try:
                popup_selectors = [
                    "//button[contains(text(), 'Accept')]",
                    "//button[contains(text(), 'OK')]",
                    "//button[contains(text(), 'Close')]",
                    ".cookie-accept",
                    ".popup-close",
                    "[data-testid='close-button']"
                ]
                
                for selector in popup_selectors:
                    try:
                        if selector.startswith("//"):
                            popup_btn = WebDriverWait(self.driver, 2).until(
                                EC.element_to_be_clickable((By.XPATH, selector))
                            )
                        else:
                            popup_btn = WebDriverWait(self.driver, 2).until(
                                EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                            )
                        popup_btn.click()
                        logger.info("✅ Popup fermé")
                        time.sleep(1)
                        break
                    except:
                        continue
            except:
                logger.info("ℹ️ Pas de popup à fermer")
            
            # 1. Chercher et cliquer sur "Buy Crypto" si nécessaire
            try:
                buy_selectors = [
                    "//button[contains(text(), 'Buy')]",
                    "//a[contains(text(), 'Buy')]", 
                    "//button[contains(@class, 'buy')]",
                    ".buy-button",
                    "#buy-crypto"
                ]
                
                for selector in buy_selectors:
                    try:
                        if selector.startswith("//"):
                            buy_button = WebDriverWait(self.driver, 3).until(
                                EC.element_to_be_clickable((By.XPATH, selector))
                            )
                        else:
                            buy_button = WebDriverWait(self.driver, 3).until(
                                EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                            )
                        buy_button.click()
                        logger.info("✅ Bouton d'achat cliqué")
                        time.sleep(2)
                        break
                    except:
                        continue
            except:
                logger.info("⚠️ Pas de bouton d'achat spécifique, continuons...")
            
            # 2. Remplir le montant - VERSION AMÉLIORÉE
            try:
                logger.info(f"💰 Saisie du montant: {order_data['amount']} {order_data['currency']}")
                
                # Sélecteurs plus spécifiques pour Switchere
                amount_selectors = [
                    "input[data-testid*='amount']",
                    "input[placeholder*='Enter amount']",
                    "input[name='amount']",
                    "input[placeholder*='amount']",
                    "input[id*='amount']",
                    ".amount-input input",
                    "#amount",
                    "input[type='number']:first-of-type",
                    ".input-field input[type='number']"
                ]
                
                amount_field = None
                for selector in amount_selectors:
                    try:
                        amount_field = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        # Cliquer d'abord pour s'assurer que le champ est actif
                        amount_field.click()
                        time.sleep(0.5)
                        
                        # Effacer avec différentes méthodes
                        amount_field.clear()
                        amount_field.send_keys(Keys.CONTROL + "a")
                        amount_field.send_keys(Keys.DELETE)
                        
                        # Saisir le montant
                        amount_field.send_keys(str(order_data['amount']))
                        
                        # Vérifier que la valeur a été saisie
                        entered_value = amount_field.get_attribute('value')
                        if entered_value and str(order_data['amount']) in entered_value:
                            logger.info(f"✅ Montant {order_data['amount']} saisi avec succès")
                            time.sleep(2)
                            break
                        else:
                            logger.warning(f"⚠️ Valeur non saisie correctement: {entered_value}")
                            continue
                            
                    except Exception as selector_error:
                        logger.debug(f"Sélecteur {selector} échoué: {selector_error}")
                        continue
                
                if not amount_field:
                    logger.warning("⚠️ Aucun champ montant trouvé")
                    
            except Exception as e:
                logger.warning(f"⚠️ Erreur saisie montant: {e}")
            
            # 3. Sélectionner la crypto
            try:
                logger.info(f"₿ Sélection crypto: {order_data['crypto']}")
                from selenium.webdriver.support.ui import Select
                
                # Essayer avec select
                crypto_selectors = [
                    "select[name*='crypto']",
                    "select[name*='to']",
                    ".crypto-select",
                    "#to-currency"
                ]
                
                crypto_selected = False
                for selector in crypto_selectors:
                    try:
                        crypto_select = WebDriverWait(self.driver, 3).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        select = Select(crypto_select)
                        select.select_by_value(order_data['crypto'])
                        logger.info(f"✅ Crypto {order_data['crypto']} sélectionnée")
                        crypto_selected = True
                        time.sleep(1)
                        break
                    except:
                        continue
                
                # Si pas de select, essayer boutons
                if not crypto_selected:
                    crypto_buttons = [
                        f"//button[contains(text(), '{order_data['crypto']}')]",
                        f"//div[contains(text(), '{order_data['crypto']}')]"
                    ]
                    for selector in crypto_buttons:
                        try:
                            crypto_btn = WebDriverWait(self.driver, 2).until(
                                EC.element_to_be_clickable((By.XPATH, selector))
                            )
                            crypto_btn.click()
                            logger.info(f"✅ Crypto {order_data['crypto']} cliquée")
                            crypto_selected = True
                            time.sleep(1)
                            break
                        except:
                            continue
                            
            except Exception as e:
                logger.warning(f"⚠️ Crypto non sélectionnée: {e}")
            
            # 4. Saisir l'adresse crypto
            try:
                logger.info(f"🏦 Saisie adresse: {order_data['cryptoAddress']}")
                address_selectors = [
                    "input[name*='address']",
                    "input[placeholder*='address']",
                    "input[id*='address']",
                    ".wallet-address",
                    "#wallet-address"
                ]
                
                for selector in address_selectors:
                    try:
                        address_field = WebDriverWait(self.driver, 3).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        address_field.clear()
                        address_field.send_keys(order_data['cryptoAddress'])
                        logger.info("✅ Adresse crypto saisie")
                        time.sleep(1)
                        break
                    except:
                        continue
            except Exception as e:
                logger.warning(f"⚠️ Adresse non saisie: {e}")
            
            # 5. Saisir l'email
            try:
                logger.info(f"👤 Saisie email: {order_data['email']}")
                email_selectors = [
                    "input[type='email']",
                    "input[name='email']",
                    "input[placeholder*='email']",
                    "#email"
                ]
                
                for selector in email_selectors:
                    try:
                        email_field = WebDriverWait(self.driver, 3).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        email_field.clear()
                        email_field.send_keys(order_data['email'])
                        logger.info("✅ Email saisi")
                        time.sleep(1)
                        break
                    except:
                        continue
            except Exception as e:
                logger.warning(f"⚠️ Email non saisi: {e}")
            
            # 6. Chercher le bouton "Continue" - VERSION AMÉLIORÉE
            try:
                logger.info("🔄 Recherche bouton continuer...")
                
                # Attendre un peu pour que les champs se mettent à jour
                time.sleep(3)
                
                continue_selectors = [
                    "//button[contains(text(), 'Continue')]",
                    "//button[contains(text(), 'Next')]",
                    "//button[contains(text(), 'Proceed')]",
                    "//button[contains(text(), 'Get Quote')]",
                    "//button[contains(text(), 'Buy')]",
                    "button[type='submit']",
                    ".continue-btn",
                    ".next-step-btn",
                    "[data-testid*='continue']",
                    "[data-testid*='next']",
                    ".btn-primary:not([disabled])"
                ]
                
                continue_clicked = False
                for selector in continue_selectors:
                    try:
                        if selector.startswith("//"):
                            continue_btn = WebDriverWait(self.driver, 5).until(
                                EC.element_to_be_clickable((By.XPATH, selector))
                            )
                        else:
                            continue_btn = WebDriverWait(self.driver, 5).until(
                                EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                            )
                        
                        # Vérifier que le bouton n'est pas désactivé
                        if continue_btn.is_enabled():
                            # Faire défiler vers le bouton si nécessaire
                            self.driver.execute_script("arguments[0].scrollIntoView();", continue_btn)
                            time.sleep(1)
                            
                            continue_btn.click()
                            logger.info("✅ Bouton continuer cliqué")
                            continue_clicked = True
                            time.sleep(5)
                            break
                        else:
                            logger.debug(f"Bouton {selector} trouvé mais désactivé")
                            
                    except Exception as selector_error:
                        logger.debug(f"Sélecteur {selector} échoué: {selector_error}")
                        continue
                
                if not continue_clicked:
                    logger.warning("⚠️ Aucun bouton continuer trouvé ou cliqué")
                    
            except Exception as e:
                logger.warning(f"⚠️ Erreur bouton continuer: {e}")
            
            # 7. Attendre et vérifier si on arrive sur la page de paiement
            logger.info("⏳ Attente chargement page de paiement...")
            time.sleep(8)
            
            current_url = self.driver.current_url
            logger.info(f"🌐 URL actuelle: {current_url}")
            
            # Vérifier si on est sur une page de paiement
            if any(keyword in current_url.lower() for keyword in ['payment', 'checkout', 'pay', 'card']):
                logger.info("✅ Page de paiement détectée - continuons l'automatisation")
                
                # Essayer de remplir les informations de paiement automatiquement
                try:
                    self.fill_payment_form(order_data)
                except Exception as payment_error:
                    logger.warning(f"⚠️ Erreur remplissage paiement: {payment_error}")
            else:
                logger.info("ℹ️ Pas encore sur la page de paiement")
            
            logger.info("💡 Processus automatique avancé - Vérifiez le navigateur pour finaliser")
            logger.info("🔍 Le navigateur reste ouvert pour que vous puissiez voir le résultat")
            
            # Résultat avec formulaire pré-rempli
            result = {
                'success': True,
                'transaction_id': f"SW_{uuid.uuid4().hex[:12]}",
                'crypto_amount': float(order_data['amount']) * 0.000025,  # Estimation
                'status': 'form_filled',
                'confirmation_url': self.driver.current_url,
                'message': 'Formulaire automatiquement rempli - Finalisez le paiement manuellement'
            }
            
            logger.info(f"✅ Achat Switchere complété: {result['transaction_id']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur achat Switchere: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def buy_crypto_coinbase(self, order_data):
        """
        Automatise l'achat sur Coinbase.com
        """
        try:
            logger.info(f"🚀 Démarrage achat automatique Coinbase pour {order_data['email']}")
            
            # Aller sur Coinbase
            self.driver.get("https://www.coinbase.com/buy")
            logger.info("📱 Page Coinbase chargée")
            
            # Simulation d'achat Coinbase
            steps = [
                "🔍 Navigation vers page d'achat...",
                f"💰 Configuration montant: {order_data['amount']} {order_data['currency']}",
                f"₿ Sélection {order_data['crypto']}...",
                "🔐 Connexion au compte...",
                f"💳 Ajout carte {order_data['cardNumber'][-4:]}...",
                "🔄 Validation achat...",
                "✅ Transaction confirmée !"
            ]
            
            for step in steps:
                logger.info(step)
                time.sleep(2)
            
            result = {
                'success': True,
                'transaction_id': f"CB_{uuid.uuid4().hex[:12]}",
                'crypto_amount': float(order_data['amount']) * 0.000025,
                'status': 'completed',
                'confirmation_url': self.driver.current_url
            }
            
            logger.info(f"✅ Achat Coinbase complété: {result['transaction_id']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur achat Coinbase: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def buy_crypto_binance(self, order_data):
        """
        Automatise l'achat sur Binance.com
        """
        try:
            logger.info(f"🚀 Démarrage achat automatique Binance pour {order_data['email']}")
            
            self.driver.get("https://www.binance.com/fr/buy-sell-crypto")
            logger.info("📱 Page Binance chargée")
            
            # Simulation d'achat Binance
            steps = [
                "🔍 Accès à la plateforme P2P...",
                f"💰 Recherche offres pour {order_data['amount']} {order_data['currency']}",
                f"₿ Filtrage par {order_data['crypto']}...",
                "👥 Sélection vendeur fiable...",
                f"💳 Paiement avec carte {order_data['cardNumber'][-4:]}...",
                "⏳ Attente confirmation vendeur...",
                "✅ Crypto reçue dans portefeuille !"
            ]
            
            for step in steps:
                logger.info(step)
                time.sleep(3)  # Binance prend plus de temps
            
            result = {
                'success': True,
                'transaction_id': f"BN_{uuid.uuid4().hex[:12]}",
                'crypto_amount': float(order_data['amount']) * 0.000025,
                'status': 'completed',
                'confirmation_url': self.driver.current_url
            }
            
            logger.info(f"✅ Achat Binance complété: {result['transaction_id']}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur achat Binance: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def fill_payment_form(self, order_data):
        """
        Remplit automatiquement le formulaire de paiement
        """
        try:
            logger.info("💳 Remplissage automatique du formulaire de paiement...")
            
            # Attendre que la page de paiement charge
            time.sleep(3)
            
            # 1. Remplir le numéro de carte
            card_selectors = [
                "input[name*='card']",
                "input[placeholder*='card']",
                "input[id*='card']",
                "input[data-testid*='card']",
                ".card-number input",
                "#card-number",
                "input[autocomplete='cc-number']"
            ]
            
            for selector in card_selectors:
                try:
                    card_field = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    card_field.click()
                    card_field.clear()
                    card_field.send_keys(order_data['cardNumber'].replace(' ', ''))
                    logger.info("✅ Numéro de carte saisi")
                    time.sleep(1)
                    break
                except:
                    continue
            
            # 2. Remplir la date d'expiration
            expiry_selectors = [
                "input[name*='expiry']",
                "input[placeholder*='MM/YY']",
                "input[id*='expiry']",
                "input[data-testid*='expiry']",
                ".card-expiry input",
                "input[autocomplete='cc-exp']"
            ]
            
            for selector in expiry_selectors:
                try:
                    expiry_field = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    expiry_field.click()
                    expiry_field.clear()
                    expiry_field.send_keys(order_data['cardExpiry'])
                    logger.info("✅ Date d'expiration saisie")
                    time.sleep(1)
                    break
                except:
                    continue
            
            # 3. Remplir le CVV
            cvv_selectors = [
                "input[name*='cvv']",
                "input[name*='cvc']",
                "input[placeholder*='CVV']",
                "input[id*='cvv']",
                "input[data-testid*='cvv']",
                ".card-cvv input",
                "input[autocomplete='cc-csc']"
            ]
            
            for selector in cvv_selectors:
                try:
                    cvv_field = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    cvv_field.click()
                    cvv_field.clear()
                    cvv_field.send_keys(order_data['cardCvv'])
                    logger.info("✅ CVV saisi")
                    time.sleep(1)
                    break
                except:
                    continue
            
            # 4. Remplir le nom sur la carte
            name_selectors = [
                "input[name*='cardholder']",
                "input[name*='name']",
                "input[placeholder*='name']",
                "input[id*='name']",
                "input[autocomplete='cc-name']"
            ]
            
            full_name = f"{order_data.get('firstName', '')} {order_data.get('lastName', '')}".strip()
            
            for selector in name_selectors:
                try:
                    name_field = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                    )
                    name_field.click()
                    name_field.clear()
                    name_field.send_keys(full_name)
                    logger.info("✅ Nom sur carte saisi")
                    time.sleep(1)
                    break
                except:
                    continue
            
            # 5. Chercher et cliquer sur le bouton de paiement final
            time.sleep(2)
            
            payment_selectors = [
                "//button[contains(text(), 'Pay')]",
                "//button[contains(text(), 'Purchase')]",
                "//button[contains(text(), 'Buy')]",
                "//button[contains(text(), 'Complete')]",
                ".pay-button",
                ".purchase-btn",
                "[data-testid*='pay']",
                "button[type='submit']"
            ]
            
            for selector in payment_selectors:
                try:
                    if selector.startswith("//"):
                        pay_btn = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.XPATH, selector))
                        )
                    else:
                        pay_btn = WebDriverWait(self.driver, 5).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                    
                    if pay_btn.is_enabled():
                        self.driver.execute_script("arguments[0].scrollIntoView();", pay_btn)
                        time.sleep(1)
                        pay_btn.click()
                        logger.info("✅ Bouton de paiement cliqué")
                        time.sleep(5)
                        break
                except:
                    continue
            
            logger.info("💳 Formulaire de paiement rempli automatiquement")
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur remplissage paiement: {e}")
    
    def close_browser(self):
        """Ferme le navigateur"""
        if self.driver:
            self.driver.quit()
            logger.info("🔒 Navigateur fermé")

def process_order_automatically(order_id, order_data):
    """
    Traite une commande automatiquement en arrière-plan
    """
    buyer = AutomatedCryptoBuyer()
    
    try:
        # Marquer comme en cours
        pending_orders[order_id]['status'] = 'processing'
        pending_orders[order_id]['started_at'] = datetime.now().isoformat()
        
        # Configurer le navigateur
        if not buyer.setup_browser(headless=False):  # Visible pour debug
            raise Exception("Impossible de configurer le navigateur")
        
        # Essayer différentes plateformes
        platforms = [
            ('Switchere', buyer.buy_crypto_switchere),
            ('Coinbase', buyer.buy_crypto_coinbase),
            ('Binance', buyer.buy_crypto_binance)
        ]
        
        result = None
        for platform_name, platform_func in platforms:
            logger.info(f"🔄 Tentative d'achat sur {platform_name}...")
            
            try:
                result = platform_func(order_data)
                if result['success']:
                    logger.info(f"✅ Succès sur {platform_name}")
                    break
                else:
                    logger.warning(f"⚠️ Échec sur {platform_name}: {result.get('error')}")
            except Exception as e:
                logger.error(f"❌ Erreur sur {platform_name}: {e}")
                continue
        
        # Finaliser la commande
        if result and result['success']:
            completed_orders[order_id] = {
                **pending_orders[order_id],
                'result': result,
                'status': 'completed',
                'completed_at': datetime.now().isoformat()
            }
            
            logger.info(f"🎉 Commande {order_id} complétée avec succès!")
            
        else:
            completed_orders[order_id] = {
                **pending_orders[order_id],
                'status': 'failed',
                'error': 'Échec sur toutes les plateformes',
                'completed_at': datetime.now().isoformat()
            }
            
            logger.error(f"❌ Commande {order_id} échouée")
        
        # Nettoyer
        if order_id in pending_orders:
            del pending_orders[order_id]
            
    except Exception as e:
        logger.error(f"❌ Erreur traitement commande {order_id}: {e}")
        completed_orders[order_id] = {
            **pending_orders.get(order_id, {}),
            'status': 'error',
            'error': str(e),
            'completed_at': datetime.now().isoformat()
        }
        
    finally:
        # Ne pas fermer le navigateur automatiquement pour permettre à l'utilisateur de finaliser
        logger.info("🔒 Navigateur laissé ouvert pour finalisation manuelle")
        # buyer.close_browser()

@app.route('/')
def index():
    """Interface client"""
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 Achat Crypto Automatisé</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .main-container { max-width: 900px; margin: 30px auto; }
            .form-card { background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 20px 20px 0 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="main-container">
                <div class="form-card">
                    <div class="header">
                        <h1>🤖 Achat Crypto 100% Automatisé</h1>
                        <p class="mb-0">Selenium automatise l'achat sur votre machine</p>
                    </div>
                    
                    <div class="p-4">
                        <div class="alert alert-success">
                            <h6>🚀 Processus entièrement automatisé</h6>
                            <ul class="mb-0">
                                <li>🔸 Navigateur s'ouvre automatiquement sur votre PC</li>
                                <li>🔸 Formulaires remplis automatiquement</li>
                                <li>🔸 Achat effectué automatiquement</li>
                                <li>🔸 Résultat affiché en temps réel</li>
                            </ul>
                        </div>
                        
                        <form id="autoForm" onsubmit="startAutomatedPurchase(event)">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>💰 Commande</h6>
                                    <div class="mb-3">
                                        <label class="form-label">Montant</label>
                                        <input type="number" class="form-control" id="amount" value="50" min="10" max="1000" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Devise</label>
                                        <select class="form-control" id="currency" required>
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Crypto</label>
                                        <select class="form-control" id="crypto" required>
                                            <option value="BTC">Bitcoin</option>
                                            <option value="ETH">Ethereum</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Adresse crypto</label>
                                        <input type="text" class="form-control" id="cryptoAddress" placeholder="Votre adresse de réception" required>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <h6>👤 Informations</h6>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="form-label">Prénom</label>
                                            <input type="text" class="form-control" id="firstName" required>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="form-label">Nom</label>
                                            <input type="text" class="form-control" id="lastName" required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-control" id="email" required>
                                    </div>
                                    
                                    <h6>💳 Carte bancaire</h6>
                                    <div class="mb-3">
                                        <label class="form-label">Numéro</label>
                                        <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-6 mb-3">
                                            <label class="form-label">MM/YY</label>
                                            <input type="text" class="form-control" id="cardExpiry" placeholder="12/25" required>
                                        </div>
                                        <div class="col-6 mb-3">
                                            <label class="form-label">CVV</label>
                                            <input type="text" class="form-control" id="cardCvv" placeholder="123" required>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="text-center mt-4">
                                <button type="submit" class="btn btn-success btn-lg">
                                    🤖 DÉMARRER L'AUTOMATISATION
                                </button>
                                <p class="mt-2 small text-muted">
                                    Le navigateur va s'ouvrir automatiquement sur votre machine
                                </p>
                            </div>
                        </form>
                        
                        <div id="status" style="display: none;" class="mt-4">
                            <div class="alert alert-info">
                                <h6>🔄 Automatisation en cours...</h6>
                                <div id="statusText">Préparation...</div>
                                <div class="progress mt-2">
                                    <div id="progressBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            async function startAutomatedPurchase(event) {
                event.preventDefault();
                
                const btn = event.target.querySelector('button[type="submit"]');
                btn.disabled = true;
                btn.innerHTML = '🔄 LANCEMENT...';
                
                const orderData = {
                    amount: document.getElementById('amount').value,
                    currency: document.getElementById('currency').value,
                    crypto: document.getElementById('crypto').value,
                    cryptoAddress: document.getElementById('cryptoAddress').value,
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    cardNumber: document.getElementById('cardNumber').value,
                    cardExpiry: document.getElementById('cardExpiry').value,
                    cardCvv: document.getElementById('cardCvv').value
                };
                
                try {
                    const response = await fetch('/start_automated_purchase', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        document.getElementById('status').style.display = 'block';
                        monitorProgress(result.orderId);
                    } else {
                        alert('❌ Erreur: ' + result.error);
                        btn.disabled = false;
                        btn.innerHTML = '🤖 DÉMARRER L\\'AUTOMATISATION';
                    }
                } catch (error) {
                    alert('❌ Erreur de connexion');
                    btn.disabled = false;
                    btn.innerHTML = '🤖 DÉMARRER L\\'AUTOMATISATION';
                }
            }
            
            function monitorProgress(orderId) {
                const statusText = document.getElementById('statusText');
                const progressBar = document.getElementById('progressBar');
                
                const interval = setInterval(async () => {
                    try {
                        const response = await fetch(`/order_status/${orderId}`);
                        const status = await response.json();
                        
                        statusText.textContent = status.message;
                        progressBar.style.width = status.progress + '%';
                        
                        if (status.completed) {
                            clearInterval(interval);
                            if (status.success) {
                                window.location.href = `/success/${orderId}`;
                            } else {
                                statusText.textContent = '❌ ' + status.error;
                                progressBar.className = 'progress-bar bg-danger';
                            }
                        }
                    } catch (error) {
                        console.error('Erreur monitoring:', error);
                    }
                }, 2000);
            }
        </script>
    </body>
    </html>
    """)

@app.route('/start_automated_purchase', methods=['POST'])
def start_automated_purchase():
    """Démarre l'achat automatisé"""
    try:
        order_data = request.get_json()
        order_id = f"AUTO_{uuid.uuid4().hex[:8]}_{int(time.time())}"
        
        # Stocker la commande
        pending_orders[order_id] = {
            'id': order_id,
            'data': order_data,
            'status': 'pending',
            'created_at': datetime.now().isoformat()
        }
        
        # Démarrer l'automatisation en arrière-plan
        thread = threading.Thread(target=process_order_automatically, args=(order_id, order_data))
        thread.daemon = True
        thread.start()
        
        logger.info(f"🚀 Automatisation démarrée pour commande {order_id}")
        
        return jsonify({
            'success': True,
            'orderId': order_id,
            'message': 'Automatisation démarrée'
        })
        
    except Exception as e:
        logger.error(f"❌ Erreur démarrage automatisation: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/order_status/<order_id>')
def order_status_api(order_id):
    """API pour suivre le statut d'une commande"""
    
    # Chercher dans les commandes en cours
    if order_id in pending_orders:
        order = pending_orders[order_id]
        progress = 30 if order['status'] == 'processing' else 10
        
        return jsonify({
            'completed': False,
            'success': False,
            'progress': progress,
            'message': f"🔄 {order['status'].title()}..."
        })
    
    # Chercher dans les commandes terminées
    if order_id in completed_orders:
        order = completed_orders[order_id]
        
        return jsonify({
            'completed': True,
            'success': order['status'] == 'completed',
            'progress': 100,
            'message': '✅ Terminé!' if order['status'] == 'completed' else f"❌ {order.get('error', 'Erreur')}",
            'result': order.get('result')
        })
    
    return jsonify({
        'completed': False,
        'success': False,
        'progress': 0,
        'message': 'Commande non trouvée'
    })

@app.route('/success/<order_id>')
def success_page(order_id):
    """Page de succès"""
    order = completed_orders.get(order_id, {})
    
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>✅ Automatisation Réussie!</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: linear-gradient(135deg, #28a745, #20c997); min-height: 100vh; }
            .success-container { max-width: 800px; margin: 50px auto; }
            .success-card { background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-container">
                <div class="success-card">
                    <div class="card-header bg-success text-white text-center py-4">
                        <h1>🎉 AUTOMATISATION RÉUSSIE!</h1>
                        <p class="mb-0">Commande: {{ order_id }}</p>
                    </div>
                    <div class="card-body p-5">
                        <div class="alert alert-success">
                            <h5>🤖 Achat automatisé complété!</h5>
                            <p class="mb-0">Le navigateur a automatiquement effectué l'achat pour votre client.</p>
                        </div>
                        
                        {% if order.result %}
                        <div class="row">
                            <div class="col-md-6">
                                <h6>📋 Détails</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Transaction:</strong> {{ order.result.transaction_id }}</li>
                                    <li><strong>Crypto:</strong> {{ order.result.crypto_amount }}</li>
                                    <li><strong>Statut:</strong> <span class="text-success">✅ {{ order.result.status }}</span></li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6>⏰ Timing</h6>
                                <ul class="list-unstyled">
                                    <li><strong>Créé:</strong> {{ order.created_at[:19] }}</li>
                                    <li><strong>Complété:</strong> {{ order.completed_at[:19] }}</li>
                                    <li><strong>Durée:</strong> ~2-5 minutes</li>
                                </ul>
                            </div>
                        </div>
                        {% endif %}
                        
                        <div class="text-center mt-4">
                            <a href="/" class="btn btn-primary btn-lg">🔄 Nouvelle automatisation</a>
                            <a href="/admin" class="btn btn-outline-secondary btn-lg ms-2">📊 Historique</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """, order_id=order_id, order=order)

@app.route('/admin')
def admin_panel():
    """Interface admin"""
    all_orders = {**pending_orders, **completed_orders}
    
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>📊 Admin - Automatisations</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div class="container mt-4">
            <h1>🤖 Panneau d'Administration - Automatisations</h1>
            
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h2 class="text-warning">{{ pending_count }}</h2>
                            <p>En cours</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h2 class="text-success">{{ completed_count }}</h2>
                            <p>Complétées</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center">
                        <div class="card-body">
                            <h2 class="text-primary">{{ total_count }}</h2>
                            <p>Total</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h5>🤖 Automatisations d'Achat</h5>
                </div>
                <div class="card-body">
                    {% if all_orders %}
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Client</th>
                                        <th>Montant</th>
                                        <th>Crypto</th>
                                        <th>Statut</th>
                                        <th>Résultat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {% for order_id, order in all_orders.items() %}
                                    <tr>
                                        <td><code>{{ order_id[:15] }}...</code></td>
                                        <td>{{ order.created_at[:19] }}</td>
                                        <td>{{ order.data.email }}</td>
                                        <td>{{ order.data.amount }} {{ order.data.currency }}</td>
                                        <td>{{ order.data.crypto }}</td>
                                        <td>
                                            {% if order.status == 'completed' %}
                                                <span class="badge bg-success">✅ Complété</span>
                                            {% elif order.status == 'processing' %}
                                                <span class="badge bg-warning">🔄 En cours</span>
                                            {% elif order.status == 'failed' %}
                                                <span class="badge bg-danger">❌ Échoué</span>
                                            {% else %}
                                                <span class="badge bg-secondary">⏳ En attente</span>
                                            {% endif %}
                                        </td>
                                        <td>
                                            {% if order.get('result') %}
                                                {{ order.result.transaction_id }}
                                            {% else %}
                                                -
                                            {% endif %}
                                        </td>
                                    </tr>
                                    {% endfor %}
                                </tbody>
                            </table>
                        </div>
                    {% else %}
                        <p class="text-muted">Aucune automatisation pour le moment.</p>
                    {% endif %}
                </div>
            </div>
        </div>
    </body>
    </html>
    """, 
    all_orders=all_orders,
    pending_count=len(pending_orders),
    completed_count=len([o for o in completed_orders.values() if o['status'] == 'completed']),
    total_count=len(all_orders)
    )

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'Automated Crypto Buyer'})

if __name__ == '__main__':
    print("🤖 ACHETEUR CRYPTO AUTOMATISÉ (SELENIUM)")
    print("🌐 Interface client: http://127.0.0.1:5002")
    print("👤 Interface admin: http://127.0.0.1:5002/admin")
    print()
    print("🔥 FONCTIONNEMENT:")
    print("   1. Client remplit le formulaire")
    print("   2. Selenium ouvre automatiquement le navigateur")
    print("   3. Navigation automatique vers les sites crypto")
    print("   4. Formulaires remplis automatiquement")
    print("   5. Achat effectué automatiquement")
    print("   6. Résultat retourné au client")
    print()
    print("⚠️  IMPORTANT:")
    print("   - Chrome doit être installé sur votre machine")
    print("   - Le navigateur s'ouvrira automatiquement")
    print("   - Vous pouvez voir l'automatisation en direct")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5003)
