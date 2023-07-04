import { useEffect, useState } from "react";
import Image from "next/image";
import coolcatjpg from "./assets/cool cat head.png";
import { trpc } from "../../utils/trpc";

export default function CoolCatButton() {
  const [quote, setQuote] = useState<string | undefined>(
    "Hey kids, I'm Cool Cat! Click on me to get a movie recommendation!"
  );
  const { mutateAsync: askCoolCat, isLoading: coolCatThinking } =
    trpc.useMutation("ai.cool-cat-quote");
  const {
    mutateAsync: coolCatRecommendation,
    isLoading: coolCatRecommendationThinking,
  } = trpc.useMutation(["ai.cool-cat-recommendation"]);

  const fetchQuote = async () => {
    const quotes = await askCoolCat();

    if (!quotes) {
      return;
    }

    setQuote(quotes[0]?.text);
  };

  const fetchRecommendation = async () => {
    const recommendation = await coolCatRecommendation();

    if (!recommendation) {
      return;
    }

    setQuote(recommendation[0]?.text);
  };

  useEffect(() => {
    setTimeout(() => {
      setQuote(undefined);
    }, 180 * 1000);
  }, [quote]);

  return (
    <div className="flex justify-start mx-3 gap-4 items-start">
      <button
        onClick={() => fetchRecommendation()}
        className={`${
          coolCatRecommendationThinking ? "animate-pulse" : "hover:scale-90"
        }`}
      >
        <Image src={coolcatjpg} alt="cool cat head" width={100} height={100} />
      </button>
      {/* {quote ? ( */}
      <p
        className={`bg-white px-3 py-2 rounded-md rounded-bl-none w-52 md:w-fit md:max-w-sm ${
          quote ? "opacity-100" : "opacity-0"
        }`}
      >
        {quote}
      </p>
      {/* ) : null} */}
    </div>
  );
}
