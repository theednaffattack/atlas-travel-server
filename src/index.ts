import "reflect-metadata";
import { ApolloServer, ApolloError } from "apollo-server-express";
import * as Express from "express";
import { ArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import { GraphQLFormattedError, GraphQLError } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import cors from "cors";
import morgan from "morgan";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import { execute, subscribe } from "graphql";
import { createServer } from "http";

import { stream } from "../src/config/winston";

import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";
import { createSchema } from "./global-utils/graphql/createSchema";

// import serveStatic = require("serve-static");

const PORT = process.env.PORT || 7777;

const RedisStore = connectRedis(session);

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  // @ts-ignore
  const apolloServer = new ApolloServer({
    schema,

    tracing: true,
    // subscriptions: {
    //   path: "subscriptions"
    // },
    subscriptions: {
      // path: "subscriptions",
      // onConnect: (connectionParams, webSocket, context) => {
      //   // HERE WE WOULD TAKE THE AUTH TOKEN
      //   // AND VALIDATE BY LOOKING UP IN REDIS?
      //   // THEN LOOKUP THE USER IN THE DB? NOT SURE
      //   // if (connectionParams.authToken) {
      //   //   return validateToken(connectionParams.authToken)
      //   //     .then(findUser(connectionParams.authToken))
      //   //     .then(user => {
      //   //       return {
      //   //         currentUser: user
      //   //       };
      //   //     });
      //   // }

      //   // throw new Error("Missing auth token!");
      //   console.log("subscriptions connected!");
      //   console.log(Object.keys(connectionParams));
      //   console.log(Object.keys(webSocket));
      //   console.log(Object.keys(context));
      // },
      path: "/subscriptions",
      onConnect: context => {
        console.log("Connected to websocket");
        console.log(context);
      },

      onDisconnect: context => {
        // ...
        console.log("subscriptions closing (disconnect)");
        // console.log(webSocket);
        console.log(context);
      }
    },
    context: ({ req, res }: any) => ({ req, res }),
    // custom error handling from: https://github.com/19majkel94/type-graphql/issues/258
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error.originalError instanceof ApolloError) {
        return error;
      }

      const { extensions = {}, locations, message, path } = error;

      if (error.originalError instanceof ArgumentValidationError) {
        console.error(error);
        extensions.code = "GRAPHQL_VALIDATION_FAILED";

        return {
          extensions,
          locations,
          message,
          path
        };
      }

      //   error.message = "Internal Server Error";

      return {
        message: extensions.exception.stacktrace[0].replace("Error: ", ""),
        path,
        locations
        // extensions
      };
    },
    validationRules: [
      // queryComplexity({
      //   // queries above this threshold are rejected
      //   maximumComplexity: 8,
      //   variables: {},
      //   onComplete: (complexity: number) => {
      //     console.log("Query Complexity:", complexity);
      //   },
      //   estimators: [
      //     fieldConfigEstimator(),
      //     simpleEstimator({
      //       defaultComplexity: 1
      //     })
      //   ]
      // }) as any
    ]
  });

  const app = Express.default();
  // Wrap the Express server
  const wsServer = createServer(app);

  apolloServer.installSubscriptionHandlers(wsServer);
  // ws.listen(PORT, () => {
  //   console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  //   // Set up the WebSocket for handling GraphQL subscriptions
  //   new SubscriptionServer(
  //     {
  //       execute,
  //       subscribe,
  //       schema
  //     },
  //     {
  //       server: ws,
  //       path: "/subscriptions"
  //     }
  //   );
  // });

  // do some stuff with logging
  app.use(morgan("combined", { stream }));

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://192.168.1.40:3000",
    "http://192.168.1.40:4000"
  ];

  const corsOptions = {
    credentials: true,
    origin: function(origin: any, callback: any) {
      console.log("VIEW ORIGIN");
      console.log(origin);

      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        console.log("CORS IS GOOD");
        callback(null, true);
      } else {
        console.error("origin ", origin);
        console.error("Not allowd by CORS");
        callback(new Error("Not allowed by CORS"));
      }
    }
  };

  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: "http://192.168.1.40:4000/"
  //   })
  // );

  // app.use(cors(corsOptions));

  app.use(
    session({
      name: "qid",
      secret: process.env.SESSION_SECRET as string,
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  apolloServer.applyMiddleware({
    cors: corsOptions,
    app
  });

  wsServer.listen(4000, () => {
    console.log("\n\n");
    console.log(
      `🚀  Server started! GraphQL Playground ready at:\nhttp://localhost:${PORT}${
        apolloServer.graphqlPath
      }`
    );
    console.log("\n\n");
    console.log(
      `🚀 Subscriptions ready at:\nws://localhost:${PORT}${
        apolloServer.subscriptionsPath
      }`
    );
  });
};

main();
