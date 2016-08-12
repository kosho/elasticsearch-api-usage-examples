#------------------------------------------------------------
# Elasticserach X-Pack Alerting (formaly Watcher)
#------------------------------------------------------------

#------------------------------------------------------------
# Load sample data

DELETE /watcher-demo

PUT /watcher-demo/data/_bulk
{"index":{}}
{"ip": "46.105.14.53", "result": "success" }
{"index":{}}
{"ip": "177.135.170.179", "result": "success" }
{"index":{}}
{"ip": "66.249.73.135", "result": "fail" }
{"index":{}}
{"ip": "208.115.113.88", "result": "success" }
{"index":{}}
{"ip": "198.143.129.170", "result": "success" }
{"index":{}}
{"ip": "208.115.111.72", "result": "success" }
{"index":{}}
{"ip": "50.16.19.13", "result": "fail" }
{"index":{}}
{"ip": "66.249.73.135", "result": "fail" }

#------------------------------------------------------------
# Template

PUT _xpack/watcher/watch/watcher-demo
{
  "trigger": {},
  "input": {},
  "condition": {},
  "transform": {},
  "actions": {}
}

#------------------------------------------------------------
# Trigger

# Every 10 seconds

"trigger": {
    "schedule": { "interval": "10s"}
}

# Minute 15, 45 every hour

"trigger": {
  "schedule": {
    "hourly": { "minute": [15, 45] }
  }
}

# Daily (monthly, yearly, combinations available)

"trigger": {
  "schedule": {
    "daily": { "at": "17:00" }
  }
}

# Cron expression

"trigger" : {
  "schedule" : {
    "cron" : "0 0 12 * * ?"
  }
}

#------------------------------------------------------------
# Input

# Simple

"input": {
  "simple": {
    "name": "John"
  }
}

# Search

"input": {
  "search": {
    "request": {
      "indices": ["watcher-demo"],
      "body": {
        "query": {
          "match": { "result": "fail" }
        }
      }
    },
    "extract": ["hits.total"]
  }
}

# Aggregation

"input": {
  "search": {
    "request": {
      "indices": ["watcher-demo"],
      "body": {
        "size": 0,
        "query": {
          "match": { "result": "fail" }
        },
        "aggs": {
          "agg-fail": {
            "terms": {
              "field": "ip.keyword",
              "order": { "_count": "desc" },
              "size": 10
            }
          }
        }
      }
    }
  }
}

#------------------------------------------------------------
# Conditions

# Always (or `never`)

"condition" : {
  "always" : {}
}

# Compare (eq/not_eq/gt/gte/lt/lte)

"condition" : {
  "compare" : { "ctx.payload.hits.total" : { "gt" : 3 } }
}

# Compare with aggregation result

"condition": {
  "compare": {
    "ctx.payload.aggregations.agg-fail.buckets.0.doc_count": { "gt": 2 }
  }
}

#------------------------------------------------------------
# Actions

# Indexising Action

"actions" : {
  "index_payload" : {
    "transform": { ... },
    "index" : {
      "index" : "login-failures"
    }
  }
}

# Logging Action
"actions": {
  "log": {
    "logging": {
      "text": "Login attempt failed {{ctx.payload.hits.total}} times"
    }
  }
}

# Watch leven and action level throttling is available

"throttle_period" : "15m"

#------------------------------------------------------------
# Consolidated watch example and demo

# Compare with search result

DELETE /login-failures

POST _xpack/watcher/watch/_execute
{
  "watch": {
    "trigger": {
      "schedule": {
        "interval": "10s"
      }
    },
    "input": {
      "search": {
        "request": {
          "indices": ["watcher-demo"],
          "body": {
            "query": {
              "match": { "result": "fail" }
            }
          }
        },
        "extract": ["hits.total"]
      }
    },
    "condition": {
      "compare": { "ctx.payload.hits.total": { "gte": 3 } }
    },
    "actions": {
      "index_payload": {
        "index": {
          "index": "login-failures",
          "doc_type": "log"
        }
      }
    }
  }
}

GET login-failures/_search

# Compare with aggregation

POST _xpack/watcher/watch/_execute
{
  "watch": {
    "trigger": {
      "schedule": { "interval": "10s" }
    },
    "input": {
      "search": {
        "request": {
          "indices": ["watcher-demo"],
          "body": {
            "query": { "match": { "result": "fail" } },
            "aggs": {
              "agg-fail": {
                "terms": {
                  "field": "ip.keyword",
                  "order": { "_count": "desc" },
                  "size": 5
                }
              }
            }
          }
        }
      }
    },
    "condition": {
      "compare": {
        "ctx.payload.aggregations.agg-fail.buckets.0.doc_count": { "gt": 2 }
      }
    },
    "actions": {
      "index_payload": {
        "index": {
          "index": "login-failures",
          "doc_type": "log"
        }
      }
    }
  }
}

# The above condition should not be met, try again after the below indexed

PUT /watcher-demo/data/_bulk
{"index":{}}
{"ip": "66.249.73.135", "result": "fail" }

GET login-failures/_search

# Work with external data source

POST _xpack/watcher/watch/_execute
{
  "watch": {
    "trigger": {
      "schedule": {
        "interval": "10s"
      }
    },
    "input": {
      "chain": {
        "inputs": [
          {
            "first": {
              "search": {
                "request": {
                  "indices": ["watcher-demo"],
                  "body": {
                    "query": {
                      "match_all": { }
                    },
                    "aggs": {
                      "agg-fail": {
                        "terms": {
                          "field": "ip.keyword",
                          "order": { "_count": "desc" },
                          "size": 5
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            "second": {
              "http": {
                "request": {
                  "host": "freegeoip.net",
                  "port": 80,
                  "path": "/json/{{ctx.payload.first.hits.hits.0._source.ip}}"
                }
              }
            }
          }
        ]
      }
    },
    "condition": {
      "compare": {
        "ctx.payload.aggregations.agg-fail.buckets.0.doc_count": {
          "gt": 2
        }
      }
    },
    "actions": {
      "index_payload": {
        "index": {
          "index": "login-failures",
          "doc_type": "log"
        }
      }
    }
  }
}

#------------------------------------------------------------
# Managing watches

# List the watches

GET .watches/_search

# Register a watche

PUT _xpack/watcher/watch/my-watch
{
  ...
}

# Active/deactive a watch

PUT _xpack/watcher/watch/my-watch/_active
{
  ...
}

PUT _xpack/watcher/watch/my-watch/_deactive
{
  ...
}

# Show watch exdcutaion history

GET .watcher-history-*/_search
