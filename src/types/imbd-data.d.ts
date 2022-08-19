export interface MovieSearch {
  searchType: string;
  expression: string;
  results: [
    {
      id: string;
      resultType: string;
      image: string;
      title: string;
      description: string;
    }
  ];
  errorMessage: string;
}

export interface FullMovieData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [{ Source: string; Value: string }];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface SchemaMovieData {
  id: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Plot: string;
  Language: string;
  Poster: string;
  Metascore: string;
  imdbID: string;
  available: boolean;
  votes: number;
  winner: boolean;
  dateAdded: Date;
  userId: string;
}
