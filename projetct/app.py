from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Permitir CORS para facilitar as requisições do frontend

# Conexão com o MongoDB
client = MongoClient('mongodb://localhost:27017/')  # Atualize com sua string de conexão
db = client['loja_de_carros']
collection = db['carros']

# Rota para obter todos os carros
@app.route('/api/carros', methods=['GET'])
def get_carros():
    carros = []
    for carro in collection.find():
        carro['_id'] = str(carro['_id'])
        carros.append(carro)
    return jsonify(carros)

# Rota para buscar carros por nome ou modelo
@app.route('/api/carros/search', methods=['GET'])
def search_carros():
    query = request.args.get('q', '')
    regex = {'$regex': query, '$options': 'i'}
    resultados = collection.find({
        '$or': [
            {'nome': regex},
            {'modelo': regex}
        ]
    })
    carros = []
    for carro in resultados:
        carro['_id'] = str(carro['_id'])
        carros.append(carro)
    return jsonify(carros)

# Rota para obter detalhes de um carro específico
@app.route('/api/carros/<carro_id>', methods=['GET'])
def get_carro(carro_id):
    carro = collection.find_one({'_id': ObjectId(carro_id)})
    if carro:
        carro['_id'] = str(carro['_id'])
        return jsonify(carro)
    else:
        return jsonify({'error': 'Carro não encontrado'}), 404

if __name__ == '__main__':
    app.run(debug=True)
