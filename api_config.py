# Configuration des APIs RÉELLES
# Remplacez par vos vraies clés pour activer les vrais paiements

# Stripe (pour traiter les cartes bancaires)
STRIPE_SECRET_KEY = "sk_test_51234567890abcdef"  # Remplacez par votre vraie clé Stripe test
STRIPE_PUBLISHABLE_KEY = "pk_test_51234567890abcdef"  # Remplacez par votre vraie clé publique

# Switchere (pour acheter les cryptos)
SWITCHERE_API_KEY = "your_switchere_api_key_here"
SWITCHERE_SECRET = "your_switchere_secret_here" 
SWITCHERE_PARTNER_ID = "your_partner_id_here"

# Binance (alternative pour acheter les cryptos)
BINANCE_API_KEY = "your_binance_api_key_here"
BINANCE_SECRET = "your_binance_secret_here"

# Configuration générale
ENVIRONMENT = "test"  # test ou production
MAX_AMOUNT_EUR = 5000
SUPPORTED_CRYPTOS = ["BTC", "ETH", "LTC", "XRP", "ADA"]

# Instructions pour obtenir les clés :
"""
1. STRIPE (paiements carte) :
   - Allez sur https://stripe.com
   - Créez un compte
   - Dans Dashboard > Developers > API keys
   - Copiez la "Secret key" (commence par sk_test_)

2. SWITCHERE (achat crypto) :
   - Allez sur https://developer.switchere.com
   - Demandez un compte partenaire
   - Obtenez vos clés API

3. BINANCE (alternative crypto) :
   - Allez sur https://www.binance.com/fr/my/settings/api-management
   - Créez une nouvelle API key
   - Activez les permissions de trading
"""
