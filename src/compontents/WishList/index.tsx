import * as React from "react";
import { useState, FormEvent } from "react";
import { Session } from "next-auth";
import { Movie } from "@prisma/client";
import { trpc } from "../../utils/trpc";

// bootstrap
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

// custom components
import MovieInfoCard from "../MovieInfoCard";

export interface IWishListProps {
  unavailable: Movie[] | undefined;
  session: Session | null;
}

export default function WishList({ unavailable, session }: IWishListProps) {
  const utils = trpc.useContext();

  // state
  const [showAddModal, setAddModal] = useState(false);
  const [movieTitle, setTitle] = useState("");

  // mutations
  const addMovie = trpc.useMutation(["movie.add"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getUnavailable"]);
    },
  });

  // handlers
  const addMovieHandler = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    addMovie.mutate({ title: movieTitle });
    setTitle("");
    setAddModal(false);
  };

  return (
    <section className="w-11/12 h-4/5 m-3 p-0">
      <h3>Wish List</h3>
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
                  <Form.Control
                    type="text"
                    placeholder="e.g. Fateful Findings"
                    onChange={(e) => setTitle(e.target.value)}
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
          <Button
            className="bg-brown-1 text-blue-2"
            onClick={() => setAddModal(true)}
          >
            {addMovie.isLoading ? <Spinner animation="border" /> : "➕Movie"}
          </Button>
        </>
      )}
      <Accordion>
        {Array.isArray(unavailable) &&
          unavailable.map((movie) => (
            <MovieInfoCard
              movie={movie}
              col="wish-list"
              session={session}
              key={movie.imdbID}
            />
          ))}
      </Accordion>
    </section>
  );
}
