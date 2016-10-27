# Guide to installing Elasticsearch and Kibana

## Elasticsearch

1. Go to [www.elastic.co > Downloads > Elasticsearch](https://www.elastic.co/downloads/elasticsearch) and make sure the URL of the archive (e.g. `https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.0.0.tar.gz`)

2. Run the following command to download and deploy to your local drive

```
$ curl https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.0.0.tar.gz | tar zxf -
```

3. (Optional) Move to `elasticsearch ` directory and install necessary plugins

```
$ yes | bin/elasticsearch-plugin install x-pack
$ bin/elasticsearch-plugin install analysis-icu
$ bin/elasticsearch-plugin install analysis-kuromoji
```

4. Move to `elasticsearch` directory, then type in the following command to launch

```
$ bin/elasticsearch
```

## Kibana

1. Go to [www.elastic.co > Downloads > Kibana](https://www.elastic.co/downloads/kibana) and make sure the URL of an appropriate package (e.g. `https://artifacts.elastic.co/downloads/kibana/kibana-5.0.0-darwin-x86_64.tar.gz`)

2. Run the following command to download and deploy to your local drive

```
$ curl https://artifacts.elastic.co/downloads/kibana/kibana-5.0.0-darwin-x86_64.tar.gz | tar zxf -
```

3. (Optional) Move to `kibana` directory and install plugins

```
$ bin/kibana-plugin install x-pack
```

4. Move to `kibana` directory, then type in the following command to launch

```
$ bin/kibana
```

5. Open http://localhost:5601 with your browser. Type in `elastic/changeme` and the username and the password if you have installed x-pack
