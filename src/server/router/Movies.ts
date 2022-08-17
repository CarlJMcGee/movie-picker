import { createRouter } from "./context";
import { z } from "zod";

export const MovieRouter = createRouter()
  .query("findOne", {
    input: z.object({
      title: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      const movie = await Movie.findFirst({
        where: {
          title: input.title,
        },
      });

      return movie;
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const allMovies = await Movies.findMany();

      return allMovies;
    },
  });
