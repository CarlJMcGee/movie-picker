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
import { raise } from "../../utils";

export const DbRouter = createRouter()
  .mutation("export", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session?.user?.id,
        },
      });

      if (user?.role !== "admin") {
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
      users: z.custom<User>().array().optional(),
      movies: z.custom<Movie>().array().optional(),
      account: z.custom<Account>().array().optional(),
      sessions: z.custom<Session>().array().optional(),
      verificationTokens: z.custom<VerificationToken>().array().optional(),
    }),
    async resolve({ ctx: { DB, session, prisma }, input }) {
      const user = await DB.users.findUnique({
        where: {
          id: session?.user?.id,
        },
      });

      if (user?.role !== "admin") {
        return new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to import the database",
        });
      }
      try {
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
              await prisma.user.upsert({
                where: {
                  email: user.email ?? "",
                },
                create: user,
                update: {
                  id: user.id,
                },
              });
            });
          }

          async function addMovies(movies: Movie[]) {
            const user =
              (await DB.users.findFirst({
                where: {
                  email: "ltmcgeemaniii@gmail.com",
                },
              })) ?? raise("Failed to find user");

            movies.forEach(async (movie) => {
              await DB.movies.upsert({
                where: {
                  id: movie.id,
                },
                create: { ...movie, DBId: DB.id },
                update: { DBId: DB.id },
              });
            });
          }

          async function addAccount(account: Account[]) {
            account.forEach(async (acc) => {
              await prisma.account.upsert({
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
              await prisma.session.upsert({
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
              await prisma.verificationToken.upsert({
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
