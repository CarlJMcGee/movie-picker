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

export interface WikipediaData {
  imDbId: string;
  title: string;
  fullTitle: string;
  type: string;
  year: string;
  language: string;
  titleInLanguage: string;
  url: string;
  plotShort: {
    plaintext: string;
    html: string;
  };
  plotFull: {
    plaintext: string;
    html: string;
  };
  errorMessage: string;
}

export interface IMovie {
  id: string;
  resultType: string;
  image: string;
  title: string;
  description: string;
  year: string;
}
