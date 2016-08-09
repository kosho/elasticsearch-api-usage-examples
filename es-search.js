#------------------------------------------------------------
# Bulk indexing、search、analysis
#------------------------------------------------------------

#------------------------------------------------------------
# 多くのdocumentを一度にインデックスする場合には、Bulk APIを使用します

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
# 基本的な検索を実行してみましょう
# *すべて*のdocumentを取得します

GET /libray/books/_search

#------------------------------------------------------------
# "fox"が含まれるdocumentを検索します

GET /library/books/_search
{
  "query": {
    "match": {
      "title": "fox"
    }
  }
}

#------------------------------------------------------------
# "quick"もしくは"dog"が含まれるdocumentを検索します

GET /library/books/_search
{
  "query": {
    "match": {
      "title": "quick dog"
    }
  }
}

#------------------------------------------------------------
# "quick dog"というフレーズが含まれるdocumentを検索します

GET /library/books/_search
{
  "query": {
    "match_phrase": {
      "title": "quick dog"
    }
  }
}

#------------------------------------------------------------
# 検索結果は"relevance"によって、順位付けがされています

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
# 論理演算的な方法で、複数のクエリを組み合わせることができます
# "quick"と"lazy dog"が含まれるdocumentを検索します

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

#------------------------------------------------------------
# 組み合わせごとに検索結果を調整することができます

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

#------------------------------------------------------------
# マッチした部分を強調表示することもできます

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
# フィルターすることも可能です
# 一般的にはクエリよりも高速です

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

#------------------------------------------------------------
# $5以上する本は以下のように求められます

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

#------------------------------------------------------------
# "lazy dog"が含まれ、かつ$5以上の本は以下のとおり検索できます

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
