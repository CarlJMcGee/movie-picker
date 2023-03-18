import * as React from "react";
import { useState, FormEvent, useEffect } from "react";
import { Session } from "next-auth";
import { trpc } from "../../utils/trpc";

// bootstrap
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

// mantine
import { Autocomplete, NativeSelect, SegmentedControl } from "@mantine/core";

// custom components
import MovieInfoCard from "../MovieInfoCard";
import { MovieQuery } from "../../types/imbd-data";
import { AnimatePresence, motion } from "framer-motion";

export interface IWishListProps {
  unavailable: MovieQuery[] | undefined;
  session: Session | null;
}

export default function WishList({ unavailable, session }: IWishListProps) {
  const utils = trpc.useContext();

  // state
  const [showAddModal, setAddModal] = useState(false);
  const [movies, setMovies] = useState(unavailable);
  const [movieTitle, setTitle] = useState("");
  const [sortCat, setSortCat] = useState<
    "Name" | "Score" | "Release Date" | "Length"
  >("Name");
  const [sortDir, setSortDir] = useState<"Ascending" | "Descending">(
    "Ascending"
  );

  // mutations
  const addMovie = trpc.useMutation(["movie.add"], {
    // onSuccess() {
    //   utils.invalidateQueries(["movie.getUnavailable"]);
    // },
  });
  const { mutateAsync: search, data: searchRes } = trpc.useMutation([
    "movie.autoComplete",
  ]);

  // handlers
  const addMovieHandler = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    addMovie.mutate({ title: movieTitle });
    setTitle("");
    setAddModal(false);
  };

  useEffect(() => {
    setMovies(unavailable);
  }, [unavailable]);

  useEffect(() => {
    if (movieTitle === "") {
      return;
    }

    let checkInput = setTimeout(() => {
      search({ search: movieTitle });
    }, 500);
    return () => {
      clearTimeout(checkInput);
    };
  }, [movieTitle]);

  useEffect(() => {
    console.log(movies?.map((movie) => Number.parseInt(movie.Year)));

    if (!Array.isArray(movies)) {
      return;
    }
    switch (sortCat) {
      case "Name":
        setMovies(
          [...movies].sort((movieA, movieB) => {
            if (sortDir === "Ascending") {
              return movieA.Title > movieB.Title ? 1 : -1;
            }

            return movieA.Title > movieB.Title ? -1 : 1;
          })
        );
        break;
      case "Score":
        setMovies(
          [...movies]?.sort((movieA, movieB) => {
            if (movieA.Metascore === "N/A") {
              return 1;
            }

            if (sortDir === "Ascending") {
              return movieA.Metascore < movieB.Metascore ? -1 : 1;
            }
            return movieA.Metascore > movieB.Metascore ? -1 : 1;
          })
        );
        break;
      case "Release Date":
        setMovies(
          [...movies].sort((movieA, movieB) => {
            const dateA = Number.parseInt(movieA.Year);
            const dateB = Number.parseInt(movieB.Year);

            if (sortDir === "Ascending") {
              return dateA < dateB ? -1 : 1;
            }
            return dateA > dateB ? -1 : 1;
          })
        );
        break;
      case "Length":
        setMovies(
          [...movies].sort((movieA, movieB) => {
            const lenA = Number.parseInt(movieA.Runtime.split(" ")[0]!);
            const lenB = Number.parseInt(movieB.Runtime.split(" ")[0]!);

            if (sortDir === "Ascending") {
              return lenA > lenB ? 1 : -1;
            }
            return lenA < lenB ? 1 : -1;
          })
        );
        break;
    }
  }, [sortCat, sortDir]);

  const searchTitles =
    movieTitle === ""
      ? []
      : searchRes?.d.flatMap((movie) => `${movie.l} | ${movie.y}`);

  return (
    <section className="w-11/12 h-4/5 m-3 p-0">
      <motion.h3
        className="text-4xl text-purple-1 m-1"
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
          delay: 0.4,
        }}
      >
        Wish List{" "}
        {session?.user && (
          <Button className="text-blue-2" onClick={() => setAddModal(true)}>
            {addMovie.isLoading ? <Spinner animation="border" /> : "➕"}
          </Button>
        )}{" "}
      </motion.h3>
      {session?.user && (
        <>
          <Modal show={showAddModal} onHide={() => setAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form id="add-movie-form" onSubmit={(e) => addMovieHandler(e)}>
                <Form.Group controlId="movie-title-input">
                  <Form.Label>Movie Title:</Form.Label>
                  <Autocomplete
                    data={searchTitles || [""]}
                    value={movieTitle}
                    placeholder="e.g. Fateful Findings"
                    onChange={(title) => setTitle(title)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setAddModal(false)}
                className="bg-blue-1 text-gray-500"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                form="add-movie-form"
                className="bg-blue-3 text-black"
              >
                {addMovie.isLoading ? (
                  <Spinner animation="border" />
                ) : (
                  "Add Movie"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      <div className="flex items-end">
        <NativeSelect
          label="Sort By"
          value={sortCat}
          data={["Name", "Score", "Release Date", "Length"]}
          size={"xs"}
          className="w-1/3 mb-2"
          onChange={(e) =>
            setSortCat(
              e.target.value as "Name" | "Score" | "Release Date" | "Length"
            )
          }
        />
        <SegmentedControl
          value={sortDir}
          data={["Ascending", "Descending"]}
          className="h-1/2 my-2 ml-2 bg-transparent"
          onChange={(value) => setSortDir(value as "Ascending" | "Descending")}
        />
      </div>
      <Accordion>
        <AnimatePresence>
          {Array.isArray(movies) &&
            movies.map((movie) => (
              <MovieInfoCard
                movie={movie}
                col="wish-list"
                session={session}
                key={movie.imdbID}
              />
            ))}
        </AnimatePresence>
      </Accordion>
    </section>
  );
}
