import { Configuration, OpenAIApi } from "openai";
import { createRouter } from "./context";

export const AiRouter = createRouter().mutation("cool-cat-quote", {
  async resolve() {
    const aiConfig = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
    const openai = new OpenAIApi(aiConfig);
    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
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

      if (!res.data.choices) {
        return undefined;
      }

      return res.data.choices;
    } catch (error) {
      if (error) {
        console.log(error);
        return undefined;
      }
    }
  },
});
