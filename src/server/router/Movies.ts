import { createRouter } from "./context";
import { z } from "zod";
import type {
  AutocompleteRes,
  FullMovieData,
  MovieQuery,
  MovieSearch,
} from "../../types/imbd-data";
import { pushTrigger } from "../../utils/pusherStore";
import { Movie, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const MovieRouter = createRouter()
  .query("findOne", {
    input: z.object({
      title: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      try {
        const movie = await Movie.findFirst({
          where: {
            Title: input.title,
          },
          include: {
            addedBy: true,
          },
        });

        return movie;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const allMovies = await Movies.findMany({ include: { addedBy: true } });

        return allMovies;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .query("getUnavailable", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const unavalible = await Movies.findMany({
          where: { available: { equals: false } },
          orderBy: { Title: "asc" },
          include: {
            addedBy: true,
          },
        });

        return unavalible;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .query("getAvailable", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const available = await Movies.findMany({
          where: { available: { equals: true } },
          orderBy: { Title: "asc" },
          include: {
            addedBy: true,
          },
        });

        return available;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .query("getPicked", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const picked = await Movies.findMany({
          where: { votes: { gt: 0 } },
          orderBy: { votes: "desc" },
          include: {
            addedBy: true,
          },
        });

        return picked;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .query("getWinner", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const winner = await Movies.findFirst({
          where: { winner: { equals: true } },
          include: {
            addedBy: true,
          },
        });

        return winner;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .mutation("add", {
    input: z.object({
      title: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      const session = ctx.session;

      if (!session?.user) {
        return new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      try {
        const movieAltDb = "https://movie-database-alternative.p.rapidapi.com";
        const fetchOptions = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "bb333b027cmsh807e47c92995a02p1d3f88jsn33ac06947caf",
            "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
          },
        };

        // find imdb id string
        const query = encodeURIComponent(input.title.split(" | ")[0] ?? "");

        const ImdbIdSearch = await fetch(
          new URL(`/?s=${query}&r=json&page=1`, movieAltDb),
          fetchOptions
        );
        const imdbRes: MovieSearch = await ImdbIdSearch.json();
        const imdbId = imdbRes.Search[0].imdbID;

        // use imdb id to get the rest of the movie's info
        const InfoSearch = await fetch(
          `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${imdbId}`,
          fetchOptions
        );
        const movieInfo: FullMovieData = await InfoSearch.json();

        const {
          Writer,
          Actors,
          Country,
          Awards,
          Ratings,
          imdbRating,
          imdbVotes,
          Type,
          DVD,
          BoxOffice,
          Production,
          Website,
          Response,
          ...schemaReady
        } = movieInfo;

        console.log(schemaReady);
        // upsert new movie with movieInfo
        const newMovie: Movie & { addedBy: User } = await Movie.upsert({
          where: { imdbID: schemaReady.imdbID },
          create: {
            ...schemaReady,
            DBId: ctx.DB.id,
            userId: session?.user?.id || "Unknown",
          },
          update: {},
          include: {
            addedBy: true,
          },
        });

        await pushTrigger("main", "added_to_wishlist", {
          movie: newMovie,
        });
        return newMovie;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .mutation("remove", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      // get info for loggedin user
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session?.user?.id },
        });

        // check user's priviliges
        if (user?.role !== "admin") {
          return { msg: `Must be an Admin to perform task` };
        }

        // if admin, delete movie
        const deletedMovie = await ctx.prisma.movie.delete({
          where: { imdbID: input.imdbId },
        });

        await pushTrigger("main", "removed_from_wishlist", {
          msg: `Movie deleted from db`,
        });
        return { msg: `Movie deleted from db` };
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .mutation("makeAvailable", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session?.user?.id },
        });

        // check user's priviliges
        if (user?.role !== "admin") {
          return { msg: `Must be an Admin to perform task` };
        }

        const makeAvailable = await ctx.prisma.movie.update({
          where: { imdbID: input.imdbId },
          data: { available: true },
          include: {
            addedBy: true,
          },
        });
        await pushTrigger("main", "made_available", makeAvailable);
        return { msg: `${makeAvailable.Title} is now available for streaming` };
      } catch (err) {}
    },
  })
  .mutation("makeUnavailable", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session?.user?.id },
        });

        // check user's priviliges
        if (user?.role !== "admin") {
          return { msg: `Must be an Admin to perform task` };
        }

        const makeUnavailable = await ctx.prisma.movie.update({
          where: { imdbID: input.imdbId },
          data: { available: false },
          include: {
            addedBy: true,
          },
        });
        await pushTrigger("main", "made_unavailable", makeUnavailable);
        return {
          msg: `${makeUnavailable.Title} is no longer available for streaming`,
        };
      } catch (err) {}
    },
  })
  .mutation("addVote", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const session = ctx.session;
      const Movies = ctx.prisma.movie;

      if (!session?.user) {
        return { msg: `Not Logged In` };
      }
      try {
        const movie = await Movies.update({
          where: { imdbID: input.imdbId },
          data: {
            votes: { increment: 1 },
          },
        });

        await pushTrigger("main", "added_vote", movie);
        return { msg: `Vote counted!` };
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .mutation("removeVote", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const session = ctx.session;
      const Movies = ctx.prisma.movie;

      if (session?.user) {
        try {
          const movie = await Movies.update({
            where: { imdbID: input.imdbId },
            data: {
              votes: { decrement: 1 },
            },
          });

          // if votes go below 0, set votes to 0
          if (movie.votes < 0) {
            try {
              await Movies.update({
                where: { imdbID: input.imdbId },
                data: {
                  votes: { set: 0 },
                },
              });
            } catch (err) {
              if (err) console.error(err);
            }
          }

          await pushTrigger("main", "removed_vote", movie);
          return { msg: `Vote removed!` };
        } catch (err) {
          if (err) console.error(err);
        }
      }
    },
  })
  .mutation("setWinner", {
    input: z.object({
      id: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      if (ctx.session?.user) {
        try {
          const winner: MovieQuery = await Movie.update({
            where: { id: input.id },
            data: { winner: true },
            include: { addedBy: true },
          });

          await pushTrigger("main", "we_have_a_winner", winner);
          return { msg: `Winner set!` };
        } catch (err) {
          if (err) console.error(err);
        }
      }
    },
  })
  // sets winner and picked movies back to default false state
  .mutation("reset", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      try {
        const reset = await Movies.updateMany({
          where: { votes: { gt: 0 } },
          data: {
            winner: false,
            votes: { set: 0 },
          },
        });

        await pushTrigger("main", "reset", { msg: `complete` });
        return { msg: `complete` };
      } catch (err) {
        if (err) console.error(err);
      }
    },
  })
  .mutation("autoComplete", {
    input: z.object({
      search: z.string().trim(),
    }),
    async resolve({ input: { search } }) {
      try {
        const url = `https://online-movie-database.p.rapidapi.com/auto-complete?q=${search}`;

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "bb333b027cmsh807e47c92995a02p1d3f88jsn33ac06947caf",
            "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
          },
        };

        const req = await fetch(url, options);
        const res: AutocompleteRes = await req.json();

        if (!res) {
          const empty: AutocompleteRes = {} as AutocompleteRes;
        }
        return res;
      } catch (err) {
        if (err) console.error(err);
      }
    },
  });
