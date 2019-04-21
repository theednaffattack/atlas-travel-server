import "reflect-metadata";
import { ApolloServer, ApolloError } from "apollo-server-express";
import * as Express from "express";
import { ArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import { GraphQLFormattedError, GraphQLError } from "graphql";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import morgan from "morgan";

import { stream } from "../src/config/winston";

import { redis } from "./redis";
import { redisSessionPrefix } from "./constants";
import { createSchema } from "./global-utils/graphql/createSchema";
// import queryComplexity, {
//   fieldConfigEstimator,
//   simpleEstimator
// } from "graphql-query-complexity";
// import { RegisterResolver } from "./modules/user/Register";
// import { LoginResolver } from "./modules/user/Login";
// import { MeResolver } from "./modules/user/Me";
// import { ConfirmUserResolver } from "./modules/user/ConfirmUser";

const RedisStore = connectRedis(session);

const main = async () => {
  await createConnection();

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
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
  app.use(cors(corsOptions));
  // app.use(
  //   cors({
  //     credentials: true,
  //     origin: "http://192.168.1.40:4000/"
  //   })
  // );

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

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log(
      "server started! GraphQL Playground available at:\nhttp://localhost:4000/graphql"
    );
  });
};

main();
