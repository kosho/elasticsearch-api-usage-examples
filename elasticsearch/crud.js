#------------------------------------------------------------
# CRUD operations
#------------------------------------------------------------

#------------------------------------------------------------
# Create and Read

# Index a JSON document with the document ID

DELETE /library

#    +--- Index name
#    |       +--- Type name
#    |       |     +--- Document ID
#    |       |     |
#    V       V     V
PUT /library/books/1
{
  "title": "Norwegian Wood",
  "name": {
    "first": "Haruki",
    "last": "Murakami"
  },
  "publish_date": "1987-09-04T00:00:00+0900",
  "price": 19.95
}

# Read a document with the document ID

GET /library/books/1

# Index a JSON document without the document ID

POST /library/books/
{
  "title": "Kafka on the Shore",
  "name": {
    "first": "Haruki",
    "last": "Murakami"
  },
  "publish_date": "2002-09-12T00:00:00+0900",
  "price": 19.95
}

# Checkout the document ID and read with the document ID

GET /library/books/<document_id>

#------------------------------------------------------------
# Update

# Update with the document ID

PUT /library/books/1
{
  "title": "Norwegian Wood",
  "name": {
    "first": "Haruki",
    "last": "Murakami"
  },
  "publish_date": "1987-09-04T00:00:00+0900",
  "price": 29.95
}

GET /library/books/1

# Partial update of the document by _update API

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
    "price_jpy": 1800
  }
}

GET /library/books/1

#------------------------------------------------------------
# Delete

DELETE /library/books/1

GET /library/books/1

# Delete entire index

DELETE /library

GET /libray/books/2

# More info: https://www.elastic.co/guide/en/elasticsearch/guide/current/data-in-data-out.html
