{
  "trigger": {
    "schedule": {
      "interval": "1m"
    }
  },
    "input": {
      "chain": {
        "inputs": [
        {
          "first": {
            "http": {
              "request": {
                "scheme": "http",
                "host": "localhost",
                "port": 9200,
                "method": "get",
                "path": "_xpack/ml/anomaly_detectors/{{ctx.metadata.job_id}}/results/buckets",
                "params": {},
                "headers": {},
                "auth": {
                  "basic": {
                    "username": "elastic",
                    "password": "changeme"
                  }
                },
                "body": "{\"anomaly_score\": {{ctx.metadata.threashold}}, \"start\": \"now-5m\"}"
              }
            }
          }
        },
        {
          "second": {
            "http": {
              "request": {
                "scheme": "http",
                "host": "localhost"
                "port": 9200,
                "method": "get",
                "path": "_xpack/ml/anomaly_detectors/{{ctx.metadata.job_id}}/results/influencers",
                "params": {},
                "headers": {},
                "auth": {
                  "basic": {
                    "username": "elastic",
                    "password": "changeme"
                  }
                },
                "body": "{\"start\": \"now-5m\"}"
              }
            }
          }
        }
        ]
      }
    },
    "condition": {
      "compare": {
        "ctx.payload.first.count": {
          "gt": 0
        }
      }
    },
    "actions": {
      "notify-slack": {
        "throttle_period_in_millis": 30000,
        "slack": {
          "message": {
            "from": "Machine Learning Job",
            "text": "Anomaly found by {{ctx.payload.first.buckets.0.job_id}} at {{ctx.execution_time}}.\nInfluenced by:{{#ctx.payload.second.influencers}} * {{influencer_field_name}}: {{influencer_field_value}}\n{{/ctx.payload.second.influencers}}"
          }
        }
      }
    },
    "metadata": {
      "threashold": 70,
      "job_id": "ML_JOB_ID"
    }
}
