#------------------------------------------------------------
# Cluster settings for development purpose
#------------------------------------------------------------

#------------------------------------------------------------
# Templates

# Single shard, no replicas

PUT _template/my-no-replicas
{
  "template": "*",
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
}

# Fix .monitoring-*

PUT .monitoring-*/_settings
{
    "settings": {
      "number_of_replicas": 0
    }
}

# Enable fielddata for text fieds

PUT _template/my-enable-fielddata
{
  "template": "*",
  "mappings": {
    "_default_": {
      "dynamic_templates": [
        {
          "texts": {
            "mapping": {
              "fielddata": true,
              "type": "text"
            },
            "match_mapping_type": "text",
            "match": "*"
          }
        }
      ]
    }
  }
}
