# Automatisation Switchere.com

Ce projet fournit un script Python pour automatiser les étapes préparatoires d'achat de cryptomonnaies sur Switchere.com tout en respectant leurs mesures de sécurité et conditions d'utilisation.

## ⚠️ Avertissement Important

**Ce script N'EFFECTUE PAS d'achats automatiques complets** en raison des mesures de sécurité de Switchere :
- Authentification 3D Secure requise
- Vérification manuelle obligatoire
- Protocoles de sécurité bancaire

Le script automatise uniquement les étapes préparatoires et respecte les conditions d'utilisation.

## 🚀 Installation

1. Installez Python 3.8 ou plus récent
2. Installez les dépendances :
```bash
pip install -r requirements.txt
```

## 🔧 Configuration

1. Obtenez vos clés API sur [developer.switchere.com](https://developer.switchere.com)
2. Modifiez le fichier `config.json` avec vos informations :
```json
{
  "api_credentials": {
    "api_key": "votre_clé_api",
    "secret_key": "votre_clé_secrète",
    "sandbox": true
  }
}
```

## 📖 Utilisation

### Exécution basique
```bash
python switchere_automation.py
```

### Utilisation programmatique
```python
from switchere_automation import SwitchereAutomation

# Initialisation
automation = SwitchereAutomation(api_key, secret_key, sandbox=True)

# Récupération des taux
rates = automation.get_exchange_rates("EUR", "BTC")

# Création d'un devis
quote = automation.create_quote("EUR", "BTC", 100.0)
```

## 🔍 Fonctionnalités

### ✅ Automatisées
- Récupération des taux de change en temps réel
- Création de devis automatiques
- Vérification des devises supportées
- Récupération des méthodes de paiement
- Préparation des données de commande
- Logging et gestion d'erreurs

### ⚠️ Nécessitent une intervention manuelle
- Validation finale de l'achat
- Authentification 3D Secure
- Vérification d'identité
- Confirmation de paiement

## 🛡️ Sécurité

- Utilisation de l'environnement sandbox par défaut
- Signature HMAC-SHA256 pour l'authentification API
- Mode simulation pour les tests
- Respect des limites de montant
- Logging sécurisé (pas de clés dans les logs)

## 📋 Structure du projet

```
test/
├── switchere_automation.py  # Script principal
├── config.json             # Configuration
├── requirements.txt        # Dépendances Python
└── README.md              # Documentation
```

## 🔗 API Endpoints utilisés

- `GET /api/v2/exchange/rate` - Taux de change
- `GET /api/v2/currencies` - Devises supportées
- `POST /api/v2/exchange/quote` - Création de devis
- `GET /api/v2/payment-methods` - Méthodes de paiement

## 🚨 Limitations légales

- Respecte les conditions d'utilisation de Switchere
- Ne contourne aucune mesure de sécurité
- Nécessite une validation manuelle pour les achats
- Utilise uniquement l'API officielle

## 🆘 Support

Pour obtenir de l'aide :
1. Consultez la documentation API : [developer.switchere.com](https://developer.switchere.com)
2. Vérifiez les logs d'erreur
3. Utilisez le mode sandbox pour les tests

## 📜 Licence

Ce projet est fourni à des fins éducatives et de démonstration. Respectez toujours les conditions d'utilisation de Switchere.com.
# test
