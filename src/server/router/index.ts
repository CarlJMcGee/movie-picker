// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { MovieRouter } from "./Movies";
import { SeedRouter } from "./seeds";
import { UserRouter } from "./User";
import { DbRouter } from "./db";
import { AiRouter } from "./ai";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", UserRouter)
  .merge("movie.", MovieRouter)
  .merge("seed.", SeedRouter)
  .merge("db.", DbRouter)
  .merge("ai.", AiRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
