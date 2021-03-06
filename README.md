# RESTful MEAN Stack Web Application w/ Angular 4

## Prerequisites
[MongoDB](https://www.mongodb.com/) and [Node.js](https://nodejs.org/en/) must be installed on your local environment.

The following global npm packages must also be installed:
1. [Angular-CLI](https://cli.angular.io/) (`npm install -g @angular/cli`)
2. [nodemon](https://nodemon.io/) (`npm install -g nodemon`)

The following environment variables are needed to run the project:

- JRSECRET - Used for JWT auth.

- MONGODB_CONNECTION_URL - Used for connecting to MongoDB within different environments (dev, prod, etc.).

- PORT - Which port to use (*default 3000*).

The following environment variables are needed to communicate with Instagram's API:

 - INSTAGRAM_CLIENT_SECRET - Used for instagram feed auth token request.

- INSTAGRAM_CLIENT_ID - Used for instagram feed auth token request.

- INSTAGRAM_REDIRECT_URI - Redirect url after entering credentials at instagram.com (**This must be a public URL**, so it's impossible to redirect to a local environment).

## Steps to run
This project is composed of two main directories - `/client` and `/server`, each with their own dedicated `package.json` files.


1. Run MongoDB in your local environment (`mongod`).
2. Navigate to `/client`.
3. Execute `npm install` command to install all front-end project dependencies.*
4. Build front-end project:
   * Execute `npm run build-dev` to build for a **development** environment.
   * Execute `npm run build-prod` to build for a **production** environment.
5. Navigate to `/server`.
6. Execute `npm install` command to install all back-end project dependencies.*
7. Execute `nodemon` command to run the back-end project.

&lowast; Step only needs to be completed the very first time you run the project.

## Additional Information
This site is deployed to [AWS EC2](https://aws.amazon.com/ec2/). This [Scotch](https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1) tutorial was followed to deploy this site to AWS EC2.
