from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return 'Flask marche bien frère !'

if __name__ == '__main__':
    app.run(port=5555)  # On utilise un port différent pour éviter les conflits
