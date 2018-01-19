#------------------------------------------------------------
# Kuromoji Japanese language analyzer setting example
#------------------------------------------------------------

DELETE /books

# Define Romaji, Katakana, nouns-only and search analyzers

PUT books
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0,
    "index": {
      "analysis": {
        "analyzer": {
          "romaji_search_analyzer": {
            "tokenizer": "kuromoji_search_tokenizer",
            "char_filter": [
              "html_strip",
              "kuromoji_iteration_mark"
            ],
            "filter": [
              "katakana_stemmer",
              "romaji_readingform"
            ]
          },
          "katakana_search_analyzer": {
            "tokenizer": "kuromoji_search_tokenizer",
            "char_filter": [
              "html_strip",
              "kuromoji_iteration_mark"
            ],
            "filter": [
              "katakana_stemmer",
              "katakana_readingform"
            ]
          },
          "kuromoji_search_analyzer": {
            "tokenizer": "kuromoji_search_tokenizer",
            "char_filter": [
              "html_strip",
              "kuromoji_iteration_mark"
            ],
            "filter": [
              "katakana_stemmer"
            ]
          },
          "kuromoji_nouns_analyzer": {
            "tokenizer": "kuromoji_tokenizer",
            "char_filter": [
              "html_strip",
              "kuromoji_iteration_mark"
            ],
            "filter": [
              "kuromoji_nouns"
            ]
          }
        },
        "filter": {
          "romaji_readingform": {
            "type": "kuromoji_readingform",
            "use_romaji": true
          },
          "katakana_readingform": {
            "type": "kuromoji_readingform",
            "use_romaji": false
          },
          "katakana_stemmer": {
            "type": "kuromoji_stemmer",
            "minimum_length": 4
          },
          "kuromoji_nouns": {
            "type": "kuromoji_part_of_speech",
            "stoptags": [
              "接頭詞",
              "接頭詞-名詞接続",
              "接頭詞-動詞接続",
              "接頭詞-形容詞接続",
              "接頭詞-数接続",
              "動詞",
              "動詞-自立",
              "動詞-非自立",
              "動詞-接尾",
              "形容詞",
              "形容詞-自立",
              "形容詞-非自立",
              "形容詞-接尾",
              "副詞",
              "副詞-一般",
              "副詞-助詞類接続",
              "連体詞",
              "接続詞",
              "助詞",
              "助詞-格助詞",
              "助詞-格助詞-一般",
              "助詞-格助詞-引用",
              "助詞-格助詞-連語",
              "助詞-接続助詞",
              "助詞-係助詞",
              "助詞-副助詞",
              "助詞-間投助詞",
              "助詞-並立助詞",
              "助詞-終助詞",
              "助詞-副助詞／並立助詞／終助詞",
              "助詞-連体化",
              "助詞-副詞化",
              "助詞-特殊",
              "助動詞",
              "感動詞",
              "記号",
              "記号-一般",
              "記号-読点",
              "記号-句点",
              "記号-空白",
              "記号-括弧開",
              "記号-括弧閉",
              "記号-アルファベット",
              "その他",
              "その他-間投",
              "フィラー",
              "非言語音",
              "語断片",
              "未知語"
            ]
          }
        },
        "tokenizer": {
          "kuromoji_search_tokenizer": {
            "type": "kuromoji_tokenizer",
            "mode": "search"
          }
        }
      }
    }
  },
  "mappings": {
    "doc": {
      "properties": {
        "title": {
          "type": "text",
          "fielddata": true,
          "analyzer": "kuromoji_search_analyzer"
        },
        "author": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword"
            }
          }
        },
        "body": {
          "type": "text",
          "fielddata": true,
          "analyzer": "kuromoji_search_analyzer",
          "fields": {
            "katakana": {
              "type": "text",
              "analyzer": "katakana_search_analyzer",
              "fielddata": true
            },
            "romaji": {
              "type": "text",
              "analyzer": "romaji_search_analyzer",
              "fielddata": true
            },
            "nouns": {
              "type": "text",
              "analyzer": "kuromoji_nouns_analyzer",
              "fielddata": true
            }
          }
        },
        "timestamp": {
          "type": "date"
        },
        "parentid": {
          "type": "long"
        }
      }
    }
  }
}


GET books/_analyze
{
  "analyzer": "kuromoji_search_analyzer",
  "text": ["今年は、カナダのフォーレイカー山に登ります。"]
}

GET books/_analyze
{
  "analyzer": "katakana_search_analyzer",
  "text": ["今年は、カナダのフォーレイカー山に登ります。"]
}

GET books/_analyze
{
  "analyzer": "romaji_search_analyzer",
  "text": ["今年は、カナダのフォーレイカー山に登ります。"]
}

GET books/_analyze
{
  "analyzer": "kuromoji_nouns_analyzer",
  "text": ["今年は、カナダのフォーレイカー山に登ります。"]
}


# Index sample documents

POST /books/doc/_bulk
{"index": {}}
{"title": "雲南守備兵", "author": "木村荘十", "body": "一九四〇年……曽かつて雲烟万里の秘境として何者の侵攻も許さなかった雲南府も、不安と焦燥の裡うちにその年を越そうとしていた。五華山を中心に、雅致のある黄色い塀や、緑の梁や、朱色の窓を持つ古風な家々を、永い間護まもって来た堅固な城壁も――海抜七千尺に近いこの高原を囲む重畳たる山岳も――空爆の前には何の頼みにもならなかったのである。その宵も南門外の雲南火車站に着いた小さな貧弱な列車からは、溢れるように避難民が吐き出されて火車站のフランス風の玄関から、新市街へ流れ出していた。"}
{"index": {}}
{"title": "ガリバー旅行記", "author": "ジョナサン・スイフト", "body": "私は色々不思議な国を旅行して、様々の珍しいことを見てきた者です。名前はレミュエル・ガリバーと申します。子供のときから、船に乗って外国へ行ってみたいと思っていたので、航海術や、数学や、医学などを勉強しました。外国語の勉強も、私は大へん得意でした。一六九九年の五月、私は『かもしか号』に乗って、イギリスの港から出帆しました。船が東インドに向う頃から、海が荒れだし、船員たちは大そう弱っていました。十一月五日のことです。ひどい霧の中を、船は進んでいました。その霧のために、大きな岩が、すぐ目の前に現れてくるまで、気がつかなかったのです。"}
{"index": {}}
{"title": "夢の如く出現した彼", "author": "青柳喜兵衛", "body": "燃え上った十年、作家生活の火華は火華を産ンで、花火線香の最後に落ちる玉となって消えた夢野久作、その火華は、今十巻の全集となって、世に出ようとしている。久作さんを知ったのは何時の頃からかは、はっきりしない。何でも幼い頃からで、産れながらに知っていたような気もする。「夢野久作ってのが、頻りに探偵小説の様なもの――事実探偵小説の様なものであって、そん処ジョそこらにある様な、単なる探偵小説とは、およそその類をことにしているのである。久作さんは、何んでも、彼でも、探偵小説にせずにはおかないと云った、熱と、力量は自分乍らも相当自身があっただけに、探偵小説なるものを芸術的に、文学的に、グウとレベルを引上げたのである。つまり、何処から見ても立派な芸術的文学とまで発展させていたのであるから、これまでの探偵小説に馴されていた者には、実に探偵小説の様なものであったのである――を書いている奴があるが、あらァ誰かいネ。古い博多の事ばよう知ッとるし、なかなか好い、博多のモンとありゃ、一体誰じゃろうかい」等と、次兵衛イトコ達や、田舎芸術家達の間に、サンザン首をひねらしたものである。"}

# Perform searches

GET books/_search
{
  "query": {
    "match": {
      "body": "外国語"
    }
  },
  "highlight": {
    "fields": {
      "body": {}
    }
  }
}

GET books/_search
{
  "query": {
    "match": {
      "body.katakana": "ショウセツ"
    }
  }
}

GET books/_search
{
  "size": 0, 
  "aggs": {
    "NAME": {
      "terms": {
        "field": "body.nouns",
        "size": 50
      }
    }
  }
}


