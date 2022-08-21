import * as React from "react";
import { Movie } from "@prisma/client";
import { Session } from "next-auth";

// bootstrap
import Accordion from "react-bootstrap/Accordion";

// custom components
import MovieInfoCard from "../MovieInfoCard";

export interface IFinalsColProps {
  picked: Movie[] | undefined;
  session: Session | null;
}

export default function FinalsCol({ picked, session }: IFinalsColProps) {
  return (
    <div className="w-11/12 h-4/5 m-3 p-0">
      <h3 className="text-4xl">Finals</h3>
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
