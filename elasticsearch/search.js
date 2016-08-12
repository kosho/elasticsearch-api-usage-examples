#------------------------------------------------------------
# Search
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
# Search basics

# Get **all** the documents

GET /library/books/_search

# Search documents wich contain "fox" with `match` query

GET /library/books/_search
{
  "query": {
    "match": {
      "title": "fox"
    }
  }
}

# Search documents which contain "quick" or "dog"

GET /library/books/_search
{
  "query": {
    "match": {
      "title": "quick dog"
    }
  }
}

# Search documents which contain "quick dog" with `match_phrase`


GET /library/books/_search
{
  "query": {
    "match_phrase": {
      "title": "quick dog"
    }
  }
}

# Relevance

GET /library/books/_search
{
  "query": {
    "match": {
      "title": "quick"
    }
  }
}

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/relevance-intro.html

#------------------------------------------------------------
# Bool query
# Search documents which contain "quick" and "lazy dog"


GET /library/books/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "quick"
          }
        },
        {
          "match_phrase": {
            "title": "lazy dog"
          }
        }
      ],
      "must_not": [
        {}
      ],
      "should": [
        {}
      ]
    }
  }
}

# Weigh the query result

GET /library/books/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase": {
            "title": {
              "query": "quick dog",
              "boost": 0.5
            }
          }
        },
        {
          "match_phrase": {
            "title": {
              "query": "lazy dog"
            }
          }
        }
      ]
    }
  }
}

# Highlight matched terms

GET /library/books/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match_phrase": {
            "title": {
              "query": "quick dog",
              "boost": 0.5
            }
          }
        },
        {
          "match_phrase": {
            "title": {
              "query": "lazy dog"
            }
          }
        }
      ]
    }
  },
  "highlight": {
    "fields": {
      "title": {}
    }
  }
}

#------------------------------------------------------------
# Filtering

# Filter the books the price between 5 to 10

GET /library/books/_search
{
  "query": {
    "bool": {
      "filter": {
        "range": {
          "price": {
            "gte": 5,
            "lte": 10
          }
        }
      }
    }
  }
}

# Filter the books price is higher than 5

GET /library/books/_search
{
  "query": {
    "bool": {
      "filter": {
        "range": {
          "price": {
            "gte": 5
          }
        }
      }
    }
  }
}

# Filter the books price is higher than 5,
# then search the documents which contain "lazy dog"

GET /library/books/_search
{
  "query": {
    "bool": {
      "must": [{
        "match_phrase": {
          "title": "lazy dog"
        }
        }],
      "filter": {
        "range": {
          "price": {
            "gte": 5
          }
        }
      }
    }
  }
}

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/structured-search.html
