from flask import Flask
from routes.carros_routes import carros_bp
from flask_cors import CORS
import config

app = Flask(__name__)
CORS(app)  # Permitir CORS para requisições do frontend

# Configurações do banco de dados
app.config.from_object(config)

# Registrar blueprint para as rotas de carros
app.register_blueprint(carros_bp, url_prefix='/api/carros')

if __name__ == '__main__':
    app.run(debug=True)
