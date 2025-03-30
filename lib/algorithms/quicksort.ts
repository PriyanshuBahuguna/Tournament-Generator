import type { Team } from "../types"

// Quick Sort implementation for team seeding
export function quickSort(teams: Team[], rankingType: "higherBetter" | "lowerBetter"): Team[] {
  if (teams.length <= 1) return teams

  const pivot = teams[0]
  const left: Team[] = []
  const right: Team[] = []

  for (let i = 1; i < teams.length; i++) {
    if (rankingType === "higherBetter" ? teams[i].ranking > pivot.ranking : teams[i].ranking < pivot.ranking) {
      left.push(teams[i])
    } else {
      right.push(teams[i])
    }
  }

  return [...quickSort(left, rankingType), pivot, ...quickSort(right, rankingType)]
}

// Fisher-Yates shuffle for random seeding
export function shuffleArray(array: Team[]): Team[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Rearrange teams to avoid top teams meeting early
export function avoidTopTeamClashes(teams: Team[]): Team[] {
  // This is a simplified implementation
  // In a real tournament, this would be more complex
  const result = [...teams]

  // Put the top seed at the beginning and the second seed at the end
  if (result.length >= 4) {
    const secondBest = result[1]
    result.splice(1, 1)
    result.push(secondBest)
  }

  return result
}

