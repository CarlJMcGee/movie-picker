import { NativeSelect, SegmentedControl } from "@mantine/core";
import React, { useEffect } from "react";
import { SortCategories, SortDirections } from "../../types/movies";
import { Movie } from "@prisma/client";
import { MovieQuery } from "../../types/imbd-data";

interface SorterProps {
  movies: MovieQuery[] | undefined;
  setMovies: React.Dispatch<React.SetStateAction<MovieQuery[] | undefined>>;
  sortCat: SortCategories;
  sortDir: SortDirections;
  setSortCat: React.Dispatch<React.SetStateAction<SortCategories>>;
  setSortDir: React.Dispatch<React.SetStateAction<SortDirections>>;
}

const Sorter = ({
  sortCat,
  sortDir,
  setSortCat,
  setSortDir,
  movies,
  setMovies,
}: SorterProps) => {
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
    <div className="flex items-end">
      <NativeSelect
        label="Sort By"
        value={sortCat}
        data={["Name", "Score", "Release Date", "Length"]}
        size={"xs"}
        className="w-1/3 mb-2"
        onChange={(e) => setSortCat(e.target.value as SortCategories)}
      />
      <SegmentedControl
        value={sortDir}
        data={["Ascending", "Descending"]}
        className="h-1/2 my-2 ml-2 bg-transparent"
        onChange={(value) => setSortDir(value as SortDirections)}
      />
    </div>
  );
};

export default Sorter;
