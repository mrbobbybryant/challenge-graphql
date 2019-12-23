import cors from 'cors';
import express from 'express';
import jwt from 'express-jwt';
import redis from 'redis';
import bluebird from 'bluebird';
import redisStore from 'connect-redis';
import schema from './resolvers';
import { ApolloServer } from 'apollo-server-express';
import { Model } from 'objection';
import session from 'express-session';
import client from './models/knex';
// import { elasticInit } from './shared/elasticsearch';
import queue from './queue';
import loaders from './loaders';

export default () => {
  const redisClient = redis.createClient(process.env.REDIS_URL);
  bluebird.promisifyAll(redis);

  Model.knex(client);
  const store = redisStore(session);

  queue();
  // elasticInit();

  const app = express();

  app.use(cors());

  app.use(
    jwt({
      secret: process.env.JWT_SECRET,
      credentialsRequired: false,
      userProperty: 'user',
    }),
  );

  app.use(
    session({
      secret: process.env.JWT_SECRET,
      store: new store({
        url: process.env.REDIS_URL,
        client: redisClient,
        ttl: 260,
      }),
      resave: false,
      saveUninitialized: false,
    }),
  );

  const { PORT = 8083 } = process.env;

  const server = new ApolloServer({
    schema,
    tracing: process.env.ENABLE_TRACING ? true : false,
    cacheControl: process.env.ENABLE_CACHING ? true : false,
    formatError: e => {
      if (process.env.LOG_GQL_ERRORS) console.error(e);
      try {
        if (process.env.SENTRY_TOKEN) {
          Raven.captureException(err);
        }

        return JSON.parse(e.message.replace('Error: ', ''));
      } catch (newError) {
        return e;
      }
    },
    context: async ({ req, res }) => {
      const token = req.headers.authorization || '';

      const user = req.user
        ? await client('users')
            .where('id', req.user.userId)
            .first()
        : null;
      return { ...req, token, res, user, redis: redisClient, loaders };
    },
    introspection: true,
    cors: true,
    engine: {
      // The Graph Manager API key
      apiKey: process.env.ENGINE_API_KEY,
      // A tag for this specific environment (e.g. `development` or `production`).
      // For more information on schema tags/variants, see
      // https://www.apollographql.com/docs/platform/schema-registry/#associating-metrics-with-a-variant
      schemaTag: process.env.SCHEMA_TAG,
    },
  });
  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    ),
  );
};
