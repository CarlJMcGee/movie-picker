import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import {
  MovieSearch,
  FullMovieData,
  SchemaMovieData,
} from "../types/imbd-data";

export interface IMovieCardProps {
  movie: SchemaMovieData | undefined;
  col: string;
}

export default function MovieInfoCard({ movie, col }: IMovieCardProps) {
  const desc =
    "The FitnessGram Pacer test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter Pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal *boop*. A single lap should be completed each time you hear this sound *ding*. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.";

  const descShort = movie?.Plot.split(" ", 35).join(" ");

  return (
    <section className="">
      <Accordion.Item eventKey={movie?.imdbID || "0"}>
        <Accordion.Header>{movie?.Title}</Accordion.Header>
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
            </Card.Body>
          </Card>
        </Accordion.Body>
      </Accordion.Item>
    </section>
  );
}
