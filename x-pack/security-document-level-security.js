#------------------------------------------------------------
# Elasticserach X-Pack Security (formaly Shield)
#------------------------------------------------------------

# Clean up

DELETE security-sample
DELETE _xpack/security/user/john
DELETE _xpack/security/user/fred
DELETE _xpack/security/role/managers
DELETE _xpack/security/role/users

#------------------------------------------------------------
# Roles and uses

# Create `managers` and `users` role

POST _xpack/security/role/managers
{
  "cluster": [
    "all"
  ],
  "indices": [
    {
      "names": [
        "security-sample"
      ],
      "privileges": [
        "read"
      ],
      "query": {
        "terms": {
          "access_control": ["managers", "users"]
        }
      }
    }
  ]
}

POST _xpack/security/role/users
{
  "cluster": [
    "all"
  ],
  "indices": [
    {
      "names": [
        "security-sample"
      ],
      "privileges": [
        "read"
      ],
      "query": {
        "terms": {
          "access_control": ["users"]
        }
      }
    }
  ]
}

# Create user `john` and `fred`

POST _xpack/security/user/john
{
  "password" : "password",
  "roles" : [ "managers" ],
  "full_name" : "John Doe"
}

POST _xpack/security/user/fred
{
  "password" : "password",
  "roles" : [ "users" ],
  "full_name" : "Fred Bloggs"
}

#------------------------------------------------------------
# Create sammple documents

PUT security-sample/doc/1
{
  "access_control": ["managers", "users"],
  "content": "This document should be readable for managers and users"
}

PUT security-sample/doc/2
{
  "access_control": ["managers"],
  "content": "This document should be readable for managers only"
}

PUT security-sample/doc/3
{
  "access_control": ["users"],
  "content": "This document should be readable for managers and users"
}

#------------------------------------------------------------
# Try searching with different users

# Click on "Copy as cURL" and paste the command to your terminal
# and append `-u fred:password`, then run curl
# Your command will look like:
# `curl -XGET "http://localhost:9200/security-sample/_search" -u fred:password`

GET security-sample/_search

# You must have seen the document 1 and 3

# Again click on "Copy as cURL" and paste the command to your terminal
# and append `-u john:password`, then run curl
# Your command will look like:
# `curl -XGET "http://localhost:9200/security-sample/_search" -u john:password`

GET security-sample/_search

# You must have seen all the documents
