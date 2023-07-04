export type Col = "wish-list" | "available" | "picked" | "winner";

export type SortCategories = "Name" | "Score" | "Release Date" | "Length";
export type SortDirections = "Ascending" | "Descending";

export type movieRecommendations = {
  movie: string;
  recommendations: string[];
};
