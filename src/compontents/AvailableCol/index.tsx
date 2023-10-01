// bootstrap
import Accordion from "react-bootstrap/Accordion";

// custom components
import MovieInfoCard from "../MovieInfoCard";
import { AnimatePresence, motion } from "framer-motion";
import Sorter from "../Sorter";
import { availableAtom } from "../../utils/stateStore";
import { useAtom } from "jotai";

export interface IAvailableColProps {}

export default function AvailableCol() {
  const [movies] = useAtom(availableAtom);

  return (
    <section className="w-11/12 h-4/5 m-3 p-0">
      <motion.h3
        className="text-3xl text-blue-5 m-2"
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
          delay: 0.7,
        }}
      >
        Choose Your Movie
      </motion.h3>
      <Sorter col="available" />
      <Accordion>
        <AnimatePresence>
          {Array.isArray(movies) &&
            movies.map((movie) => (
              <MovieInfoCard movie={movie} col="available" key={movie.imdbID} />
            ))}
        </AnimatePresence>
      </Accordion>
    </section>
  );
}
