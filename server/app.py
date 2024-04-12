from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from flask_cors import CORS

ES_HOST = 'http://elasticsearch:9200'
INDEX_PRODUCT = 'ecommerce_search'
LIST_FIELDS = ['id', 'category', 'title', 'description', 'brand', 'mrp', 'price',
       'offers', 'stock_availibility', 'product_asin', 'image_urls']


def load_es():
    model = SentenceTransformer('all-mpnet-base-v2')
    client = Elasticsearch(hosts=ES_HOST)
    return model, client

# init app 
app = Flask(__name__)
CORS(app)
model, client = load_es()


@app.route('/')
def hello_geek():
    return '<h1>Hello from Amazon Search</h2>'

@app.route('/search', methods=['GET'])
def search():
    key_search = request.args.get('q', '')
    category = request.args.get('category', '')
    filter = None
    query = {
        "field" : "description_vector",
        "query_vector" : model.encode(key_search),
        "k" : 5,
        "num_candidates" : 50, 
    }

    if category:
        filter = {
            "match": {
                "category": {
                    "query": category,
                    "boost": 0.9
                }
            }
        }

    
    res = client.knn_search(index=INDEX_PRODUCT, knn=query, filter=filter, source=LIST_FIELDS)
    hits = res['hits']['hits']
    response = [{'id': hit['_id'], 'score': hit['_score'], 'data': hit['_source']} for hit in hits]

    return jsonify(response)

@app.route('/search_by_title', methods=['GET'])
def search_title():
    q = request.args.get('query')
    page = int(request.args.get('page', '1'))
    query =  {
        "match": {
            "title": {
                "query": q,
                "boost": 0.7
            }
        }
    }
    knn = {
        "field" : "description_vector",
        "query_vector" : model.encode(q),
        "k" : 10,
        "num_candidates" : 50, 
        "boost": 0.3
    }
    size = 10
    from_ = (page - 1) * size
    res = client.search(index=INDEX_PRODUCT, query=query, knn=knn, size=size, source=LIST_FIELDS, from_=from_)

    hits = res["hits"]["hits"]

    if not hits:
        response = "No matches found"
    else:
        response = [{'id': hit['_id'], 'score': hit['_score'], 'data': hit['_source']} for hit in hits]
    
    return response


if __name__ == '__main__':
    app.run(debug=True)