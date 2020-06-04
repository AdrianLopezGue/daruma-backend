<h1 align="center">
  <br>
  <a href="https://github.com/AdrianLopezGue/daruma-backend"><img src="https://raw.githubusercontent.com/AdrianLopezGue/daruma-frontend/master/assets/daruma-logo-black.png" alt="Daruma Logo" width="200"></a>
  <br>
  🎎 Daruma - Backend 🎎
  <br>
</h1>

<h4 align="center">Shared expenses management system build on top of <a href="https://nestjs.com/" target="_blank" style="color:#ED1543;">NestJS</a> and <a href="https://flutter.dev/" target="_blank" style="color:##0276E8;">Flutter</a>.</h4>

## Table of Contents
* [About the Project](#about-the-project)
* [Key Features](#key-features)
* [Install, build and run!](#download)
* [Built With](#build)
* [Related](#related)
* [License](#license)
* [Contact](#contact)


## About the project
This repository holds my final year project during my time at the University of Córdoba titled "Daruma, shared expenses management system" built with NestJS framework.

The purpose of this project is to learn new technologies like NestJS and Flutter and apply concepts about Software Desing like Domain-Driven-Desing, CQRS, Event Sourcing, Clean code, unit, integration and End-to-End testing, etc.

## Key Features

* **Design**: Event modeling.
* **Arquitecture**: Hexagonal Arquitecture following Domain-Driven-Design concepts.
* **Database management**: CQRS and Event Sourcing patterns.
 - **Read model**: MongoDB.
 - **Write model**: Event Store.
* **Unit and integration testing**: Jest.
* **End-to-End testing**: Cypress.

## Install, build and run!

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/AdrianLopezGue/daruma-backend

# Go into the repository
$ cd daruma-backend

# Install dependencies
$ npm install

# Start docker containers (MongoDB and Event Store)
$ docker-compose up  -d

# Run the server app
$ npm run start:prod
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.


## Built With

This software uses the following packages:

- [NestJS](https://nestjs.com/)
- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Cypress](https://www.cypress.io/)

## Related

[Daruma - Frontend](https://github.com/AdrianLopezGue/daruma-frontend) - Frontend part of Daruma.

## License

[GNU Affero General Public License v3 (AGPL)](https://www.gnu.org/licenses/agpl-3.0.en.html)

## Contact

> GitHub - [@AdrianLopezGue](https://github.com/AdrianLopezGue) 
> LinkedIn - [Adrián López Guerrero](https://www.linkedin.com/in/adrianlopezgue/)
