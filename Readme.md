# Fena Task

(https://github.com/potdarprasad/fena_task)

## Description
Fena Task is a web application that allows users to trigger the sending of a large number of emails through a simple input box and send button on the frontend. The application follows a distributed and asynchronous approach to handle email sending efficiently.

## Technologies Used

The Fena Task application is built using the following technologies:

- RabbitMQ: A message queue that handles email sending jobs in an asynchronous and scalable manner.

- Redis: A fast and efficient in-memory data store used to cache and manage job status information.

- NestJS: A Node.js framework that provides a solid foundation for building backend applications with TypeScript and follows the principles of Dependency Injection and SOLID design.

- React: A popular JavaScript library for building user interfaces, providing a fast and interactive frontend experience.


## Task Requirements
1. Input Box for Email Count: The frontend provides a simple input box where the user can enter the number of emails to send (e.g., 100000) and a "Send" button to initiate the process.

2. Immediate Job ID: Upon clicking the "Send" button, the frontend communicates with the backend, which responds with a unique job ID or email sending ID instantly. This ID represents the email sending task initiated by the user.

3. Kafka Queue Integration: The backend adds the email sending job to a Kafka queue (or any other message queue) for asynchronous processing. This ensures that the sending of emails is handled efficiently and doesn't block the main application.

4. Worker for Email Sending: Workers (backend processes) continuously monitor the Kafka queue for incoming email sending jobs. When a job is picked up, the worker processes the task. However, the actual sending of emails is commented out in the worker implementation for the sake of demonstration.

5. Real-time Status Update: The frontend updates the user with the real-time status of how many emails have been sent. This information is fetched from the backend, where the worker updates the job's progress.

6. Persistent Job Status: The application ensures that job status is persisted so that users can close their browsers and return later to check the status of a previously initiated job.

## Table of Contents

- [Installation](#installation)
- [Running the App with Docker Compose](#running-the-app-with-docker-compose)
- [Running the App Locally](#running-the-app)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [TODO](#todo-setting-up-authentication)

## Installation

Please follow these steps to get the project up and running on your local machine:

1. Clone the repository: `git clone https://github.com/potdarprasad/fena_task.git`
2. Navigate to the project directory: `cd fena_task`
3. [Additional steps, if required, to set up dependencies or configurations]

## Running the App with Docker Compose
Follow this steps to run app:

1. Navigate to the project directory if you're not already there: `cd fena_task`
2. Build and start the containers using Docker Compose: `docker-compose up --build`
3. To stop the containers and remove the resources, use the following command: `docker-compose down`
4. Frontend is accessible at `http://localhost:3000` in your web browser
5. Backend is accessible at `http://localhost:4000`


## Running the App Locally

Before running the app, make sure that you have installed redis and rabbitmq locally.

### Backend

To run the backend of the application, follow these steps:

1. Navigate to the backend directory: `cd backend`
2. Create .env file in backend folder and copy content from .env.local to .env
3. Install dependencies: `yarn install` (or `npm install` if you prefer using npm)
4. Set up any required configurations (e.g., database connection, environment variables).
5. Start the backend server: `yarn start` (or `npm start:dev`)
6. The backend should now be running at `http://localhost:4000`.

### Frontend

To run the frontend of the application, follow these steps:

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `yarn install` (or `npm install` if you prefer using npm)
3. Start the development server: `yarn start` (or `npm start`)
4. The frontend should now be accessible at `http://localhost:3000` in your web browser.

## TODO: Setting up Authentication