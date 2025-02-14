# Neo4j Visualizer

## Introduction
Ce projet est un visualiseur pour Neo4j, permettant de visualiser et d'interagir avec les données stockées dans une base de données Neo4j.

## Prérequis
- Node.js
- Neo4j

## Installation

1. Clonez le dépôt :
  ```bash
  git clone https://github.com/votre-utilisateur/neo4j-visualizer.git
  cd neo4j-visualizer
  ```

2. Lancez docker compose :
  ```bash
  docker compose up -d
  ```

3. Installez les dépendances :
  ```bash
  npm install
  ```

## Lancer l'API

4. Démarrez l'API :
  ```bash
  npm run api:dev
  ```

L'API sera disponible sur `http://localhost:3000`.

## Lancer le Front

5. Démarrez l'application front-end :
  ```bash
  npm run dev
  ```

L'application front-end sera disponible sur `http://localhost:5173`.

## Utilisation
Accédez à `http://localhost:5173` dans votre navigateur pour commencer à utiliser le visualiseur Neo4j.

## Contribuer
Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements que vous souhaitez apporter.

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.