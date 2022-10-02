## Docker Test/Demo

Original author: [Nana Janashia](https://gitlab.com/nanuchi)

A simple demo project using docker with a node app communicating with a mongo container while using mongo express container for db ui

## Notes/commands

```
docker pull mongo
docker pull mongo-express
docker network create mongo-network
```

```
docker run -p 27017:27017 -d `
-e MONGO_INITDB_ROOT_USERNAME=mongoadmin `
-e MONGO_INITDB_ROOT_PASSWORD=coco `
--name mongodbd --net mongo-network `
mongo
```

```
docker run -d -p 8081:8081 `
-e ME_CONFIG_MONGODB_ADMINUSERNAME=mongoadmin `
-e ME_CONFIG_MONGODB_ADMINPASSWORD=coco `
-e ME_CONFIG_MONGODB_SERVER=mongodbd `
--name mongoex-client --network mongo-network `
mongo-express
```

mongo docker configurations: [mongo](https://hub.docker.com/_/mongo)
mongo express configurations: [mongo-express](https://hub.docker.com/_/mongo-express)

```
docker-compose -f docker-compose.yaml up -d
docker-compose -f docker-compose.yaml down
```
