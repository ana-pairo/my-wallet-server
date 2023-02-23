# my-wallet-server

Welcome to my-wallet-server! This is the back-end repository of a web app that helps users to control their expenses and earnings. The API allows users to input their financial transactions and get an overview of their finances.

## Tech Stack

This project was built using the following technologies:

- Node.js
- JavaScript
- Express
- MongoDB

## Endpoints

The following endpoints are available:

- GET `/users`: Returns the data of a user registered in the app.
- POST `/users`: Creates a new user in the app.
- POST `/sessions`: Authenticates a user and returns a uuid token to be used in subsequent requests.
- DELETE `/sessions`: Logs out the current user.
- POST `/wallet`: Creates a new financial transaction for the current user.
- GET `/wallet`: Returns a list of all financial transactions for the current user.

## Running the application locally

To get started, follow these steps:

1. Clone this repository to your local machine.
2. Install the project dependencies by running `npm install`.
3. Create a `.env` file at the root of the project with the following content:
  - `MONGO_URI=<your-mongodb-uri>`
  - `PORT=`
4. Start the server by running `npm start`. If you want to run the app in the development mode with nodemon, start the server by running `npm dev`.
5. If you do not specify the PORT variable on `.env`, the API will be available at the 4000 port through `http://localhost:4000`.

Note: Before starting the server, make sure you have a MongoDB instance running locally or remotely.
