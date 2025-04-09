<a name="readme-top"></a>


# 📗 Table of Contents
- [📖 About the Project](#about-project)

  - [🛠 Built With](#built-with)

    - [Tech Stack](#tech-stack)

    - [Key Features](#key-features)

  - [🚀 Live Demo](#live-demo)

- [💻 Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)

  - [Setup](#setup)

  - [Install](#install)

  - [Environment Setup](#environment_setup)

  - [Start Postgres](#start_postgres)
  
  - [Run Prisma Migations](#prisma)
  
  - [Usage](#usage)
  
  - [Run tests](#run-tests)

  - [Deployment](#deployment)

- [👥 Authors](#authors)

- [🔭 Future Features](#future-features)



<!-- PROJECT DESCRIPTION -->



# 📖 NestJS GraphQL API with Authentication <a name="about-project"></a>



**NestJS GraphQL API with Authentication** is a RESTful API service using NestJS with TypeScript that supports user authentication (standard and biometric), registration, and utilizes Prisma as the ORM. The API is exposed through GraphQL.



## 🛠 Built With <a name="built-with"></a>



### Tech Stack <a name="tech-stack"></a>


<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nestjs.com/">NestJS</a></li>
    <li><a href="https://www.typescriptlang.org/">TypeScript</a></li>
    <li><a href="https://graphql.org/">GraphQL</a></li>
    <li><a href="https://www.prisma.io/">Prisma</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>


### Key Features <a name="key-features"></a>



-   **User Registration:** Allows users to create new accounts with email and password.
-   **User Login:** Supports standard email/password login and biometric key login.
-   **Biometric Authentication:** Enables users to register and login using biometric keys.




<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LIVE DEMO -->



## 🚀 Live Demo <a name="live-demo"></a>


- [Coming Soon](https://google.com)



<p align="right">(<a href="#readme-top">back to top</a>)</p>




## 💻 Getting Started <a name="getting-started"></a>

This project uses [pnpm](https://pnpm.io/) as the package manager.

> 💡 We recommend using `pnpm` to ensure consistency with the lockfile and avoid dependency issues.

However, if you're more comfortable with `npm` or `yarn`, you may use them — but we do not guarantee compatibility.

To get a local copy up and running, follow these steps.



### Prerequisites



In order to run this project you need:

-   Node.js (v18 or later)
-   PNPM or NPM or Yarn
-   Docker and Docker Compose (for PostgreSQL)


### Setup



Clone this repository to your desired folder, open your termival and type:

```sh

  git clone https://github.com/LIBERCOSOFT/nestjs-auth.git

```



### Install



Install this project's dependencies with either Yarn or NPM or PNPM:


```sh

  cd nestjs-auth

  npm/yarn/pnpm install

```

### Environment Setup



Create a .env file in the root directory:


```env

  DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:<DATABASE_PORT>/<DATABASE_NAME>"

  JWT_SECRET="your-secret-key"

```



### Start PostgreSQL with Docker



To run the project with Docker, execute the following command:


```sh

  docker-compose up -d


```

OR

To run the project with Docker with Yarn or NPM or PNPM, execute the following command:

```sh

 pnpm run db:up

 or

 npm run db:up

 or

 Yarn run db:up


```


### Run Prisma Migrations



To run the Prisma migrations, run the following command:



```sh

  pnpm prisma generate

  pnpm prisma migrate dev --name init

  or

  npx prisma generate

  npx prisma migrate dev --name init

  or

  yarn prisma generate

  yarn prisma migrate dev --name init


```

OR

To run the Prisma migrations with Yarn or NPM or PNPM, run the following command:


```sh

  pnpm run migrate:dev

  or

  npm run migrate:dev

  or

  yarn run migrate:dev


```


### Usage



You can run the development server with Yarn or NPM or PNPM using:


```sh
  
  pnpm run start:dev

  or

  npm run start:dev

  or

  yarn run start:dev

```

> GraphQL Playground available at: ```http://localhost:3000/graphql```

### Test


You can run the tests with Yarn or NPM or PNPM using:


```sh

  pnpm test

  or

  npm test

  or

  yarn test

```

#### GraphQL Testing

You can find useful sample GraphQL operations for testing in [`/graphql/playground/collection.md`](./graphql/playground/collection.md).


### Deployment

Deploy this project using your preferred service (Heroku, Render, DigitalOcean, etc.). Ensure that environment variables are properly configured.




<p align="right">(<a href="#readme-top">back to top</a>)</p>




## 👥 Authors <a name="authors"></a>


👤 **Kolapo Akinrinlola**

- GitHub: [LIBERCOSOFT](https://github.com/LIBERCOSOFT)
- LinkedIn: [Kolapo Akinrinlola](https://linkedin.com/in/kolapo-akinrinlola)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## 🔭 Future Features <a name="future-features"></a>

- [ ] **Refresh token implementation**

- [ ] **Multi-factor authentication**

- [ ] **Admin dashboard for user management**



<p align="right">(<a href="#readme-top">back to top</a>)</p>
