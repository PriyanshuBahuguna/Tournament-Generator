/**
 * Algorithm to avoid early clashes between top-ranked teams
 * This uses a modified bracket placement strategy to ensure top teams are placed
 * in different parts of the bracket
 *
 * @param {Array} teams - Array of team objects (already sorted by ranking)
 * @returns {Array} - Reordered array of teams to avoid early top-team clashes
 */
export function avoidTopTeamClashes(teams) {
  if (teams.length < 4) {
    return [...teams] 
  }

  const result = new Array(teams.length)

  const numRounds = Math.ceil(Math.log2(teams.length))

  const filledPositions = new Set()


  for (let i = 0; i < teams.length; i++) {
    try {
      const seedPosition = getSeedPosition(i + 1, numRounds)

      const arrayIndex = seedPosition - 1

      if (arrayIndex >= 0 && arrayIndex < teams.length && !filledPositions.has(arrayIndex)) {
        result[arrayIndex] = teams[i]
        filledPositions.add(arrayIndex)
      } else {
        let nextAvailable = 0
        while (nextAvailable < teams.length && filledPositions.has(nextAvailable)) {
          nextAvailable++
        }

        if (nextAvailable < teams.length) {
          result[nextAvailable] = teams[i]
          filledPositions.add(nextAvailable)
        } else {
          console.error(`Cannot place team at position ${arrayIndex}, no available positions left`)
        }
      }
    } catch (error) {
      console.error(`Error placing team ${i}:`, error)
    }
  }

  let remainingTeamIndex = 0
  for (let i = 0; i < result.length; i++) {
    if (result[i] === undefined) {
      while (remainingTeamIndex < teams.length && filledPositions.has(teams[remainingTeamIndex].id)) {
        remainingTeamIndex++
      }

      if (remainingTeamIndex < teams.length) {
        result[i] = teams[remainingTeamIndex]
        remainingTeamIndex++
      } else {
        console.error(`Cannot fill position ${i}, no remaining teams`)
        result[i] = teams[0]
      }
    }
  }

  if (result.length !== teams.length) {
    console.error(`avoidTopTeamClashes: Result length (${result.length}) doesn't match input length (${teams.length})`)
    return [...teams] 
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i] === undefined) {
      console.error(`avoidTopTeamClashes: Result contains undefined element at index ${i}`)
      return [...teams] 
    }
  }

  return result
}

/**
 * Calculate the position for a seed in a standard tournament bracket
 * This follows the typical tournament seeding pattern where:
 * - 1 seed is at the top
 * - 2 seed is at the bottom
 * - 3 and 4 seeds are in the middle sections
 * - and so on
 *
 * @param {number} seed - The seed number (1-indexed)
 * @param {number} rounds - Number of rounds in the tournament
 * @returns {number} - The position in the bracket (1-indexed)
 */
function getSeedPosition(seed, rounds) {
  const perfectBracketSize = Math.pow(2, rounds)

  if (seed === 1) return 1
  if (seed === 2) return perfectBracketSize

  let position
  let power = 1
  while (Math.pow(2, power) < seed) {
    power++
  }

  const offset = Math.pow(2, power) - seed
  if (seed % 2 === 1) {
    position = Math.pow(2, rounds - power + 1) - (2 * offset - 1)
  } else {
    position = Math.pow(2, rounds) - Math.pow(2, rounds - power) + 1 + (2 * offset - 2)
  }

  position = Math.max(1, Math.min(perfectBracketSize, position))

  return position
}
