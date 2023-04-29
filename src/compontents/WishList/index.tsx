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
import { AnimatePresence, motion } from "framer-motion";

import type { MovieQuery } from "../../types/imbd-data";
import type { SortCategories, SortDirections } from "../../types/movies";
import Sorter from "../Sorter";

export interface IWishListProps {
  unavailable: MovieQuery[] | undefined;
  session: Session | null;
}

export default function WishList({ unavailable, session }: IWishListProps) {
  // state
  const [showAddModal, setAddModal] = useState(false);
  const [movies, setMovies] = useState(unavailable);
  const [movieTitle, setTitle] = useState("");
  const [sortCat, setSortCat] = useState<SortCategories>("Name");
  const [sortDir, setSortDir] = useState<SortDirections>("Ascending");

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
      <Sorter
        movies={movies}
        sortCat={sortCat}
        sortDir={sortDir}
        setMovies={setMovies}
        setSortCat={setSortCat}
        setSortDir={setSortDir}
      />
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
