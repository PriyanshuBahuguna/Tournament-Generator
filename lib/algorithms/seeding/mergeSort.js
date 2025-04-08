/**
 * Traditional MergeSort implementation for tournament seeding
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 *
 * @param {Array} teams - Array of team objects
 * @param {string} rankingType - 'higherBetter' or 'lowerBetter'
 * @returns {Array} - Sorted array of teams
 */
export function mergeSort(teams, rankingType = "higherBetter") {
  // Create a copy of the array to avoid modifying the original
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  // Base case: if the array has 1 or 0 elements, it's already sorted
  if (teamsCopy.length <= 1) {
    return teamsCopy
  }

  // Split the array into two halves
  const middle = Math.floor(teamsCopy.length / 2)
  const leftHalf = []
  const rightHalf = []

  // Populate the left half
  for (let i = 0; i < middle; i++) {
    leftHalf[i] = teamsCopy[i]
  }

  // Populate the right half
  for (let i = middle; i < teamsCopy.length; i++) {
    rightHalf[i - middle] = teamsCopy[i]
  }

  // Recursively sort both halves
  const sortedLeft = mergeSort(leftHalf, rankingType)
  const sortedRight = mergeSort(rightHalf, rankingType)

  // Merge the sorted halves
  return merge(sortedLeft, sortedRight, rankingType)
}

/**
 * Merge two sorted arrays
 */
function merge(left, right, rankingType) {
  const result = []
  let leftIndex = 0
  let rightIndex = 0

  // Compare elements from both arrays and add the larger/smaller one to the result
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareRankings(left[leftIndex], right[rightIndex], rankingType)) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  // Add remaining elements from the left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex])
    leftIndex++
  }

  // Add remaining elements from the right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex])
    rightIndex++
  }

  return result
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

