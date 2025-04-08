/**

 * @param {Array} teams - Array of team objects
 * @param {string} rankingType - 'higherBetter' or 'lowerBetter'
 * @returns {Array} - Sorted array of teams
 */
export function quickSort(teams, rankingType = "higherBetter") {
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  return quickSortRecursive(teamsCopy, 0, teamsCopy.length - 1, rankingType)
}


function quickSortRecursive(teams, low, high, rankingType) {
  if (low < high) {
    const pivotIndex = partition(teams, low, high, rankingType)

    quickSortRecursive(teams, low, pivotIndex - 1, rankingType)
    quickSortRecursive(teams, pivotIndex + 1, high, rankingType)
  }

  return teams
}


function partition(teams, low, high, rankingType) {
  const pivot = teams[high]
  let i = low - 1

  for (let j = low; j < high; j++) {
    if (compareRankings(teams[j], pivot, rankingType)) {
      i++

      const temp = teams[i]
      teams[i] = teams[j]
      teams[j] = temp
    }
  }

  const temp = teams[i + 1]
  teams[i + 1] = teams[high]
  teams[high] = temp

  return i + 1
}

function compareRankings(teamA, teamB, rankingType) {
  if (rankingType === "higherBetter") {
    return teamA.ranking > teamB.ranking
  } else {
    return teamA.ranking < teamB.ranking
  }
}

