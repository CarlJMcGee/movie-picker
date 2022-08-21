// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { ImdbRouter } from "./imdb";
import { MovieRouter } from "./Movies";
import { SeedRouter } from "./seeds";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("imdb.", ImdbRouter)
  .merge("movie.", MovieRouter)
  .merge("seed.", SeedRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
