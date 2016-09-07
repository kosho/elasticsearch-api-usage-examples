#------------------------------------------------------------
# Elasticserach Snapshot and Restore
#------------------------------------------------------------

# Clean up

DELETE plays
DELETE _snapshot/my_backup
DELETE _snapshot/my_backup/snapshot_1
DELETE _snapshot/my_backup/snapshot_2

# Load sample data

PUT plays/shakespeare/_bulk
{"index":{}}
{"title": "Romeo and Juliet", "year": 1595}
{"index":{}}
{"title": "The Merry Wives of Windsor", "year": 1597}
{"index":{}}
{"title": "Henry V ", "year": 1599}
{"index":{}}
{"title": "Twelfth Night", "year": 1601}

#------------------------------------------------------------
# Add the snapshot location to elasticsearch.yml and restart
# path.repo: ["/mnt/snapshots"]

#------------------------------------------------------------
# Register a snapshot repository

PUT _snapshot/my_backup
{
  "type": "fs",
    "settings": {
      "location": "/mnt/snapshots"
    }
}

# Confirm if it is registered

GET _snapshot/my_backup

# Show all the snapshot repository and settings

GET _snapshot/*

#------------------------------------------------------------
# Snapshot
# `indices` can be specified like "index1,index"

# Take a snapshot

PUT _snapshot/my_backup/snapshot_1
{
  "indices": "plays",
  "ignore_unavailable": true,
  "include_global_state": false
}

# Check the status or the result

GET _snapshot/my_backup/snapshot_1

# All the currently stored snapshots can be listed as below

GET _snapshot/my_backup/*

# or

GET _snapshot/my_backup/_all

# All the currently **running** snapshot jobs can be listed as below

GET _snapshot/my_backup/_current

# Add some data

PUT plays/shakespeare/_bulk
{"index":{}}
{"title": "Sir Thomas More", "year": 1592}
{"index":{}}
{"title": "Measure for Measure", "year": 1603}
{"index":{}}
{"title": "Othello", "year": 1603}

# Take a snapshot

PUT _snapshot/my_backup/snapshot_2
{
  "indices": "plays",
  "ignore_unavailable": true,
  "include_global_state": false
}

# List up all the snapshots

GET _snapshot/my_backup/_all

#------------------------------------------------------------
# Restore

# Close the index

POST plays/_close

# List the available snapshots
# Make sure the name of `snapshot` is `snapshot_1` and `snapshot_2`

GET _snapshot/my_backup/*

# Restore the first snapshot

POST _snapshot/my_backup/snapshot_1/_restore

# Check if only the four documents are restored

GET _cat/indices

# Then, let's restore from the latest snapshot

DELETE plays

POST _snapshot/my_backup/snapshot_2/_restore

# Make `plays` index has seven documents

GET _cat/indices

#------------------------------------------------------------
# Monitor long running snapshot/restore progress

GET _snapshot/_status

GET _snapshot/my_backup/_status

GET _snapshot/my_backup/snapshot_1/_status

GET _snapshot/my_backup/snapshot_2/_status

# Stop the running snapshot/restore operation
# **It will delete your snapshot when completed**

DELETE _snapshot/my_backup/snapshot_1

DELETE _snapshot/my_backup/snapshot_2


