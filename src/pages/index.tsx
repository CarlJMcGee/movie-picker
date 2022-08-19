import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { useState } from "react";

import MovieInfoCard from "../compontents/MovieInfoCard";

// react bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Header from "../compontents/Header";
import Spinner from "react-bootstrap/Spinner";

const Home: NextPage = () => {
  //state
  const [movieTitle, setTitle] = useState("");

  // queries
  const utils = trpc.useContext();
  const { data: session } = useSession();
  // const {data: userData} = trpc.useQuery([""])
  const { data: unavailable } = trpc.useQuery(["movie.getUnavailable"]);
  const { data: available } = trpc.useQuery(["movie.getAvailable"]);

  // mutations
  const addMovie = trpc.useMutation(["movie.add"], {
    onSuccess() {
      utils.invalidateQueries(["movie.getAll"]);
    },
  });

  const addMovieHandler = () => {
    addMovie.mutate({ title: movieTitle });
    setTitle("");
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

      <main className="container">
        <Container className="bg-blue-1">
          <Row>
            <Col>
              <div className="container">
                <h3>Finals</h3>
                <Accordion></Accordion>
              </div>
            </Col>

            <Col>
              <section className="w-11/12 h-4/5 m-5 p-5">
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

            <Col>
              <section className="w-11/12 h-4/5 m-5 p-5">
                <h3>Wish List</h3>
                <input
                  type={"text"}
                  value={movieTitle}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  className="bg-brown-1 text-blue-2"
                  onClick={() => addMovieHandler()}
                >
                  {addMovie.isLoading ? (
                    <Spinner animation="border" />
                  ) : (
                    "+ Movie"
                  )}
                </Button>
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
