import * as React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import { IMovie, MovieSearch } from "../types/imbd-data";

export interface IMovieCardProps {
  movie: IMovie | undefined;
}

export default function MovieInfoCard(props: IMovieCardProps) {
  const { movie } = props;

  const desc =
    "The FitnessGram Pacer test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter Pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal *boop*. A single lap should be completed each time you hear this sound *ding*. Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.";

  const descShort = movie?.description.split(" ", 35).join(" ");

  return (
    <section className="">
      <Card style={{ width: "25rem" }}>
        <Card.Body>
          <Card.Title>{movie?.title}</Card.Title>
          <Card.Text className="text-sm">{descShort}...</Card.Text>
          <Image thumbnail={false} src={movie?.image} className="w-50"></Image>
        </Card.Body>
      </Card>
    </section>
  );
}
