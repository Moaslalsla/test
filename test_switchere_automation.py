#!/usr/bin/env python3
"""
SCRIPT DE TEST POUR L'AUTOMATISATION SWITCHERE
Ce script teste l'automatisation améliorée
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from automated_crypto_buyer import AutomatedCryptoBuyer
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_switchere_automation():
    """
    Test l'automatisation Switchere avec de vraies données
    """
    print("🧪 TEST AUTOMATISATION SWITCHERE AMÉLIORÉE")
    print("=" * 60)
    
    # Données de test (utilisez de vraies données pour un vrai test)
    test_order = {
        'amount': '100',
        'currency': 'EUR',
        'crypto': 'BTC',
        'cryptoAddress': 'bc1qvh58dl0am7d0j0qxsnnhz5c2pv04e0x0qx2cfg',  # Adresse Bitcoin de test
        'email': 'test@example.com',
        'cardNumber': '4111 1111 1111 1111',  # Numéro de test Visa
        'cardExpiry': '12/25',
        'cardCvv': '123',
        'firstName': 'Test',
        'lastName': 'User'
    }
    
    print("📋 DONNÉES DE TEST:")
    print(f"   💰 Montant: {test_order['amount']} {test_order['currency']}")
    print(f"   ₿ Crypto: {test_order['crypto']}")
    print(f"   📧 Email: {test_order['email']}")
    print(f"   🏦 Adresse: {test_order['cryptoAddress'][:20]}...")
    print()
    
    buyer = AutomatedCryptoBuyer()
    
    try:
        print("🔧 Configuration du navigateur...")
        if not buyer.setup_browser(headless=False):  # Visible pour voir l'action
            print("❌ Impossible de configurer le navigateur")
            return False
        
        print("✅ Navigateur configuré")
        print()
        
        print("🚀 DÉMARRAGE DE L'AUTOMATISATION SWITCHERE...")
        print("🔍 Le navigateur va s'ouvrir et effectuer les actions automatiquement")
        print("👀 Regardez le navigateur pour voir l'automatisation en action")
        print()
        
        # Lancer l'automatisation
        result = buyer.buy_crypto_switchere(test_order)
        
        print("\n" + "=" * 60)
        print("📊 RÉSULTAT DU TEST:")
        print("=" * 60)
        
        if result['success']:
            print(f"✅ SUCCÈS: {result.get('message', 'Automatisation réussie')}")
            print(f"📋 Transaction ID: {result.get('transaction_id', 'N/A')}")
            print(f"₿ Crypto estimée: {result.get('crypto_amount', 'N/A')}")
            print(f"🌐 URL finale: {result.get('confirmation_url', 'N/A')}")
            print()
            print("🎉 L'automatisation a fonctionné!")
            print("✨ Le formulaire a été rempli automatiquement")
            print("👀 Vérifiez le navigateur pour voir le résultat")
        else:
            print(f"❌ ÉCHEC: {result.get('error', 'Erreur inconnue')}")
            print()
            print("🔧 Suggestions de correction:")
            print("   • Vérifiez votre connexion internet")
            print("   • Assurez-vous que Chrome est installé")
            print("   • Vérifiez que Switchere.com est accessible")
        
        print("\n" + "=" * 60)
        print("ℹ️ INFORMATIONS IMPORTANTES:")
        print("=" * 60)
        print("• Le navigateur reste ouvert pour que vous puissiez voir le résultat")
        print("• Si l'automatisation a réussi, vous devriez voir les champs remplis")
        print("• Pour un vrai achat, complétez manuellement les étapes finales")
        print("• Fermez le navigateur quand vous avez terminé")
        print("=" * 60)
        
        # Attendre que l'utilisateur appuie sur Entrée avant de fermer
        input("\n🔄 Appuyez sur Entrée quand vous avez fini de vérifier le navigateur...")
        
        return result['success']
        
    except KeyboardInterrupt:
        print("\n⚠️ Test interrompu par l'utilisateur")
        return False
    except Exception as e:
        print(f"\n❌ Erreur lors du test: {e}")
        return False
    finally:
        print("\n🔒 Fermeture du navigateur...")
        buyer.close_browser()
        print("🏁 Test terminé")

if __name__ == "__main__":
    print("🤖 TESTEUR D'AUTOMATISATION SWITCHERE")
    print("🎯 Ce script teste si l'automatisation fonctionne correctement")
    print()
    
    # Vérifications préliminaires
    try:
        from selenium import webdriver
        from webdriver_manager.chrome import ChromeDriverManager
        print("✅ Selenium installé")
    except ImportError:
        print("❌ Selenium non installé. Installez avec: pip install selenium webdriver-manager")
        sys.exit(1)
    
    # Demander confirmation
    response = input("🚀 Voulez-vous démarrer le test automatique? (o/N): ").lower().strip()
    if response in ['o', 'oui', 'y', 'yes']:
        success = test_switchere_automation()
        
        if success:
            print("\n🎉 TEST RÉUSSI!")
            print("✨ L'automatisation Switchere fonctionne correctement")
        else:
            print("\n❌ TEST ÉCHOUÉ")
            print("🔧 Des améliorations sont nécessaires")
    else:
        print("🚫 Test annulé")
