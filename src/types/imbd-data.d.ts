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
