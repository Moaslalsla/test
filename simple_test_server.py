#!/usr/bin/env python3
"""
Serveur de test simple pour vérifier l'accès réseau
"""

from flask import Flask, jsonify, render_template_string

app = Flask(__name__)

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🤖 Test Bot Crypto</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                text-align: center; 
                padding: 50px; 
                min-height: 100vh;
                margin: 0;
            }
            .container { 
                background: rgba(255,255,255,0.1); 
                border-radius: 20px; 
                padding: 40px; 
                max-width: 500px; 
                margin: 0 auto;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin: 15px 0; }
            .success { color: #4CAF50; font-weight: bold; }
            .info { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 ÇA MARCHE !</h1>
            <p class="success">✅ Votre bot crypto est accessible depuis votre téléphone !</p>
            
            <div class="info">
                <h3>🚀 Prochaines étapes :</h3>
                <p>1. Fermez ce test</p>
                <p>2. Redémarrez le vrai serveur</p>
                <p>3. Testez l'automatisation complète</p>
            </div>
            
            <p><strong>IP de votre Mac :</strong> {{ ip }}</p>
            <p><strong>Accessible via :</strong> http://{{ ip }}:5003</p>
        </div>
    </body>
    </html>
    """, ip="192.168.1.62")

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'Test server working!'})

if __name__ == '__main__':
    print("🧪 SERVEUR DE TEST - Accès téléphone")
    print("📱 Depuis votre téléphone : http://192.168.1.62:5003")
    print("💻 Depuis votre Mac : http://127.0.0.1:5003")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5003)
