
# React-Express-Socket-ChatApp

This repo contains code for a real-time chat app. The app is divided into 2 sections **frontend** and **backend**.

## Using the app
To use the app on your local environment
1. clone the github repo into an appropriate directory.
2. cd to that directory.
3. cd to frontend and run
		```
		npm i
		```
4. Similarly , cd to backend and run
		```
		npm i
		```
5. Adjust the link to your local mongodb database.
6. To start the app, cd to frontend ,run

```bash
npm run dev
```

and cd to backend,

```bash
npm run dev
```

7. Make sure to add your .env file in the backend to handle all the secret keys.
		
## Frontend
The frontend is entirely written in **React** in **jsx** using **vite** as the bundler. The styling is done using **tailwind.css** . Other services and packages such as **react-router-dom**, **axios** and mainly **socket.io**. The entire client-side is majorly divided into 3 routes, 
1. Signup
2. Login
3. Chat

The Signup is to create new users, Login is to authenticate the user and provide them with a **jwt** token to enter the chat app.


## Backend

The server of the app is written using **Express.js** and socket connections are managed using **socket.io**. The database is the local server of **mongodb** which is managed using **mongoose**. 

## Working

The app can be opened in the browser and user can login or signup accordingly. The sidebar in the app displays the list of other online users that are available for chat, The user can click on any online user and start a chat with them. 

## Backend Working
As mentioned earlier , server is written in express. There are mainly 2 routes linked with the server:
1. api/auth &rarr; AuthRouter
2. api/user &rarr; UserRouter

### Auth Router
Auth router is linked with authentication and authorisation of the user including **SignUp** and **Login**. The file ***AuthController.js*** manages the entire functionality of Signup and Login. Signup is to register new users while Login is to authenticate existing users and provide them with a session token to enter the app. The **jsonwebtoken** library has been used to provide **jwt** tokens to the users. The utility file handles the process to generate a web token for the authenticated user.

### User Router
User router is linked with registered users in the database and is used to fetch them as required by the app.

## Frontend Working 
**App.jsx** has defined 4 frontend routes. 
1. '/' &rarr; Home(Chat) Page
2. 'login' &rarr; Login Page
3. '/signup' &rarr; Signup Page
4. '/profile' &rarr; Profile Page





