from pymongo import MongoClient
from config import config

client = MongoClient(config.MONGO_URI)
db = client.loja_de_carros
carros_collection = db['carros']
