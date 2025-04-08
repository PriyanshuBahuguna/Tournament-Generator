/**
 * Traditional QuickSort implementation for tournament seeding
 * Time Complexity: O(n²) worst case, O(n log n) average case
 * Space Complexity: O(log n)
 *
 * @param {Array} teams - Array of team objects
 * @param {string} rankingType - 'higherBetter' or 'lowerBetter'
 * @returns {Array} - Sorted array of teams
 */
export function quickSort(teams, rankingType = "higherBetter") {
  // Create a copy of the array to avoid modifying the original
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  // Call the recursive quickSort implementation
  return quickSortRecursive(teamsCopy, 0, teamsCopy.length - 1, rankingType)
}

/**
 * Recursive QuickSort implementation
 */
function quickSortRecursive(teams, low, high, rankingType) {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(teams, low, high, rankingType)

    // Recursively sort the sub-arrays
    quickSortRecursive(teams, low, pivotIndex - 1, rankingType)
    quickSortRecursive(teams, pivotIndex + 1, high, rankingType)
  }

  return teams
}

/**
 * Partition function for QuickSort
 */
function partition(teams, low, high, rankingType) {
  // Choose the rightmost element as pivot
  const pivot = teams[high]

  // Index of smaller element
  let i = low - 1

  for (let j = low; j < high; j++) {
    // If current element is greater (or smaller based on rankingType) than the pivot
    if (compareRankings(teams[j], pivot, rankingType)) {
      // Increment index of smaller element
      i++

      // Swap elements
      const temp = teams[i]
      teams[i] = teams[j]
      teams[j] = temp
    }
  }

  // Swap the pivot element with the element at (i + 1)
  const temp = teams[i + 1]
  teams[i + 1] = teams[high]
  teams[high] = temp

  // Return the position where partition is done
  return i + 1
}

/**
 * Compare team rankings based on rankingType
 */
function compareRankings(teamA, teamB, rankingType) {
  if (rankingType === "higherBetter") {
    return teamA.ranking > teamB.ranking
  } else {
    return teamA.ranking < teamB.ranking
  }
}

