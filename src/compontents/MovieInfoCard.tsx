import * as React from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {
  MovieSearch,
  FullMovieData,
  SchemaMovieData,
} from "../types/imbd-data";
import { Session } from "next-auth";
import { trpc } from "../utils/trpc";
import Badge from "react-bootstrap/Badge";

type Col = "wish-list" | "available" | "picked";

export interface IMovieCardProps {
  movie: SchemaMovieData | undefined;
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
  const userData = {
    role: "admin",
  };

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

  const desc =
    "The FitnessGram Pacer test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter Pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal *boop*. A single lap should be completed each time you hear this sound *ding*. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.";

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
              <Card.Text className="text-sm">{descShort}...</Card.Text>
              <Image
                thumbnail={false}
                src={movie?.Poster}
                className="w-50"
              ></Image>
              {/* unavailable */}
              {session?.user &&
                col === "wish-list" &&
                userData.role === "admin" && (
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
