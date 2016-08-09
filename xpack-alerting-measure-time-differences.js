#------------------------------------------------------------
# X-Pack Alerting (formaly Watcher) Usage Example
#------------------------------------------------------------
# Measure time difference between two events

DELETE /auth
DELETE /auth-statistics

#------------------------------------------------------------
# Load sample data

PUT /auth/data/_bulk
{"index":{}}
{"@timestamp": "2016-08-09T12:46:12+0900", "session_id": "001", "event": "start", "user": "Tom" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:13+0900", "session_id": "001", "event": "using", "user": "Tom" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:14+0900", "session_id": "001", "event": "end", "user": "Tom" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:13+0900", "session_id": "002", "event": "start", "user": "Samantha" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:14+0900", "session_id": "002", "event": "using", "user": "Samantha" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:16+0900", "session_id": "002", "event": "end", "user": "Samantha" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:14+0900", "session_id": "003", "event": "start", "user": "Niels" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:15+0900", "session_id": "003", "event": "using", "user": "Niels" }
{"index":{}}
{"@timestamp": "2016-08-09T12:46:18+0900", "session_id": "003", "event": "end", "user": "Niels" }

#------------------------------------------------------------
# Run aggregations

GET /auth/_search
{
  "size": 0,
  "aggs": {
    "agg_session_id": {
      "terms": {
        "field": "session_id.keyword"
      }
    }
  }
}

GET /auth/_search
{
  "size": 0,
  "aggs": {
    "agg_session_id": {
      "terms": {
        "field": "session_id.keyword"
      },
      "aggs": {
        "agg_user": {
          "terms": {
            "field": "user.keyword",
            "size": 1
          }
        },
        "agg_start": {
          "min": {
            "field": "@timestamp"
          }
        },
        "agg_end": {
          "max": {
            "field": "@timestamp"
          }
        },
        "agg_duration": {
          "bucket_script": {
            "buckets_path": {
              "min": "agg_start",
              "max": "agg_end"
            },
            "script": "max - min"
          }
        }
      }
    }
  }
}

#------------------------------------------------------------
# Use Exection API of Alerting

# Write aggregated results into another index daily
# `-` in aggregation name will not work in the transform script

PUT _xpack/watcher/watch/_execute
{
  "watch": {
    "trigger": {
      "schedule": {
        "daily": {
          "at": "17:00"
        }
      }
    },
    "input": {
      "search": {
        "request": {
          "indices": [
            "auth"
          ],
          "body": {
            "size": 0,
            "aggs": {
              "agg_session_id": {
                "terms": {
                  "field": "session_id.keyword"
                },
                "aggs": {
                  "agg_user": {
                    "terms": {
                      "field": "user.keyword",
                      "size": 1
                    }
                  },
                  "agg_start": {
                    "min": {
                      "field": "@timestamp"
                    }
                  },
                  "agg_end": {
                    "max": {
                      "field": "@timestamp"
                    }
                  },
                  "agg_duration": {
                    "bucket_script": {
                      "buckets_path": {
                        "min": "agg_start",
                        "max": "agg_end"
                      },
                      "script": "max - min"
                    }
                  }
                }
              }
            }
          }
        },
        "extract": [
          "aggregations.agg_session_id"
        ]
      }
    },
    "condition": {
      "always": {}
    },
    "transform": {},
    "actions": {
      "index_payload": {
        "transform": {
          "script": "return [ _doc : ctx.payload.aggregations.agg_session_id.buckets ]"
        },
        "index": {
          "index": "auth-statistics",
          "doc_type": "log"
        }
      }
    }
  }
}

GET auth-statistics/_search
