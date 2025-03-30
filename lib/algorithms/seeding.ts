import type { Team } from "../types"
import { mergeSort } from "./mergesort"
import { quickSort, shuffleArray } from "./quicksort"

export function seedTeams(
  teams: Team[],
  method: "random" | "mergeSort" | "quickSort",
  rankingType: "higherBetter" | "lowerBetter",
): Team[] {
  switch (method) {
    case "mergeSort":
      return mergeSort(teams, rankingType)
    case "quickSort":
      return quickSort(teams, rankingType)
    case "random":
    default:
      return shuffleArray(teams)
  }
}

