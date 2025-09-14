# 🌐 Configuration du Domaine mangeurdecaca.store

## 📋 Informations du Tunnel
- **Tunnel ID**: `256b0144-5cb0-404f-a7fe-57454333634a`
- **Domaine**: `mangeurdecaca.store`
- **Port local**: `5002`

## 🚀 Instructions de Configuration

### 1. Prérequis
```bash
# Installer cloudflared si pas déjà fait
brew install cloudflare/cloudflare/cloudflared

# Ou télécharger depuis:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### 2. Configuration Automatique
```bash
# Exécuter le script de configuration
python3 setup_custom_domain.py
```

### 3. Configuration Manuelle (Alternative)
```bash
# Copier le fichier de configuration
cp cloudflare_tunnel_config.yml ~/.cloudflared/config.yml

# Démarrer le tunnel
cloudflared tunnel run
```

### 4. Vérification
Une fois configuré, votre site sera accessible via:
- 🌐 **Site principal**: https://mangeurdecaca.store
- 👤 **Interface admin**: https://mangeurdecaca.store/admin
- 📱 **Interface client**: https://mangeurdecaca.store
- 🔍 **Health check**: https://mangeurdecaca.store/health

## 🔧 Configuration DNS (dans Cloudflare)

Assurez-vous que ces enregistrements DNS sont configurés dans votre tableau de bord Cloudflare:

```
Type: CNAME
Nom: mangeurdecaca.store (ou @)
Valeur: 256b0144-5cb0-404f-a7fe-57454333634a.cfargotunnel.com
Proxy: Activé (nuage orange)
```

## 📁 Fichiers Créés
- `setup_custom_domain.py` - Script de configuration automatique
- `domain_config.json` - Configuration du domaine
- `cloudflare_tunnel_config.yml` - Configuration Cloudflare Tunnel
- `instructions_domaine.md` - Ce fichier d'instructions

## 🛠️ Dépannage

### Problèmes Courants

1. **Tunnel ne démarre pas**
   ```bash
   # Vérifier l'authentification
   cloudflared tunnel login
   ```

2. **Domaine non accessible**
   - Vérifier la configuration DNS dans Cloudflare
   - S'assurer que le proxy est activé (nuage orange)
   - Attendre la propagation DNS (jusqu'à 24h)

3. **Certificat SSL**
   - Cloudflare génère automatiquement le certificat
   - Peut prendre quelques minutes pour être actif

### Commandes Utiles
```bash
# Vérifier le statut du tunnel
cloudflared tunnel info 256b0144-5cb0-404f-a7fe-57454333634a

# Lister tous les tunnels
cloudflared tunnel list

# Tester la connectivité locale
curl http://localhost:5002/health

# Tester le domaine
curl https://mangeurdecaca.store/health
```

## ✅ Checklist de Validation
- [ ] Cloudflared installé
- [ ] Serveur local actif sur port 5002
- [ ] Configuration DNS dans Cloudflare
- [ ] Tunnel démarré avec succès
- [ ] Site accessible via https://mangeurdecaca.store
- [ ] Interface admin accessible
- [ ] Certificat SSL actif

## 🎉 Félicitations !
Une fois configuré, votre bot crypto sera accessible via votre domaine personnalisé professionnel !
