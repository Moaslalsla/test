#!/usr/bin/env python3
"""
Script pour configurer votre domaine personnalisé mangeurdecaca.store
avec Cloudflare Tunnel
"""

import subprocess
import time
import json
import requests
import os
import sys

# Configuration du domaine personnalisé
TUNNEL_ID = "256b0144-5cb0-404f-a7fe-57454333634a"
DOMAIN = "mangeurdecaca.store"
LOCAL_PORT = 5002

def check_cloudflared_installed():
    """Vérifie si cloudflared est installé"""
    try:
        result = subprocess.run(['cloudflared', '--version'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Cloudflared installé")
            return True
        else:
            print("❌ Cloudflared non installé")
            return False
    except FileNotFoundError:
        print("❌ Cloudflared non trouvé")
        return False

def check_server_running():
    """Vérifie que le serveur local fonctionne"""
    try:
        response = requests.get(f'http://127.0.0.1:{LOCAL_PORT}/health', timeout=5)
        if response.status_code == 200:
            print("✅ Serveur local actif sur port", LOCAL_PORT)
            return True
        else:
            print("❌ Serveur local non accessible")
            return False
    except:
        print("❌ Serveur local non démarré")
        print("💡 Lancez d'abord: python3 automated_crypto_buyer.py")
        return False

def create_tunnel_config():
    """Crée le fichier de configuration pour le tunnel"""
    config = {
        "tunnel": TUNNEL_ID,
        "credentials-file": f"/Users/{os.getenv('USER')}/.cloudflared/{TUNNEL_ID}.json",
        "ingress": [
            {
                "hostname": DOMAIN,
                "service": f"http://localhost:{LOCAL_PORT}"
            },
            {
                "service": "http_status:404"
            }
        ]
    }
    
    # Créer le répertoire cloudflared s'il n'existe pas
    config_dir = f"/Users/{os.getenv('USER')}/.cloudflared"
    os.makedirs(config_dir, exist_ok=True)
    
    # Écrire le fichier de configuration
    config_file = os.path.join(config_dir, "config.yml")
    
    try:
        import yaml
        with open(config_file, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        print(f"✅ Configuration créée: {config_file}")
        return config_file
    except ImportError:
        # Fallback sans yaml - écrire manuellement
        with open(config_file, 'w') as f:
            f.write(f"tunnel: {TUNNEL_ID}\n")
            f.write(f"credentials-file: /Users/{os.getenv('USER')}/.cloudflared/{TUNNEL_ID}.json\n")
            f.write("ingress:\n")
            f.write(f"  - hostname: {DOMAIN}\n")
            f.write(f"    service: http://localhost:{LOCAL_PORT}\n")
            f.write("  - service: http_status:404\n")
        print(f"✅ Configuration créée: {config_file}")
        return config_file

def start_tunnel():
    """Démarre le tunnel Cloudflare"""
    try:
        print("🚀 Démarrage du tunnel Cloudflare...")
        print(f"🌐 Domaine: {DOMAIN}")
        print(f"🔗 Tunnel ID: {TUNNEL_ID}")
        print(f"🏠 Port local: {LOCAL_PORT}")
        print()
        
        # Démarrer cloudflared avec la configuration
        process = subprocess.Popen([
            'cloudflared', 'tunnel', 'run'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # Attendre un peu pour que le tunnel se lance
        time.sleep(5)
        
        if process.poll() is None:  # Process is still running
            print("✅ Tunnel démarré avec succès!")
            return process
        else:
            stdout, stderr = process.communicate()
            print("❌ Erreur lors du démarrage du tunnel:")
            print("STDOUT:", stdout)
            print("STDERR:", stderr)
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")
        return None

def display_success_info():
    """Affiche les informations de succès"""
    print("\n" + "🎉" * 30)
    print("VOTRE DOMAINE PERSONNALISÉ EST CONFIGURÉ !")
    print("🎉" * 30)
    print()
    print(f"🌐 VOTRE SITE: https://{DOMAIN}")
    print(f"📱 Interface client: https://{DOMAIN}")
    print(f"👤 Interface admin: https://{DOMAIN}/admin")
    print()
    print("✅ AVANTAGES DE VOTRE DOMAINE PERSONNALISÉ:")
    print("   🎯 URL mémorisable et professionnelle")
    print("   🔒 Certificat SSL automatique")
    print("   🌍 Accessible partout dans le monde")
    print("   ⚡ Performance optimisée par Cloudflare")
    print("   📈 Statistiques et analytics disponibles")
    print()
    print("💡 PARTAGEZ VOTRE URL PERSONNALISÉE:")
    print(f"   https://{DOMAIN}")
    print()
    print("⚠️  IMPORTANT:")
    print("   • Gardez ce terminal ouvert pour maintenir le tunnel")
    print("   • Votre serveur local doit rester actif")
    print("   • Le domaine est maintenant lié à votre tunnel")

def main():
    print("🌐 CONFIGURATION DOMAINE PERSONNALISÉ")
    print("=" * 60)
    print(f"Domaine: {DOMAIN}")
    print(f"Tunnel ID: {TUNNEL_ID}")
    print("=" * 60)
    print()
    
    # Vérifications préliminaires
    if not check_cloudflared_installed():
        print("\n💡 INSTALLATION REQUISE:")
        print("   brew install cloudflare/cloudflare/cloudflared")
        print("   ou téléchargez depuis: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/")
        return False
    
    if not check_server_running():
        return False
    
    # Créer la configuration
    print("\n📝 Création de la configuration...")
    config_file = create_tunnel_config()
    
    if not config_file:
        print("❌ Impossible de créer la configuration")
        return False
    
    # Démarrer le tunnel
    print("\n🚀 Démarrage du tunnel...")
    process = start_tunnel()
    
    if process:
        display_success_info()
        
        # Maintenir le tunnel actif
        try:
            while True:
                time.sleep(30)
                if process.poll() is not None:
                    print("\n⚠️  Le tunnel s'est arrêté, tentative de redémarrage...")
                    process = start_tunnel()
                    if not process:
                        break
                else:
                    # Vérifier que le site répond
                    try:
                        response = requests.get(f"https://{DOMAIN}/health", timeout=10)
                        if response.status_code == 200:
                            print(f"✅ {time.strftime('%H:%M:%S')} - Site accessible")
                        else:
                            print(f"⚠️  {time.strftime('%H:%M:%S')} - Site non accessible (code: {response.status_code})")
                    except Exception as e:
                        print(f"⚠️  {time.strftime('%H:%M:%S')} - Erreur de connexion: {e}")
                        
        except KeyboardInterrupt:
            print("\n🔒 Tunnel fermé par l'utilisateur")
            if process:
                process.terminate()
    else:
        print("\n❌ Impossible de démarrer le tunnel")
        print("\n💡 SOLUTIONS:")
        print("   1. Vérifiez que votre tunnel ID est correct")
        print("   2. Assurez-vous d'être connecté à Cloudflare:")
        print("      cloudflared tunnel login")
        print("   3. Vérifiez que le domaine est configuré dans Cloudflare")
        print("   4. Contactez le support si le problème persiste")

if __name__ == "__main__":
    main()
