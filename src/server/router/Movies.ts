import { createRouter } from "./context";
import { z } from "zod";
import { MovieData, MovieSearch } from "../../types/imbd-data";
import { equal } from "assert";

export const MovieRouter = createRouter()
  .query("findOne", {
    input: z.object({
      title: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      const movie = await Movie.findFirst({
        where: {
          Title: input.title,
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
        where: { available: { equals: false } },
      });

      return unavalible;
    },
  })
  .query("getAvailable", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const available = await Movies.findMany({
        where: { available: { equals: true } },
      });

      return available;
    },
  })
  .query("getPicked", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const picked = await Movies.findMany({
        where: { votes: { gt: 0 } },
      });

      return picked;
    },
  })
  .query("getWinner", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const winner = await Movies.findFirst({
        where: { winner: { equals: true } },
      });

      return winner;
    },
  })
  .mutation("add", {
    input: z.object({
      title: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      const Movie = ctx.prisma.movie;
      const session = ctx.session;

      if (session?.user) {
        try {
          // find imdb id string
          const ImdbIdSearch = await fetch(
            `https://imdb-api.com/en/API/SearchMovie/k_41l41z8h/${input.title}`
          );
          const imdbRes: MovieSearch = await ImdbIdSearch.json();
          const imdbId = imdbRes.results[0].id;

          // use imdb id to get the rest of the movie's info
          const options = {
            method: "GET",
            headers: {
              "X-RapidAPI-Key":
                "bb333b027cmsh807e47c92995a02p1d3f88jsn33ac06947caf",
              "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
            },
          };
          const InfoSearch = await fetch(
            `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${imdbId}`,
            options
          );
          const movieInfo: MovieData = await InfoSearch.json();
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

          // upsert new movie with movieInfo
          const newMovie = await Movie.upsert({
            where: { imdbID: schemaReady.imdbID },
            create: {
              ...schemaReady,
              userId: session?.user?.id || "Unknown",
            },
            update: {},
            select: {
              Title: true,
              imdbID: true,
              addedBy: true,
            },
          });
          return newMovie;
        } catch (err) {
          if (err) console.error(err);
        }
      }
    },
  })
  .mutation("remove", {
    input: z.object({
      imdbId: z.string().trim(),
    }),
    async resolve({ input, ctx }) {
      // get info for loggedin user
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

      return { msg: `Movie deleted fro db` };
    },
  })
  // sets winner and picked movies back to defaul false state
  .mutation("reset", {
    async resolve({ ctx }) {
      const Movies = ctx.prisma.movie;
      const reset = await Movies.updateMany({
        where: { votes: { gt: 0 } },
        data: {
          winner: false,
          votes: 0,
        },
      });

      return { msg: `complete` };
    },
  });