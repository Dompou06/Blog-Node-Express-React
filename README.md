# Blog Partie Serveur
Appli fullstack réalisée avec NodeJs, Espress, Sequelize, base de données MySQL et React.
---
### Contenu
Ce dépôt contient le développement côtés serveur et client
---
### Application déployée
Visitez l'appli en vous rendant sur le lien : https://dpstudio.alwaysdata.net/blog/
---
### Contents
1. Installation Partie Backend
* [Stack utilisée](#Stack-utilisée)
* [Prérequis](#Prérequis)
* [Démarrage rapide](#Démarrage-rapide)
* [Tests API](#Tests-API)
2. Installation Partie Client
* [Stack utilisée Client](#Stack-utilisée-Client)
* [Prérequis Client](#Prérequis-Client)
* [Démarrage rapide Client](#Démarrage-rapide-Client)
3. [Auteur](#Auteur)
---

## 1 - Backend

### Stack utilisée
- NodeJs
- Express
- Sequelize
- MySQL

### Prérequis
1. NodeJS 16 ou version supérieure depuis https://nodejs.org/en/download/
---
2. Avoir un logiciel de gestion et d'administration de bases de données **MySql** installé ou pouvoir se connecter à un serveur **MySql**
---
3. Clôner le référentiel Github <a href="https://github.com/Dompou06/Blog-Node-Express-React" target="_blank">https://github.com/Dompou06/Blog-Node-Express-React</a>
---
4. Installation
- 1. intialisez NPM : `npm init`
- 2. installez les modules : `npm install`

Ces instructions vont vous permettre d'obtenir une copie fonctionnelle et modulable du projet sur votre poste de travail.
---

### Démarrage rapide
1.	Modifier les données du fichier **.env.txt** selon les indications
2.	Renommer le fichier .env.txt en **.env**
3.	Lancer le serveur local depuis le terminal `npm start`
5.	Copier l’url du serveur local en fonction (ex. : `http://localhost:5000`)
---

### Tests API
L’ensemble des requêtes envoyées au backend sont à retrouver sur la <a href="https://documenter.getpostman.com/view/14239369/2s93JqSkEr" target="_blank">documentation Postman</a>

---

## Installation Partie Client

### Stack utilisée Client
- Create-React-App
- Sass
- Bootstrap
- Formik
- Yup
--- 

### Prérequis Client
1. Installation depuis le dossier front
- 1. intialisez NPM : `npm init`
- 2. installez les modules : `npm install`
2. Connecter l'appli au serveur
Dans **App.js**, indiquez l'adresse du serveur dans **const [urlPath]**. Par exemple en local, http://localhost:5000
---

### Démarrage rapide Client
Dans votre terminal, tapez : npm start
---

## Auteur
Pourrière Dominique

