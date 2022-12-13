import * as React from "react";
import { Session } from "next-auth";

// bootstrap
import Accordion from "react-bootstrap/Accordion";

// custom components
import MovieInfoCard from "../MovieInfoCard";
import { MovieQuery } from "../../types/imbd-data";

export interface IAvailableColProps {
  available: MovieQuery[] | undefined;
  session: Session | null;
}

export default function AvailableCol({
  available,
  session,
}: IAvailableColProps) {
  return (
    <section className="w-11/12 h-4/5 m-3 p-0">
      <h3 className="text-3xl text-blue-5 m-2">Choose Your Movie</h3>
      <Accordion>
        {Array.isArray(available) &&
          available.map((movie) => (
            <MovieInfoCard
              movie={movie}
              col="available"
              session={session}
              key={movie.imdbID}
            />
          ))}
      </Accordion>
    </section>
  );
}
