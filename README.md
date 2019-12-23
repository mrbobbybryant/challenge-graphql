# Challenge Graphql Project

[Docker](https://docs.docker.com/docker-for-mac/install/) - Installation for Docker

# Setup

_This project is setup to be a fully contained project. Meaning that other than Docker, Node, and NPM, you shouldn't need anything else installed to run this project locally._

- Open a tab in your comsole and run `docker-compose up`
- In another tab run `knex migrate:latest`
- Next run `npm install`
- Finally run `npm run dev`

# Notes & Tips

- This project usees an ORM called Knex to interface the the database: [Knex](https://knexjs.org/)
- This project uses JWT's and to complete one of the requirments of this project you will need to send a user token in the headers of your request.
- If you do not have a tool for exploring the Graphql api I suggest that you use [Graphql Playground](https://github.com/prisma-labs/graphql-playground)
- The `models` folder is where the you will find helper method using knex to query the database.
- The `resolvers` folder is where all of the Graphql and Queries should live.
- The `shared` folder primarily contains third party integrations.
- `resolvers/root-types.js` is where all queries and mutation need to be defined.
- `resolvers/index.js` is where you will inport your queries and mutations for a new resolver.

# Connecting to the Database.

- Personally I use Postico, but use whatever tool you want.
- **Username**: postgres
- **Password**: postgres
- **Database**: challenge_db
- **Port**: 5433

# The Challenge

You need to create a new set resolver called `projects`. Specifically you need to:

1. ### Create a mutation for creating a new project

- Only logged in users should be able to create a project.
- The name of the project should be "required" in the graphql schema.
- The current user should be set as the `user_id` or owner for that project.

2. ### Create a query to fetch all projects for a user

- Should only return that user's projects
- The `Project` type that you create should have a `user` field that allows you to fetch the `User` type.
