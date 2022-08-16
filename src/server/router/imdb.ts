import { createRouter } from "./context";
import { z } from "zod";
import { MovieSearch, WikipediaData } from "../../types/imbd-data";

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
    const MovieSearch = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/k_41l41z8h/${input.title}`
    );
    const movieSearchRes: MovieSearch = await MovieSearch.json();
    // I'm just going to assume the first result is correct
    const movie = movieSearchRes.results[0];

    console.log(movieSearchRes.results[0]);

    // get plot description from wikipedia
    const descSearch = await fetch(
      `https://imdb-api.com/en/API/Wikipedia/k_41l41z8h/${movieSearchRes.results[0].id}`
    );
    const desc: WikipediaData = await descSearch.json();

    // combine both results and return new object
    return {
      ...movie,
      description: desc.plotShort.plaintext || "No Description Available",
      year: desc.year,
    };
  },
});
