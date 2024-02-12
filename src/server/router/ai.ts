import { OpenAI } from "openai";
import { createRouter } from "./context";
import { z } from "zod";
import { movieRecommendations } from "../../types/movies";
import { MovieQuery } from "../../types/imbd-data";

export const AiRouter = createRouter()
  .mutation("cool-cat-quote", {
    async resolve() {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      try {
        const res = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `You are Cool Cat from the direct to DVD movies Cool Cat Saves the Kids, Cool Cat Kids Superhero, and Cool Cat Fights Corona Virus. Here are a few quotes from Cool Cat:
       "He's about to graffiti our neighbor's wall, and it's not cool to... paint on someone's wall!"
       "You did so awesome on that Van Halen guitar! "
       "Wow!"
       "Dogs are my friends! Identify yourself!"
       "Why do you want to be a bully? Bullies never have any friends, and it's cool to have friends!"
       "Wow! The mailman must have left one of Daddy Derek's entertainment magazines!"
       "That's fabulous advice! It could help me to stop bullying!"
       "COOL!"
       "No, you've got it all wrong. That's not the truth. The truth is: There're a lot of people that love you and care for you. I know it because I love you. I'm Cool Cat and I love all kids."
       "But why does Momma Cat and Vivica go to the Beauty parlor? They are already so beautiful."
       "I'm cool cat and I'm going to save the kids!"
       
       Say something that Cool Cat might say. Start each response with "I'm Cool Cat".`,
          temperature: 0.4,
          max_tokens: 350,
        });

        if (!res.choices) {
          return undefined;
        }

        return res.choices;
      } catch (error) {
        if (error) {
          console.log(error);
          return undefined;
        }
      }
    },
  })
  .mutation("cool-cat-recommendation", {
    async resolve({ ctx }) {
      const Movie = ctx.prisma.movie;
      const moviesRaw = await Movie.findMany({
        where: {
          available: true,
        },
      });

      const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
      try {
        const res = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `You are Cool Cat from the direct to DVD movies Cool Cat Saves the Kids, Cool Cat Kids Superhero, and Cool Cat Fights Corona Virus. Here are a few quotes from Cool Cat:
       "He's about to graffiti our neighbor's wall, and it's not cool to... paint on someone's wall!"
       "You did so awesome on that Van Halen guitar! "
       "Wow!"
       "Dogs are my friends! Identify yourself!"
       "Why do you want to be a bully? Bullies never have any friends, and it's cool to have friends!"
       "Wow! The mailman must have left one of Daddy Derek's entertainment magazines!"
       "That's fabulous advice! It could help me to stop bullying!"
       "COOL!"
       "No, you've got it all wrong. That's not the truth. The truth is: There're a lot of people that love you and care for you. I know it because I love you. I'm Cool Cat and I love all kids."
       "But why does Momma Cat and Vivica go to the Beauty parlor? They are already so beautiful."
       "I'm cool cat and I'm going to save the kids!"
       
       Here are a list of movies available: 
       
       ${JSON.stringify(moviesRaw.map((movie) => movie.Title), null, 2)}
       
       Please respond as Cool Cat with a movie recommendation from the list provided.`,
          temperature: 0.4,
          max_tokens: 350,
        });

        if (!res.choices) {
          return undefined;
        }

        return res.choices;
      } catch (error) {
        if (error) {
          console.log(error);
          return undefined;
        }
      }
    },
  })
  .query("get-movie-recommendations", {
    input: z.object({
      movie: z.string(),
    }),
    async resolve({ input: { movie } }) {
      const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
      try {
        const res = await openai.completions.create({
          model: "gpt-3.5-turbo-instruct",
          prompt: `Based on the movie ${movie}, respond with 3 movie recommendations?
          Return movies data in the following string format:
          <original movie title>|<recommended movie title>,<recommended movie title>,<recommended movie title>`,
          temperature: 0.4,
          max_tokens: 350,
          n: 1,
        });

        if (!res.choices) {
          return undefined;
        }
        if (!res.choices[0]?.text) {
          return undefined;
        }

        const movieRaw = res.choices[0].text.split("|");
        const movieRecommendations: movieRecommendations = {
          movie: movieRaw[0]!.trim(),
          recommendations: movieRaw[1]!.split(","),
        };

        return movieRecommendations;
      } catch (error) {
        if (error) {
          console.log(error);
          return undefined;
        }
      }
    },
  });
