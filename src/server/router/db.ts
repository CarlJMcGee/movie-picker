import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import { Movie, User } from "@prisma/client";

export const DbRouter = createRouter()
  .mutation("export", {
    async resolve({ ctx }) {
      if (ctx.session?.user?.name !== "Kurojin Karu") {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to export the database",
        });
      }
      try {
        const users = await ctx.prisma.user.findMany();
        const movies = await ctx.prisma.movie.findMany();
        const account = await ctx.prisma.account.findMany();
        const sessions = await ctx.prisma.session.findMany();
        const verificationTokens =
          await ctx.prisma.verificationToken.findMany();

        const db = {
          users,
          movies,
          account,
          sessions,
          verificationTokens,
        };

        return db;
      } catch (e) {
        if (e) console.log(e);
      }
    },
  })
  .mutation("import", {
    input: z.object({
      users: z.custom<User>().array(),
      movies: z.custom<Movie>().array(),
      account: z.custom<User>().array(),
      sessions: z.custom<User>().array(),
      verificationTokens: z.custom<User>().array(),
    }),
    async resolve({ ctx, input }) {
      if (ctx.session?.user?.name !== "Kurojin Karu") {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to import the database",
        });
      }
      try {
        console.log(input.users[0]);
      } catch (err) {
        if (err) console.error(err);
      }
    },
  });
