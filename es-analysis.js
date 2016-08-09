#------------------------------------------------------------
# Analysis
#------------------------------------------------------------

GET /library/_analyze
{
  "tokenizer": "standard",
  "text": "Brown fox brown dog"
}

#------------------------------------------------------------
# アルファベットを小文字にするfilterを加えてみます

GET /library/_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase"],
  "text": "Brown fox brown dog"
}

#------------------------------------------------------------
# URLの部分で指定することも可能です

GET /library/_analyze?tokenizer=standard&filter=lowercase
{
  "text": "Brown fox brown dog"
}

#------------------------------------------------------------
# 複数のfilterを指定することもできます

GET /library/_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase","unique"],
  "text": "Brown brown brown fox brown dog"
}

#------------------------------------------------------------
# Analyzerは、tokenizerとfilter(任意)の組み合わせからなります

GET /library/_analyze?analyzer=standard
{
  "text": "Brown fox brown dog"
}

#------------------------------------------------------------
# Analysisを理解することは非常に重要です
# 以下のふたつは大きな違いがあります

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
# Analysisを理解することは非常に重要です

GET /library/_analyze
{
  "tokenizer": "kuromoji_tokenizer",
  "filter": "kuromoji_tokenfilter",
  "text": "記者が汽車で帰社した"
}
