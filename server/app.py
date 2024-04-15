from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from flask_cors import CORS
import logging

ES_HOST = 'http://elasticsearch:9200'
INDEX_PRODUCT = 'ecommerce_search'
LIST_FIELDS = ['id', 'category', 'title', 'description', 'brand', 'mrp', 'price',
       'offers', 'stock_availibility', 'product_asin', 'image_urls']
SIZE = 12
logging.basicConfig(level=logging.INFO)
def load_es():
    model = SentenceTransformer('all-MiniLM-L6-v2')
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
    q = request.args.get('query', ' ')
    page = int(request.args.get('page', '1'))
    sort_by = request.args.get('sortBy', '')
    category = request.args.get('category', '')
    sort = []
    filters = None
    query =  {
        "match": {
            "title": {
                "query": q,
                "boost": 0.2
            }
        }
    }
    knn = {
        "field" : "description_vector",
        "query_vector" : model.encode(q),
        "k" : SIZE,
        "num_candidates" : 50, 
        "boost": 0.8
    }
    if category and category!='All':
        filters = {
            "match":{
                "category": category
            }
        }    
    if sort_by:
        if sort_by == 'Price: Low to High':
            sort.append({
                    "price": {
                        "order": "asc"
                    }
                }
            )
        elif sort_by == 'Price: High to Low':
            sort.append(
                {
                    "price": {
                        "order": "desc"
                    }
                }
            )
    from_ = (page - 1) * SIZE
    sort.append('_score')
    res = client.search(index=INDEX_PRODUCT, query=query, knn=knn, size=SIZE, source=LIST_FIELDS, from_=from_, sort=sort,post_filter=filters)

    hits = res["hits"]["hits"]

    if not hits:
        response = "No matches found"
    else:
        response = [{'id': hit['_id'], 'score': hit['_score'], 'data': hit['_source']} for hit in hits]
    
    return response


if __name__ == '__main__':
    app.run(debug=True)