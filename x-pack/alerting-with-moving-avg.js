#------------------------------------------------------------
# Elasticserach X-Pack Alerting (formaly Watcher)
# Example: Alert when the average of 
# the latest sum of byte bucket is 
# 120% greater than the moving average.
#------------------------------------------------------------

DELETE apache_elk_alerting

# For realtime data, the timestamp of the range query can be "now-30d/d"

POST _xpack/watcher/watch/_execute
{
  "watch": {
    "trigger": {
      "schedule": {
        "interval": "1d"
      }
    },
      "input": {
        "search": {
          "request": {
            "indices": [
              "apache_elk_example"
            ],
            "body": {
              "size": 0,
              "query": {
                "range": {
                  "@timestamp": {
                    "gte": "2015-09-21T00:00:00.000Z||-30d"
                  }
                }
              },
              "aggs": {
                "agg_day": {
                  "date_histogram": {
                    "field": "@timestamp",
                    "interval": "day"
                  },
                  "aggs": {
                    "agg_bytes": {
                      "sum": {
                        "field": "bytes"
                      }
                    },
                    "agg_moving_avg": {
                      "moving_avg": {
                        "buckets_path": "agg_bytes"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "condition": {
        "script": {
          "inline" : "return ctx.payload.aggregations.agg_day.buckets.29.agg_bytes.value > ctx.payload.aggregations.agg_day.buckets.29.agg_moving_avg.value * 1.2"
        }
      },
      "actions": {
        "index_payload": {
          "index": {
            "index": "apache_elk_alerting",
            "doc_type": "log"
          }
        }
      }
  }
}

GET apache_elk_alerting/_search
