#------------------------------------------------------------
# Mappings
#------------------------------------------------------------

#------------------------------------------------------------
# Index sample documents

# Use _bulk API to index many data

DELETE /library

POST /library/books/_bulk
{"index": {"_id": 1}}
{"title": "The quick brown fox", "price": 5}
{"index": {"_id": 2}}
{"title": "The quick brown fox jumps over the lazy dog", "price": 15}
{"index": {"_id": 3}}
{"title": "The quick brown fox jumps over the quick dog", "price": 8}
{"index": {"_id": 4}}
{"title": "Brown fox and brown dog", "price": 2}
{"index": {"_id": 5}}
{"title": "Lazy dog", "price": 9}

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/bulk.html

#------------------------------------------------------------
# Add mappings

# Every documents has a schema like mapping

GET /library/_mapping

# Add mapping to `my_new_field`

PUT /library/books/_mapping
{
  "books": {
    "properties": {
      "my_new_field": {
        "type": "text"
      }
    }
  }
}

GET /library/_mapping

# Analyzer can be also specified

PUT /library/books/_mapping
{
  "books": {
    "properties": {
      "english_field": {
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}

GET /library/_mapping

# Updating existing field is not allowed

PUT /library/books/_mapping
{
  "books": {
    "properties": {
      "english_field": {
        "type": "double"
      }
    }
  }
}

# Adding mapping does not affect on existing documents

GET /library/books/_search

GET /library/books/_search
{
  "query": {
    "match": {
      "english_field": "fox"
    }
  }
}

# Indexing different data types of documents

POST /log/transactions
{
  "id": 234571
}

POST /log/transactions
{
  "id": 1392.223
}

GET /log/transactions/_search
{
  "query": {
    "bool": {
      "filter": {
        "range": {
          "id": {
            "gt": 1392
          }
        }
      }
    }
  }
}

GET /log/_mapping

GET /log/_search

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/mapping-intro.html
