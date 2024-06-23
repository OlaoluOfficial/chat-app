# Peer 2 Peer Chat Application

This is a fullstack application developed with React native, so as to have different views and feels (For web, ios and andriod) and also to have an edge 👀. 
The focus was solely on the web due to time constraints.

## Requirements

- Node.js
- npm

## Setup

### server

1. Navigate to the server directory:
    ```bash
    cd BackEnd
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the server:
    ```bash
    npm start

4. Env: PORT, MONGODB_URL
    Please connect to either mongodb atlas or compass to test appropriately.
    ```

### Client

1. Navigate to the client directory:
    ```bash
    cd FrontEnd
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the client:
    ```bash
    npm start

    - For Web: (Recommended)
      npm run web

    - For ios:
      npm  run ios

    - For Android
      npm run android
    ```

## Features

- SignUp with name, email and phone number
- Direct messaging between users
- Online status indicator
- Temporary message storage for offline users
- Logout