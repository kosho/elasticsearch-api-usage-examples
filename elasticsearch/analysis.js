#------------------------------------------------------------
# Analysis
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
# Analyze text with _analyze API

# Use _analyze API to show how Elasticsearch understands tokens

GET /library/_analyze
{
  "tokenizer": "standard",
  "text": "Brown fox brown dog"
}

# Make the text small letters

GET /library/_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase"],
  "text": "Brown fox brown dog"
}

# The tokenizer and the filter can be specified in the URL as well

GET /library/_analyze?tokenizer=standard&filter=lowercase
{
  "text": "Brown fox brown dog"
}

# Aplly multiple filters

GET /library/_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase","unique"],
  "text": "Brown brown brown fox brown dog"
}

# An analyzer consists of tokenizers and filters (optional)
# The standard tokenizer consists of the standard tokenizer and the lowercase filter

GET /library/_analyze?analyzer=standard
{
  "text": "Brown fox brown dog"
}

# Understanding of analysis is the key
# There is differece between those two

GET /library/_analyze?tokenizer=standard&filter=lowercase
{
  "text": "THE quick.brown_FOx Jumped! $19.95 @ 3.0"
}

GET /library/_analyze?tokenizer=letter&filter=lowercase
{
  "text": "THE quick.brown_FOx Jumped! $19.95 @ 3.0"
}

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/analysis-intro.html

#------------------------------------------------------------
# Japanese text analysis

# Use kuromoji for Japanese texts

GET /library/_analyze
{
  "tokenizer": "kuromoji_tokenizer",
  "filter": "kuromoji_tokenfilter",
  "text": "記者が汽車で帰社した"
}
