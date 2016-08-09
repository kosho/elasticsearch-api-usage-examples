#------------------------------------------------------------
# Mappings
#------------------------------------------------------------

#------------------------------------------------------------
# すべてのdocumentがschemaのようなmappingを持ちます
# 事前に設定することも可能ですし、Elasticsearchに推測させることもできます

GET /library/_mapping

#------------------------------------------------------------
# Mappingの追加

PUT /library/books/_mapping
{
  "books": {
    "properties": {
      "my_new_field": {
        "type": "string"
      }
    }
  }
}

GET /library/_mapping

#------------------------------------------------------------
# analyzerなどを明示することも可能です

PUT /library/books/_mapping
{
  "books": {
    "properties": {
      "english_field": {
        "type": "string",
        "analyzer": "english"
      }
    }
  }
}

GET /library/_mapping

#------------------------------------------------------------
# すでに存在するfieldを変更することはできません

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

#------------------------------------------------------------
# Mappingをアップデートするとdocumentもアップデートされるでしょうか

GET /library/books/_search

GET /library/books/_search
{
  "query": {
    "match": {
      "english_field": "fox"
    }
  }
}

#------------------------------------------------------------
# データタイプが異なったデータを入れた場合はどうなるでしょうか

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
