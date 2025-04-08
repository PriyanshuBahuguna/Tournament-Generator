/**

 * @param {Array} teams - Array of team objects
 * @param {string} rankingType - 'higherBetter' or 'lowerBetter'
 * @returns {Array} - Sorted array of teams
 */
export function mergeSort(teams, rankingType = "higherBetter") {
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  if (teamsCopy.length <= 1) {
    return teamsCopy
  }

  const middle = Math.floor(teamsCopy.length / 2)
  const leftHalf = []
  const rightHalf = []

  for (let i = 0; i < middle; i++) {
    leftHalf[i] = teamsCopy[i]
  }

  for (let i = middle; i < teamsCopy.length; i++) {
    rightHalf[i - middle] = teamsCopy[i]
  }

  const sortedLeft = mergeSort(leftHalf, rankingType)
  const sortedRight = mergeSort(rightHalf, rankingType)

  return merge(sortedLeft, sortedRight, rankingType)
}


function merge(left, right, rankingType) {
  const result = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compareRankings(left[leftIndex], right[rightIndex], rankingType)) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  while (leftIndex < left.length) {
    result.push(left[leftIndex])
    leftIndex++
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex])
    rightIndex++
  }

  return result
}

function compareRankings(teamA, teamB, rankingType) {
  if (rankingType === "higherBetter") {
    return teamA.ranking > teamB.ranking
  } else {
    return teamA.ranking < teamB.ranking
  }
}

