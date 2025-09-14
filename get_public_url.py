#!/usr/bin/env python3
"""
Script pour récupérer l'URL publique du bot crypto
"""

import subprocess
import time
import re
import sys

def get_cloudflare_url():
    """Récupère l'URL publique de Cloudflare Tunnel"""
    print("🔍 Recherche de l'URL publique...")
    
    try:
        # Chercher dans les logs de cloudflared
        result = subprocess.run(
            ['ps', 'aux'], 
            capture_output=True, 
            text=True
        )
        
        if 'cloudflared tunnel' in result.stdout:
            print("✅ Cloudflare Tunnel détecté")
            
            # Essayer de trouver l'URL dans les logs système
            log_result = subprocess.run(
                ['log', 'show', '--predicate', 'process == "cloudflared"', '--last', '1m'],
                capture_output=True,
                text=True
            )
            
            # Chercher les patterns d'URL
            url_patterns = [
                r'https://[a-z0-9-]+\.trycloudflare\.com',
                r'https://[a-z0-9-]+\.cfargotunnel\.com'
            ]
            
            for pattern in url_patterns:
                matches = re.findall(pattern, log_result.stdout)
                if matches:
                    return matches[-1]  # Dernière URL trouvée
        
    except Exception as e:
        print(f"❌ Erreur lors de la recherche: {e}")
    
    return None

def main():
    print("🌐 RÉCUPÉRATION DE L'URL PUBLIQUE DU BOT CRYPTO")
    print("=" * 60)
    
    # Vérifier que le serveur local fonctionne
    try:
        import requests
        response = requests.get('http://127.0.0.1:5002/health', timeout=5)
        if response.status_code == 200:
            print("✅ Serveur local actif")
        else:
            print("❌ Serveur local non accessible")
            return
    except:
        print("❌ Serveur local non démarré")
        print("💡 Lancez d'abord: python3 automated_crypto_buyer.py")
        return
    
    # Récupérer l'URL publique
    public_url = get_cloudflare_url()
    
    if public_url:
        print("\n" + "🎉" * 20)
        print("VOTRE BOT CRYPTO EST ACCESSIBLE PUBLIQUEMENT !")
        print("🎉" * 20)
        print()
        print(f"🌐 URL PUBLIQUE: {public_url}")
        print(f"📱 Interface client: {public_url}")
        print(f"👤 Interface admin: {public_url}/admin")
        print()
        print("✅ ACCESSIBLE DEPUIS:")
        print("   📱 N'importe quel téléphone")
        print("   💻 N'importe quel ordinateur")
        print("   🌍 Partout dans le monde")
        print()
        print("🔒 SÉCURISÉ AVEC HTTPS")
        print("🆓 GRATUIT AVEC CLOUDFLARE")
        print()
        print("💡 PARTAGEZ CETTE URL avec vos clients !")
        
    else:
        print("\n❌ URL publique non trouvée")
        print("💡 Solutions:")
        print("   1. Attendez quelques secondes et relancez ce script")
        print("   2. Vérifiez que Cloudflare Tunnel fonctionne")
        print("   3. Regardez les logs dans le terminal où vous avez lancé cloudflared")
        
        print("\n🔧 ALTERNATIVE - Démarrage manuel:")
        print("   Ouvrez un nouveau terminal et tapez:")
        print("   cloudflared tunnel --url http://localhost:5002")
        print("   L'URL s'affichera dans ce terminal")

if __name__ == "__main__":
    main()
