import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "app_user",
    password: "JVkPNUjNPnCpKHTHA4ybmrYM",
    database: "atlas_travel-TESTING",
    dropSchema: drop,
    synchronize: true,
    entities: [__dirname + "/../entity/*.*"]
  });
};
