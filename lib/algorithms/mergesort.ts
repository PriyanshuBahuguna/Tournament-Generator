import type { Team } from "../types"

// Merge Sort implementation for team seeding
export function mergeSort(teams: Team[], rankingType: "higherBetter" | "lowerBetter"): Team[] {
  if (teams.length <= 1) return teams

  const mid = Math.floor(teams.length / 2)
  const left = mergeSort(teams.slice(0, mid), rankingType)
  const right = mergeSort(teams.slice(mid), rankingType)

  return merge(left, right, rankingType)
}

export function merge(left: Team[], right: Team[], rankingType: "higherBetter" | "lowerBetter"): Team[] {
  const result: Team[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (
      rankingType === "higherBetter"
        ? left[leftIndex].ranking > right[rightIndex].ranking
        : left[leftIndex].ranking < right[rightIndex].ranking
    ) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

