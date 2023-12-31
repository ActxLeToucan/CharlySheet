# CharlySheet
Similaire à Google Sheets. Projet d'étudiant en 4ème année d'informatique à la Faculté des Sciences et Technologies de Nancy.

Une instance de CharlySheet est disponible à l'adresse suivante : https://charlysheet.projects.antoinectx.fr

# Installation et utilisation

* [API](./backend/README.md)
* [Frontend](./frontend/README.md)


# Rapport à destination de l'enseignant

<!-- logo charlysheet centré avec marqué en texte charlysheet en dessous -->
<p align="center">
  <img src="frontend/public/img/icon.svg" alt="CharlySheet logo" width="200"/>
  <br><br>
  <img src="frontend/public/img/background.png" alt="CharlySheet logo" width="300"/>
</p>

## Fonctionnalités réalisées 
### Fonctionnalités de base : 
- Création d'un compte
- Connexion / Déconnexion
- Création d'un document vide
- Ouverture d'un document sauvegardé
> La modification se fait toujours en temps réel avec une sauvegarde en continu
- Modification d'un document
- Sauvegarde d'un document
- Supression d'un document

### Fonctionnalités demandées : 
- Persistance des données 
> Les documents sont stockés dans une collection MongoDB, ils peuvent être aussi importer/exporter en fichier .JSON.
- Partage d’un document sauvegardé avec d’autres utilisateurs
> On peut chercher un utilisateur et l'ajouter à la feuille pour qu'il puisse la voir et la  modifier. Elle apparrait ensuite dans son accueil.
- Affichage des utilisateurs travaillant simultanément sur le même document
> Chaque utilisateur présent sur la feuille est affiché en haut à droite de la page avec une couleur unique et cette couleur est réutilisée pour afficher la case qu'il est en train de consulter en temps réel.
- Mise à jour en temps réel de l’affichage (prise en compte des modifications des autres
utilisateurs)
> L'action de selectionner une cellule ou d'en changer le contenu est automatiquement repercuté chez les autres utilisateurs de la feuille.

### Fonctionnalités supplémentaires :
- Gestions des conflits en cas de modifications simultanées d'une même cellule
> Nous avons fais le choix de ne pas laisser de conflit arriver mais de toujours prévoir le résultat, quand un utilisateur selectionne une cellule en premier il en devient le proprietaire et le champ formule pour cette cellule se retrouve vérouillé chez les autres utilisateurs. D'où l'utilisation de ``Mutex`` dans le code du serveur avec ``Socket.io``
- Chat
> Comme ``Socket.io`` nous permet d'echanger en temps réel avec les clients nous avons ajoutées un chat non persistent pour chaque feuille.
- Modification d'un compte
> Chaque utilisateur peut modifier les informations de son compte ou supprimer son compte.

## Choix de conception

### Architecture de l'application CharlySheet
CharlySheet est une application web qui imite Google Sheets. Elle est de type rendu côté client et est donc séparé en deux parties : le backend et le frontend.

### Backend
Le backend de CharlySheet est construit avec Node.js et Express.js. Il sert d'API REST pour le frontend mais aussi de relais pour la partie temps réel de l'application.
- ``express`` : pour la création du serveur HTTP et la gestion des routes.
- ``mongoose`` : pour la connexion à la base de donnée MongoDB et la manipulation des données.
- ``jsonwebtoken`` et ``passport`` : pour l'authentification
- ``joi`` : pour la validation des données entrantes.
- ``winston`` et ``morgan`` : pour la journalisation.
- ``socket.io`` : pour la communication en temps réel entre le serveur et le client.
- ``swagger`` : pour la documentation de l'API.

Divers middlewares sont également utilisés pour sécuriser, compresser, ... les requêtes HTTP.

L'architecture de l'API s'inspire de celle utilisée par la Direction du Numérique de l'UL dans ses API TypeScript.

Point intéressant et documenté : 
[SocketIOEventHandlers.js](./backend/src/handlers/SocketIOEventHandlers.js)

### Frontend
Le frontend de CharlySheet est construit avec Vue.js. Il communique avec le backiend via des requêtes HTTP à l'API REST et avec ``socket.io`` qui utilise WebSocket quand il le peut via son mecanisme d'upgrade ou le long-polling. Les principales bibliothèques utilisées sont :
- ``vue`` : pour la création de l'interface utilisateur.
- ``vue-router`` : pour la navigation entre les différentes pages de l'application.
- ``socket.io-client`` : pour la communication en temps réel avec le serveur.
- ``js-formula-parser`` : pour l'interpétation des formules dans les cellules.
- ``highlight.js`` : pour la coloration syntaxique.

## Problèmes rencontrés

JavaScript est un langage non typé, donc des bugs apparraissent facilement dans le code. Nous avions l'habitude de travailler avec TypeScript sur nos autres projets pour palier à cela. Cependant, l'enseignant a souhaité que nous restions en JavaScript "pur", ce qui a entrainé une perte de temps assez importante et des prises de têtes, surtout que les IDEs ont bien plus de mal à nous assister et se trompent régulièrement dans les types.

Les opérations d'upsert avec Mongoose sont très mal documentées (documentation fausse ou inexistante) et certaines opérations ne sont possibles qu'avec un cluster MongoDb , après plusieurs bugs une partie du code mongoose a été remplacé par des opérations directement sur les collections javascript pour être sûr du résultat même si c'est moins optimisé.

## Déroulé du projet
Nous avons commencé par créer l'API Rest permettant de créer des utilisateurs et des feuilles en soignant la documentation tandis que les pages de connexion/inscription, accueil étaient en train d'être créées.

Puis nous avons développé la communication en temps réel entre les utilisateurs pour modifier une feuille.

## FAQ
* **Pourquoi CharlySheet ?**\
  *Charly* pour Charlemagne, car nous sommes tous les quatre fiers d'avoir étudié à l'IUT Nancy-Charlemagne.
  Et *Sheet* pour "feuille" en anglais.
