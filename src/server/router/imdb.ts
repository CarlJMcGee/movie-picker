import { createRouter } from "./context";
import { z } from "zod";
import { MovieSearch, FullMovieData } from "../../types/imbd-data";

export const ImdbRouter = createRouter().query("info", {
  input: z.object({
    title: z.string().trim(),
  }),
  async resolve({ input }) {
    // check if title is an empty string
    if (input.title === "") {
      return;
    }

    // initial movie search
    const MovieIdSearch = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/k_41l41z8h/${input.title}`
    );
    const movieIdRes: MovieSearch = await MovieIdSearch.json();
    // I'm just going to assume the first result is correct
    const movieId = movieIdRes.results[0].id;

    // get plot description from wikipedia
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "bb333b027cmsh807e47c92995a02p1d3f88jsn33ac06947caf",
        "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      },
    };
    const descSearch = await fetch(
      `https://movie-database-alternative.p.rapidapi.com/?r=json&i=${movieId}`,
      options
    );
    const desc: FullMovieData = await descSearch.json();

    return desc;
  },
});
