import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { trpc } from "../utils/trpc";

// react bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../compontents/Header";
import FinalsCol from "../compontents/FinalsCol";
import AvailableCol from "../compontents/AvailableCol";
import WishList from "../compontents/WishList";
import Spinner from "react-bootstrap/Spinner";

const Home: NextPage = () => {
  //state

  // queries
  const { data: session } = useSession();
  // const {data: userData} = trpc.useQuery([""])
  let { data: unavailable, isLoading: gettingUnavailable } = trpc.useQuery([
    "movie.getUnavailable",
  ]);
  let { data: available, isLoading: gettingAvailble } = trpc.useQuery([
    "movie.getAvailable",
  ]);
  let { data: picked, isLoading: gettingPicked } = trpc.useQuery([
    "movie.getPicked",
  ]);

  unavailable = available || [];
  available = available || [];
  picked = picked || [];

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
      {gettingAvailble || gettingUnavailable || gettingPicked ? (
        <h2 className="text-center text-4xl">
          Loading <Spinner animation="border" />{" "}
        </h2>
      ) : (
        <main className="container">
          <Container className="bg-blue-1">
            <Row>
              <Col className="" sm={true} lg={true}>
                {picked?.length > 0 ? (
                  <FinalsCol picked={picked} session={session} />
                ) : (
                  ""
                )}{" "}
              </Col>

              <Col className="" sm={true} lg={true}>
                <AvailableCol available={available} session={session} />
              </Col>

              <Col className="" sm={true} lg={true}>
                <WishList unavailable={unavailable} session={session} />
              </Col>
            </Row>
          </Container>
        </main>
      )}{" "}
    </div>
  );
};

export default Home;
