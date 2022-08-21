import * as React from "react";
import { Movie } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";
import { SetStateAction, Dispatch } from "react";

// bootstrap
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

// custom components
import MovieInfoCard from "../MovieInfoCard";
import random from "../../utils/random";
import { trpc } from "../../utils/trpc";

export interface IFinalsColProps {
  picked: Movie[];
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
  const utils = trpc.useContext();
  const NewWinner = trpc.useMutation("movie.setWinner", {
    onSuccess() {
      utils.invalidateQueries(["movie.getWinner"]);
    },
  });
  const reset = trpc.useMutation(["movie.reset"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getWinner"]);
      utils.invalidateQueries(["movie.getPicked"]);
    },
  });

  const decideMovie = async (picked: Movie[]) => {
    const finalCount: string[] = [];
    picked.map((movie) => {
      for (let i = 0; i <= movie.votes; i++) {
        finalCount.push(movie.Title);
      }
    });
    const drawing = finalCount[random(0, finalCount.length - 1)] || "";
    const winner = picked.find((movie) => movie.Title === drawing);

    NewWinner.mutate({ id: winner?.id || "" });
    showWinner(true);
  };

  return (
    <div className="w-11/12 h-4/5 m-3 p-0">
      <h3 className="text-4xl text-blue-4 m-1">
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
      </h3>
      <Accordion>
        {Array.isArray(picked) &&
          picked.map((movie) => (
            <MovieInfoCard
              movie={movie}
              col="picked"
              session={session}
              key={movie.imdbID}
            />
          ))}
      </Accordion>
    </div>
  );
}
