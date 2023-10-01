import * as React from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import type { MovieQuery } from "../types/imbd-data";
import { trpc } from "../utils/trpc";
import Badge from "react-bootstrap/Badge";
import { motion } from "framer-motion";
import type { Col } from "../types/movies";
import { useAtom } from "jotai";
import { sessionAtom } from "../utils/stateStore";

export interface IMovieCardProps {
  movie: MovieQuery | undefined;
  col: Col;
}

export default function MovieInfoCard({ movie, col }: IMovieCardProps) {
  // store
  const [session] = useAtom(sessionAtom);

  // queries
  const { data: userData } = trpc.useQuery(["user.me"]);
  const { data: movieRecommendations } = trpc.useQuery([
    "ai.get-movie-recommendations",
    { movie: movie?.Title ?? "" },
  ]);

  // mutations
  const makeAvailable = trpc.useMutation(["movie.makeAvailable"]);
  const { mutate: makeUnavailable } = trpc.useMutation([
    "movie.makeUnavailable",
  ]);
  const removeMovie = trpc.useMutation(["movie.remove"]);
  const addVote = trpc.useMutation(["movie.addVote"]);
  const removeVote = trpc.useMutation(["movie.removeVote"]);

  if (!movie) {
    return <h3>Movie Not Found</h3>;
  }

  const delayMap = new Map<Col, number>([
    ["wish-list", 0],
    ["available", 0.3],
    ["picked", 0.6],
    ["winner", 0],
  ]);

  return (
    <motion.section
      key={movie.id}
      initial={{
        opacity: 0,
        x: -100,
      }}
      animate={{
        opacity: 100,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 100,
      }}
      transition={{
        type: "tween",
        duration: 0.7,
        delay: delayMap.get(col),
      }}
    >
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
              {session && col === "wish-list" && userData?.role === "admin" && (
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
              {session && col === "available" && (
                <div className="flex flex-col">
                  <Button
                    variant="info"
                    size="sm"
                    className="bg-cyan-400 text-white w-50"
                    onClick={() =>
                      addVote.mutate({ imdbId: movie?.imdbID || "" })
                    }
                  >
                    Vote
                  </Button>
                  {userData?.role === "admin" && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="bg-red-600 w-50"
                      onClick={() => makeUnavailable({ imdbId: movie?.imdbID })}
                    >
                      Make Unavailable
                    </Button>
                  )}
                </div>
              )}
              {/* picked */}
              {session && col === "picked" && (
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
              {col === "available" && (
                <div>
                  <h3 className="text-center text-xl font-semibold underline">
                    If you hated{" "}
                    <span className="text-2xl font-bold">{movie?.Title}</span>,
                    then you&#39;ll hate these too:
                  </h3>
                  <ul>
                    {movieRecommendations
                      ? movieRecommendations?.recommendations.map((movie) => (
                          <li key={movie} className="text-lg text-center">
                            {movie}
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
    </motion.section>
  );
}
