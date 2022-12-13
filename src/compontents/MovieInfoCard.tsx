import * as React from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import type { MovieQuery } from "../types/imbd-data";
import { Session } from "next-auth";
import { trpc } from "../utils/trpc";
import Badge from "react-bootstrap/Badge";

type Col = "wish-list" | "available" | "picked" | "winner";

export interface IMovieCardProps {
  movie: MovieQuery | undefined;
  col: Col;
  session: Session | null;
}

export default function MovieInfoCard({
  movie,
  col,
  session,
}: IMovieCardProps) {
  const utils = trpc.useContext();

  // queries
  const { data: userData } = trpc.useQuery(["user.me"]);

  // mutations
  const makeAvailable = trpc.useMutation(["movie.makeAvailable"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getUnavailable"]);
      utils.invalidateQueries(["movie.getAvailable"]);
    },
  });
  const removeMovie = trpc.useMutation(["movie.remove"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getUnavailable"]);
    },
  });
  const addVote = trpc.useMutation(["movie.addVote"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getPicked"]);
    },
  });
  const removeVote = trpc.useMutation(["movie.removeVote"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getPicked"]);
    },
  });

  const descShort = movie?.Plot.split(" ", 35).join(" ");

  return (
    <section className="">
      <Accordion.Item eventKey={movie?.imdbID || "0"}>
        <Accordion.Header>
          {col === "picked" && (
            <Badge bg="primary">Votes: {movie?.votes}</Badge>
          )}
          {movie?.Title} | {movie?.Rated} | {movie?.Runtime}
        </Accordion.Header>
        <Accordion.Body>
          <Card style={{}}>
            <Card.Body>
              <Card.Title>{movie?.Title}</Card.Title>
              {/* <Card.Text className="text-sm"> */}
              <ul className="text-sm">
                <li className="my-2">
                  <span className="font-semibold">Directed by</span>{" "}
                  {movie?.Director}
                </li>
                <li className="my-2">
                  <span className="font-bold">&quot;</span>
                  {movie?.Plot}
                  <span className="font-bold">&quot;</span>
                </li>
                <li className="my-2">
                  <span className="font-semibold">Rated:</span> {movie?.Rated}
                </li>
                <li>
                  <span className="font-semibold">Released in</span>{" "}
                  {movie?.Year}
                </li>
                <li className="my-2">
                  <span className="font-semibold">Length:</span>{" "}
                  {movie?.Runtime}
                </li>
                <li className="my-2">
                  <span className="font-semibold">Metascore:</span>{" "}
                  {movie?.Metascore === "N/A"
                    ? "N/A"
                    : movie?.Metascore + "/100"}
                </li>
                <li className="my-2">
                  <span className="font-semibold">Suggested by</span>{" "}
                  {movie?.addedBy.name}
                </li>
              </ul>
              {/* </Card.Text> */}
              <Image
                thumbnail={false}
                alt="movie poster"
                src={movie?.Poster}
                className="w-50"
              ></Image>
              {/* unavailable */}
              {session?.user &&
                col === "wish-list" &&
                userData?.role === "admin" && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="bg-green-600"
                      onClick={() =>
                        makeAvailable.mutate({ imdbId: movie?.imdbID || "" })
                      }
                    >
                      Add
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-red-600"
                      onClick={() =>
                        removeMovie.mutate({ imdbId: movie?.imdbID || "" })
                      }
                    >
                      {removeMovie.isLoading ? "Removing..." : "Delete"}
                    </Button>
                  </>
                )}
              {/* available */}
              {session?.user && col === "available" && (
                <>
                  <Button
                    variant="info"
                    size="sm"
                    className="bg-cyan-400 w-50"
                    onClick={() =>
                      addVote.mutate({ imdbId: movie?.imdbID || "" })
                    }
                  >
                    Vote
                  </Button>
                </>
              )}
              {/* picked */}
              {session?.user && col === "picked" && (
                <Button
                  variant="danger"
                  size="sm"
                  className="bg-red-600"
                  onClick={() =>
                    removeVote.mutate({ imdbId: movie?.imdbID || "" })
                  }
                >
                  Remove Vote
                </Button>
              )}
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
    </section>
  );
}
