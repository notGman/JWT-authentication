
# JWT-Authorization

A project using jasonwebtoken package in nodejs, which allows to manage and secure API endpoints from unauthorized users.

## Documentation

Before you deploy the server create a .env file and enter the following Environment variables

```bash
  PORT = *your_desired_port_number*

  MONGO_URL = *your_MongoDB_connection_url*

  TOKEN_KEY = *your_JWT_secret_key*

```

## ENDPOINTS

/register -> Create a new user

/login -> Login existing user

/protected -> JWT protected page

/logout -> Logout user

## Deployment

Get the project source code to you loacl editor

```bash
git clone https://github.com/notGman/JWT-authentication.git
```
Install the dependencies

```bash
npm add
```

To start the server

```bash
npm run dev
```

Connect to your android/ios virtual device to view the app.



