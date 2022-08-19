// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { ImdbRouter } from "./imdb";
import { SeedRouter } from "./seeds";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("imdb.", ImdbRouter)
  .merge("question.", protectedExampleRouter)
  .merge("seed.", SeedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
