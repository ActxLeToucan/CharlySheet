# CharlySheet
Google Sheets like. 4th year computer science student project at the Faculty of Science and Technology in Nancy.

* [API](./backend/README.md)
* [Frontend](./frontend/README.md)


# Rapport

<!-- logo charlysheet centré avec marqué en texte charlysheet en dessous -->
<p align="center">
  <img src="frontend/public/img/icon.svg" alt="CharlySheet logo" width="200"/>
  <br><br>
  <img src="frontend/public/img/background.png" alt="CharlySheet logo" width="300"/>
</p>

## Fonctionnalités réalisées 
Toute les fonctionnalités de bases :
- Création d'un compte
- Connexion 
- Création d'un document vide
- Ouverture d'un document sauvegardé
- Modification d'un document
- Sauvegarde d'un document
- Supression d'un document

Fonctionnalités demandées : 
- Persistance des données 
> Les documents sont stockés dans une collection MongoDB
- Partage d’un document sauvegardé avec d’autres utilisateurs
> On peut chercher un utilisateur et l'ajouter à la feuille pour qu'il puisse la voir et la  modifier. Elle apparrait ensuite dans son accueil.
- Affichage des utilisateurs travaillant simultanément sur le même document
> Chaque utilisateur présent sur la feuille est affiché en haut à droite de la page avec une couleur unique et cette couleur est réutilisée pour afficher la case qu'il est en train de consulter en temps réel.
- Mise à jour en temps réel de l’affichage (prise en compte des modifications des autres
utilisateurs)
> L'action de selectionner une cellule ou d'en changer le contenu est automatiquement repercuté chez les autres utilisateurs de la feuille.

Fonctionnalités supplémentaires :
- Gestions des conflits en cas de modifications simultanées d'une même cellule
> Nous avons fais le choix de ne pas laisser de conflit arriver mais de toujours prévoir le résultat, quand un utilisateur selectionne une cellule en premier il en devient le proprietaire et le champ formule pour cette cellule se retrouve vérouillé chez les autres utilisateurs. D'où l'utilisation de ``Mutex`` dans le code du serveur avec ``socket.io``

## Choix de conception

### Architecture de l'application CharlySheet
CharlySheet est une application web qui imite Google Sheets. Elle est de type rendu côté client et est donc séparé en deux parties : le backend et le frontend.

### Backend
Le backend de CharlySheet est construit avec Node.js et Express.js. Il sert d'API REST pour le frontend mais aussi de relais pour la partie temps réel de l'application.
- ``express`` : pour la création du serveur HTTP et la gestion des routes.
- ``mongoose`` : pour la connexion à la base de donnée MongoDB et la manipulation des données.
- ``jsonwebtoken`` et passport : pour l'authentification
- ``joi`` : pour la validation des données entrantes.
- ``winston`` : pour la journalisation.
- ``socket.io`` : pour la communication en temps réel entre le serveur et le client.

### Frontend
Le frontend de CharlySheet est construit avec Vue.js. Il communique avec le backiend via des requêtes HTTP à l'API REST et avec ``socket.io`` qui utilise WebSocket quand il le peut via son mecanisme d'upgrade ou le long-polling. Les principales bibliothèques utilisées sont :
- ``vue`` : pour la création de l'interface utilisateur.
- ``vue-router`` : pour la navigation entre les différentes pages de l'application.
- ``socket.io-client`` : pour la communication en temps réel avec le serveur.
- ``js-formula-parser`` : pour l'interpétation des formules dans les cellules.
- ``highlight.js`` : pour la coloration syntaxique.