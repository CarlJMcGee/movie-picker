import { createRouter } from "./context";
import { z } from "zod";
import { MovieSearch } from "../../types/imbd-data";

export const ImdbRouter = createRouter().query("info", {
  input: z.object({
    title: z.string().trim(),
  }),
  async resolve({ input }) {
    const MovieSearch = await fetch(
      `https://imdb-api.com/en/API/SearchMovie/k_41l41z8h/${input.title}`
    );

    const searchRes: MovieSearch = await MovieSearch.json();
    const movie = searchRes.results[0];

    const descSearch = await fetch();
  },
});
