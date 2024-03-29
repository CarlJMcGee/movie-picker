import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../utils/trpc";

// react bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";

import Header from "../compontents/Header";
import FinalsCol from "../compontents/FinalsCol";
import AvailableCol from "../compontents/AvailableCol";
import WishList from "../compontents/WishList";

import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { MovieQuery } from "../types/imbd-data";
import { useChannel } from "../utils/pusherStore";
import {
  availableAtom,
  pickedAtom,
  sessionAtom,
  unavailableAtom,
  winnerAtom,
} from "../utils/stateStore";
import { useAtom } from "jotai";
import CoolCatButton from "../compontents/CoolCatButton";

const Home: NextPage = () => {
  //state
  const [showWinner, setShowWinner] = useState(false);

  //store
  const [session, setSession] = useAtom(sessionAtom);
  const [_unavailable, setUnavailable] = useAtom(unavailableAtom);
  const [_available, setAvailable] = useAtom(availableAtom);
  const [picked, setPicked] = useAtom(pickedAtom);
  const [winner, setWinner] = useAtom(winnerAtom);

  const utils = trpc.useContext();

  // queries
  const { data: user } = trpc.useQuery(["user.me"]);
  let { isLoading: gettingUnavailable } = trpc.useQuery(
    ["movie.getUnavailable"],
    {
      onSuccess(data) {
        if (!data) {
          return;
        }
        setUnavailable(data);
      },
    }
  );
  let { isLoading: gettingAvailble } = trpc.useQuery(["movie.getAvailable"], {
    onSuccess(data) {
      if (!data) {
        return;
      }
      setAvailable(data);
    },
  });
  let { isLoading: gettingPicked } = trpc.useQuery(["movie.getPicked"], {
    onSuccess(data) {
      if (!data) {
        return;
      }
      setPicked(data);
    },
  });

  // pusher websocket
  const { BindEvent, BindEvents } = useChannel("main");

  BindEvents(["added_to_wishlist", "removed_from_wishlist"], () => {
    utils.invalidateQueries(["movie.getUnavailable"]);
  });

  BindEvents(["made_available", "made_unavailable"], () => {
    utils.invalidateQueries(["movie.getUnavailable"]);
    utils.invalidateQueries(["movie.getAvailable"]);
  });

  BindEvent<MovieQuery>("made_unavailable", (movie) => {
    utils.invalidateQueries(["movie.getUnavailable"]);
  });

  BindEvents(["added_vote", "removed_vote"], () => {
    utils.invalidateQueries(["movie.getPicked"]);
  });

  BindEvent<MovieQuery>("we_have_a_winner", (movie: MovieQuery) => {
    setWinner(movie);
    setShowWinner(true);
  });

  BindEvent("reset", () => {
    utils.invalidateQueries(["movie.getWinner"]);
    utils.invalidateQueries(["movie.getPicked"]);
    setWinner(null);
  });

  BindEvent("watched_changed", () => {
    utils.invalidateQueries(["movie.getAvailable"]);
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    setSession(user);
  }, [user]);

  return (
    <div className="bg-blue-1">
      <Head>
        <title>Shit Screen</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="container flex justify-between">
        <Header />
      </header>
      <CoolCatButton />
      {gettingAvailble || gettingUnavailable || gettingPicked ? (
        <h2 className="text-center text-4xl">
          Loading <Spinner animation="border" />{" "}
        </h2>
      ) : (
        <main className="container">
          {winner && (
            <Modal show={showWinner} onHide={() => setShowWinner(false)}>
              <Modal.Header closeButton>
                <Modal.Title>The Winner is... {winner.Title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Image src={winner.Poster} alt="winning movie's poster" />
                <p>Metascore: {winner.Metascore}</p>
                <p>Rated {winner.Rated}</p>
                <p>Directed by {winner.Director}</p>
                <p>{winner.Runtime}</p>
                <p>{winner.Plot}</p>
              </Modal.Body>
            </Modal>
          )}{" "}
          <Container className="bg-blue-1">
            {winner && (
              <Alert
                variant="success"
                style={{ cursor: "pointer" }}
                onClick={() => setShowWinner(true)}
              >
                The winner is... {winner.Title}
              </Alert>
            )}
            <Row>
              <Col className="" sm={true} lg={true}>
                {picked?.length > 0 ? (
                  <FinalsCol showWinner={setShowWinner} />
                ) : (
                  ""
                )}{" "}
              </Col>

              <Col className="" sm={true} lg={true}>
                <AvailableCol />
              </Col>

              <Col className="" sm={true} lg={true}>
                <WishList />
              </Col>
            </Row>
          </Container>
        </main>
      )}{" "}
    </div>
  );
};

export default Home;
