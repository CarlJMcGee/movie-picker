import { NativeSelect, SegmentedControl } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { SortCategories, SortDirections } from "../../types/movies";
import { MovieQuery } from "../../types/imbd-data";
import { motion } from "framer-motion";
import { SetStateAction } from "jotai";

interface SorterProps {
  movies: MovieQuery[] | undefined;
  // @ts-expect-error
  setMovies: SetAtom<[SetStateAction<MovieQuery[]>], void>;
}

const Sorter = ({ movies, setMovies }: SorterProps) => {
  const [sortCat, setSortCat] = useState<SortCategories>("Name");
  const [sortDir, setSortDir] = useState<SortDirections>("Ascending");

  useEffect(() => {
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

  return (
    <motion.div
      className="flex items-end"
      initial={{
        opacity: 0,
        x: -100,
      }}
      animate={{
        opacity: 100,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 100,
      }}
      transition={{
        type: "tween",
        duration: 0.7,
        // delay: delayMap.get(col),
      }}
    >
      <NativeSelect
        value={sortCat}
        data={["Name", "Score", "Release Date", "Length"]}
        size={"xs"}
        className="w-1/3 mb-2"
        onChange={(e) => setSortCat(e.target.value as SortCategories)}
      />
      <SegmentedControl
        value={sortDir}
        data={["Ascending", "Descending"]}
        className="h-1/2 my-1 ml-2 bg-transparent"
        onChange={(value) => setSortDir(value as SortDirections)}
      />
    </motion.div>
  );
};

export default Sorter;
