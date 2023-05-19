import { useState } from "react";
import Image from "next/image";
import coolcatjpg from "./assets/cool cat head.png";
import { trpc } from "../../utils/trpc";

export default function CoolCatButton() {
  const [quote, setQuote] = useState<string | undefined>(undefined);
  const { mutateAsync: askCoolCat, isLoading: coolCatThinking } =
    trpc.useMutation("ai.cool-cat-quote");

  const fetchQuote = async () => {
    const quotes = await askCoolCat();

    if (!quotes) {
      return;
    }

    setQuote(quotes[0]?.text);
  };

  return (
    <div className="flex justify-start mx-3 gap-4 items-start">
      <button
        onClick={() => fetchQuote()}
        className={`hover:scale-90 ${coolCatThinking ? "animate-pulse" : ""}`}
      >
        <Image src={coolcatjpg} alt="cool cat head" width={100} height={100} />
      </button>
      {quote ? (
        <p className="bg-white px-3 py-2 rounded-md rounded-bl-none">{quote}</p>
      ) : null}
    </div>
  );
}
