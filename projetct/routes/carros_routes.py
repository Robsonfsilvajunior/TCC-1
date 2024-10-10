from flask import Blueprint, jsonify, request
from models import carros_collection
from bson.objectid import ObjectId

carros_bp = Blueprint('carros', __name__)

# Rota para obter todos os carros
@carros_bp.route('/', methods=['GET'])
def get_carros():
    carros = list(carros_collection.find({}, {'_id': 0}))  # Remove o '_id' para evitar problemas no frontend
    return jsonify(carros)

# Rota para buscar carros por nome ou modelo
@carros_bp.route('/search', methods=['GET'])
def search_carros():
    query = request.args.get('q', '')
    regex = {'$regex': query, '$options': 'i'}
    resultados = carros_collection.find({
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
@carros_bp.route('/<carro_id>', methods=['GET'])
def get_carro(carro_id):
    carro = carros_collection.find_one({'_id': ObjectId(carro_id)})
    if carro:
        carro['_id'] = str(carro['_id'])
        return jsonify(carro)
    else:
        return jsonify({'error': 'Carro não encontrado'}), 404
