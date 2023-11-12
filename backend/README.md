# CharlySheet API

## Développement
### Configuration de l'environnement
Dupliquer le fichier [`.env.dist`](.env.dist) en `.env`.\
Renseigner les variables d'environnement manquantes.

Dupliquer le fichier [`docker-compose.dev.yml.dist`](docker-compose.dev.yml.dist) en `docker-compose.dev.yml`.\
Modifier les informations de connexion à la base de données si besoin.

### Installation des dépendances
Exécuter la commande ```npm ci```.

### Lancement du projet
Exécuter la commande ```npm run dev:db``` pour lancer la base de données.

Exécuter la commande ```npm run dev```.\
L'application va tourner en mode watch, et sera accessible à l'adresse `{HOST}:{PORT}` (cf. [.env](.env)).

## Déploiement
### Build simple
Pour lancer le serveur, exécutez la commande ```npm run start```.

### Docker
Dupliquer le fichier [`docker-compose.yml.dist`](docker-compose.yml.dist), le renommer en `docker-compose.yml`.\
Configurer les variables d'environnement manquantes, et si besoin, modifier la configuration.

Exécuter la commande ```npm run prod``` pour construire et lancer l'image docker de l'application.

## Documentation
La documentation (OpenAPI) est disponible après le lancement du serveur.\
Une documentation existe pour chaque version de l'API à l'adresse `{HOST}:{PORT}/{version}/docs`.

Versions de l'API disponibles :
- v1
