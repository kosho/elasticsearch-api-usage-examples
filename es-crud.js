#------------------------------------------------------------
# Document CRUD operations
#------------------------------------------------------------

#------------------------------------------------------------
# JSON documentをインデックスします

#    +--- Index name
#    |       +--- Type name
#    |       |     +--- Document ID
#    |       |     |
#    V       V     V
PUT /library/books/1
{
  "title": "A fly on the wall",
  "name": {
    "first": "Drosophila",
    "last": "Melanogaster"
  },
  "publish_date": "2016-07-11T11:11:11+0900",
  "price": 19.95
}

#------------------------------------------------------------
# IDでdocumentを取得します

GET /library/books/1

#------------------------------------------------------------
# IDを指定しなくてもdocumentを追加することが可能です

POST /library/books/1
{
  "title": "A fly on the wall",
  "name": {
    "first": "Drosophila",
    "last": "Melanogaster"
  },
  "publish_date": "2016-07-11T11:11:11+0900",
  "price": 19.95
}

#------------------------------------------------------------
# ただし、documentの取得には自動生成されたIDが必要です

GET /library/books

#------------------------------------------------------------
# アップデートするとdocumentは上書きされます

POST /library/books/1
{
  "title": "A fly on the wall Part 2",
  "name": {
    "first": "Drosophila",
    "last": "Melanogaster"
  },
  "publish_date": "2016-07-11T11:11:11+0900",
  "price": 29.95
}

GET /library/books/1

#------------------------------------------------------------
# 部分的な更新はUpdate APIを使用します

POST /library/books/1/_update
{
  "doc": {
    "price": 10
  }
}

GET /library/books/1

POST /library/books/1/_update
{
  "doc": {
    "cn_price": 10
  }
}

GET /library/books/1

#------------------------------------------------------------
# 削除することも可能です

DELETE /library/books/1

GET /library/books/1

#------------------------------------------------------------
# index自体を削除することも可能ですが、ご注意ください!

DELETE /library/books

GET /libray/books/2

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/data-in-data-out.html
