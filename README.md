# UserManager-API

UserManager-API

<br/>

## Stack

<details>
<summary>Backend</summary>

- TypeScript: 4.8
- Node: v18.17
- Web framework: Express.js
- ORM framework: TypeORM
- Logger: winston
- DI: tsyringe
- File storage: local
- validation: express-validation
- Client-Server real-time communication: Engine.io

</details>

## Installation

<details>
<summary>Development</summary>

1.  Install dependencies (`npm install`).
2.  Copy `.env` file from `.env.example` by `cp .env.example .env` and edit `.env`  file with your variables (you can use default variables without changing anything)
3.  Initialize docker containers

    ```sh
    npm run dc-up
    ```

4.  Prepare database (migrations, seeders).

    ```sh
    npm run db:setup
    ```

    -   If you want to rebuild DB then use same script `npm run db:setup`

5.  Start backend.

    ```sh
    npm run dev
    ```

</details>

## Authentication for Endpoints

To interact with the API endpoints, such as through Postman, you need to include a `Bearer` token for authorization. The application uses a simple token-based security mechanism for accessing the endpoints.

Add the following token to the `Authorization` header in your requests:

-   You can find the token in the `.env` file under the `AUTH_TOKEN` variable:
-   This token will grant you access to the protected endpoints.
