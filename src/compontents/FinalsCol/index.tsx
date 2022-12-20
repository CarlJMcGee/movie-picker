import * as React from "react";
import { Movie } from "@prisma/client";
import { Session } from "next-auth";
import { SetStateAction, Dispatch } from "react";

// bootstrap
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

// custom components
import MovieInfoCard from "../MovieInfoCard";

// utils
import { numBetween } from "@carljmcgee/lol-random";
import { trpc } from "../../utils/trpc";
import { MovieQuery } from "../../types/imbd-data";

// framer motion
import { motion, AnimatePresence } from "framer-motion";

export interface IFinalsColProps {
  picked: MovieQuery[];
  session: Session | null;
  winner: Movie | null | undefined;
  showWinner: Dispatch<SetStateAction<boolean>>;
}

export default function FinalsCol({
  picked,
  session,
  winner,
  showWinner,
}: IFinalsColProps) {
  const NewWinner = trpc.useMutation("movie.setWinner");
  const reset = trpc.useMutation(["movie.reset"]);

  const decideMovie = async (picked: Movie[]) => {
    const finalCount: string[] = [];
    picked.map((movie) => {
      for (let i = 0; i <= movie.votes; i++) {
        finalCount.push(movie.Title);
      }
    });
    const drawing = finalCount[numBetween(0, finalCount.length - 1)] || "";
    const winner = picked.find((movie) => movie.Title === drawing);

    NewWinner.mutate({ id: winner?.id || "" });
    showWinner(true);
  };

  return (
    <motion.div className="w-11/12 h-4/5 m-3 p-0">
      <motion.h3
        className="text-4xl text-blue-4 m-1"
        initial={{
          scale: "60%",
          opacity: 0,
        }}
        animate={{
          scale: "100%",
          opacity: 100,
        }}
        transition={{
          type: "spring",
          bounce: 0.65,
          delay: 1,
        }}
      >
        Finals{" "}
        {!winner ? (
          <Button
            className="bg-brown-2 text-white"
            variant="warning"
            onClick={() => decideMovie(picked)}
          >
            Flush
          </Button>
        ) : (
          <Button
            className="bg-brown-2 text-white"
            variant="warning"
            onClick={() => reset.mutate()}
          >
            Reset
          </Button>
        )}
      </motion.h3>
      <Accordion>
        <AnimatePresence>
          {Array.isArray(picked) &&
            picked.map((movie) => (
              <MovieInfoCard
                movie={movie}
                col="picked"
                session={session}
                key={movie.imdbID}
              />
            ))}
        </AnimatePresence>
      </Accordion>
    </motion.div>
  );
}
