import { TRPCError } from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import {
  Account,
  Movie,
  Session,
  User,
  VerificationToken,
} from "@prisma/client";

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
      account: z.custom<Account>().array(),
      sessions: z.custom<Session>().array(),
      verificationTokens: z.custom<VerificationToken>().array(),
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

        Object.entries(input).forEach(async ([key, value]) => {
          switch (key) {
            case "users":
              await addUsers(value as User[]);
              break;
            case "movies":
              await addMovies(value as Movie[]);
              break;
            case "account":
              await addAccount(value as Account[]);
              break;
            case "sessions":
              await addSessions(value as Session[]);
              break;
            case "verificationTokens":
              await addVerificationTokens(value as VerificationToken[]);
              break;
          }

          async function addUsers(users: User[]) {
            users.forEach(async (user) => {
              await ctx.prisma.user.upsert({
                where: {
                  id: user.id,
                },
                create: user,
                update: {},
              });
            });
          }

          async function addMovies(movies: Movie[]) {
            movies.forEach(async (movie) => {
              await ctx.prisma.movie.upsert({
                where: {
                  id: movie.id,
                },
                create: movie,
                update: {},
              });
            });
          }

          async function addAccount(account: Account[]) {
            account.forEach(async (acc) => {
              await ctx.prisma.account.upsert({
                where: {
                  id: acc.id,
                },
                create: acc,
                update: {},
              });
            });
          }

          async function addSessions(sessions: Session[]) {
            sessions.forEach(async (session) => {
              await ctx.prisma.session.upsert({
                where: {
                  id: session.id,
                },
                create: session,
                update: {},
              });
            });
          }

          async function addVerificationTokens(
            verificationTokens: VerificationToken[]
          ) {
            verificationTokens.forEach(async (token) => {
              await ctx.prisma.verificationToken.upsert({
                where: {
                  token: token.token,
                },
                create: token,
                update: {},
              });
            });
          }
        });

        return { status: "success", code: 200 };
      } catch (err) {
        if (err) {
          return new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `${err}`,
          });
        }
      }
    },
  });
