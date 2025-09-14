#!/usr/bin/env python3
"""
Script pour configurer facilement un domaine pour votre bot crypto
"""

import subprocess
import time
import json
import requests
from threading import Thread

def start_ngrok():
    """Démarre ngrok en arrière-plan"""
    try:
        print("🚀 Démarrage du tunnel ngrok...")
        result = subprocess.run(['ngrok', 'http', '5002'], 
                              capture_output=False, 
                              text=True)
    except Exception as e:
        print(f"❌ Erreur ngrok: {e}")

def get_ngrok_url():
    """Récupère l'URL publique de ngrok"""
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            time.sleep(2)
            response = requests.get('http://localhost:4040/api/tunnels')
            data = response.json()
            
            for tunnel in data.get('tunnels', []):
                if tunnel.get('proto') == 'https':
                    return tunnel['public_url']
                    
        except Exception as e:
            if attempt == max_attempts - 1:
                print(f"❌ Impossible de récupérer l'URL ngrok: {e}")
            continue
    
    return None

def main():
    print("🌐 CONFIGURATION DOMAINE POUR VOTRE BOT CRYPTO")
    print("=" * 60)
    
    # Vérifier que le serveur local fonctionne
    try:
        response = requests.get('http://127.0.0.1:5002/health', timeout=5)
        if response.status_code == 200:
            print("✅ Serveur local actif sur port 5002")
        else:
            print("❌ Serveur local non accessible")
            return
    except:
        print("❌ Serveur local non démarré. Lancez d'abord automated_crypto_buyer.py")
        return
    
    # Démarrer ngrok dans un thread séparé
    ngrok_thread = Thread(target=start_ngrok, daemon=True)
    ngrok_thread.start()
    
    # Attendre et récupérer l'URL
    print("⏳ Création du tunnel sécurisé...")
    time.sleep(5)
    
    public_url = get_ngrok_url()
    
    if public_url:
        print("\n" + "🎉" * 20)
        print("VOTRE BOT CRYPTO EST MAINTENANT ACCESSIBLE PARTOUT !")
        print("🎉" * 20)
        print()
        print(f"🌐 URL PUBLIQUE: {public_url}")
        print(f"📱 Interface client: {public_url}")
        print(f"👤 Interface admin: {public_url}/admin")
        print()
        print("✅ ACCESSIBLE DEPUIS:")
        print("   📱 Votre téléphone (n'importe où)")
        print("   💻 N'importe quel ordinateur")
        print("   🌍 Partout dans le monde")
        print()
        print("🔒 SÉCURISÉ AVEC HTTPS")
        print("🚀 PRÊT POUR VOS CLIENTS")
        print()
        print("💡 PARTAGEZ CETTE URL avec vos clients !")
        print("   Ils peuvent maintenant utiliser votre bot d'achat automatique")
        print()
        print("⚠️  IMPORTANT: Gardez ce terminal ouvert pour maintenir le tunnel")
        
        # Garder le script actif
        try:
            while True:
                time.sleep(60)
                # Vérifier que le tunnel est toujours actif
                try:
                    requests.get('http://localhost:4040/api/tunnels', timeout=5)
                except:
                    print("⚠️  Tunnel ngrok déconnecté, tentative de reconnexion...")
                    break
        except KeyboardInterrupt:
            print("\n🔒 Tunnel fermé par l'utilisateur")
    else:
        print("❌ Impossible de créer le tunnel public")
        print("💡 Solutions alternatives:")
        print("   1. Vérifiez votre connexion internet")
        print("   2. Créez un compte ngrok gratuit sur ngrok.com")
        print("   3. Utilisez un autre service de tunnel comme Cloudflare Tunnel")

if __name__ == "__main__":
    main()
