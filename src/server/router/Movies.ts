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
  })
  .query("getUnavailable", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const unavalible = await Movies.findMany({
        where: { available: false },
      });

      return unavalible;
    },
  })
  .query("getAvailable", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const available = await Movies.findMany({
        where: { available: true },
      });

      return available;
    },
  })
  .query("getPicked", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const picked = await Movies.findMany({
        where: { picked: true },
      });

      return picked;
    },
  })
  .query("getWinner", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const winner = await Movies.findFirst({
        where: { winner: true },
      });

      return winner;
    },
  })
  .mutation("reset", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const reset = await Movies.updateMany({
        where: { picked: true },
        data: {
          winner: false,
          picked: false,
        },
      });

      return { msg: `complete` };
    },
  });
