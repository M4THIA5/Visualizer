# Utiliser l'image officielle de Neo4j
FROM neo4j:latest

# Passer en root pour pouvoir installer des packages
USER root

# Installer curl
RUN apt-get update && \
    apt-get install -y curl && \
    curl -L https://github.com/neo4j-labs/neosemantics/releases/download/5.5.0/apoc-5.5.0-all.jar -o /var/lib/neo4j/plugins/apoc.jar
