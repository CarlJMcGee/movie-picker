import * as React from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {
  MovieSearch,
  FullMovieData,
  SchemaMovieData,
  MovieQuery,
} from "../types/imbd-data";
import { Session } from "next-auth";
import { trpc } from "../utils/trpc";
import Badge from "react-bootstrap/Badge";
import { Movie, User } from "@prisma/client";

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
          {movie?.Title}
        </Accordion.Header>
        <Accordion.Body>
          <Card style={{}}>
            <Card.Body>
              <Card.Title>{movie?.Title}</Card.Title>
              <Card.Text className="text-sm">
                <ul>
                  <li>{movie?.Director}</li>
                  <li>{movie?.Rated}</li>
                  <li>{movie?.Runtime}</li>
                  <li>{movie?.Metascore}</li>
                  <li>{movie?.addedBy.name}</li>
                </ul>
              </Card.Text>
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
                    className="bg-cyan-400"
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
