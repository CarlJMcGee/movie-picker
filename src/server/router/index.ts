// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { ImdbRouter } from "./imdb";
import { MovieRouter } from "./Movies";
import { SeedRouter } from "./seeds";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("imdb.", ImdbRouter)
  .merge("movie.", MovieRouter)
  .merge("question.", protectedExampleRouter)
  .merge("seed.", SeedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
