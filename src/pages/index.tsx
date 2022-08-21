import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { FormEvent, useState } from "react";

import MovieInfoCard from "../compontents/MovieInfoCard";

// react bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Header from "../compontents/Header";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const Home: NextPage = () => {
  //state
  const [movieTitle, setTitle] = useState("");
  const [showAddModal, setAddModal] = useState(false);

  // queries
  const utils = trpc.useContext();
  const { data: session } = useSession();
  // const {data: userData} = trpc.useQuery([""])
  const { data: unavailable } = trpc.useQuery(["movie.getUnavailable"]);
  const { data: available } = trpc.useQuery(["movie.getAvailable"]);
  const { data: picked } = trpc.useQuery(["movie.getPicked"]);

  // mutations
  const addMovie = trpc.useMutation(["movie.add"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getUnavailable"]);
    },
  });

  const addMovieHandler = (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    addMovie.mutate({ title: movieTitle });
    setTitle("");
    setAddModal(false);
    console.log(`Added Movie`);
  };

  return (
    <div className="bg-blue-1">
      <Head>
        <title>Shit Screen</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="container flex justify-between">
        <Header session={session} />
      </header>

      <main className="container m-0">
        <Container className="bg-blue-1">
          <Row>
            <Col className="w-4/12">
              <div className="w-11/12 h-4/5 m-3 p-0">
                <h3>Finals</h3>
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
            </Col>

            <Col className="w-4/12">
              <section className="w-11/12 h-4/5 m-3 p-0">
                <h3>Choose Your Movie</h3>
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
            </Col>

            <Col className="w-4/12">
              <section className="w-11/12 h-4/5 m-3 p-0">
                <h3>Wish List</h3>
                {session?.user && (
                  <>
                    <Modal
                      show={showAddModal}
                      onHide={() => setAddModal(false)}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form
                          id="add-movie-form"
                          onSubmit={(e) => addMovieHandler(e)}
                        >
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
                      {addMovie.isLoading ? (
                        <Spinner animation="border" />
                      ) : (
                        "➕Movie"
                      )}
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
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default Home;
