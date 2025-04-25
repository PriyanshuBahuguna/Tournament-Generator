/**
 * Algorithm to avoid early clashes between top-ranked teams
 * This uses a modified bracket placement strategy to ensure top teams are placed
 * in different parts of the bracket
 *
 * @param {Array} teams - Array of team objects (already sorted by ranking)
 * @returns {Array} - Reordered array of teams to avoid early top-team clashes
 */
export function avoidTopTeamClashes(teams) {
  // If we have fewer than 4 teams, no need for special placement
  if (teams.length < 4) {
    return [...teams] // Return a copy of the original array
  }

  // Create a new array for the result with the same length as teams
  const result = new Array(teams.length)

  // Calculate the number of rounds in the tournament
  const numRounds = Math.ceil(Math.log2(teams.length))

  // Track which positions have been filled
  const filledPositions = new Set()

  // Place teams according to standard tournament seeding pattern
  // This ensures top seeds are placed in different parts of the bracket
  for (let i = 0; i < teams.length; i++) {
    try {
      // Calculate the seed position (1-indexed)
      const seedPosition = getSeedPosition(i + 1, numRounds)

      // Convert to 0-indexed for array access
      const arrayIndex = seedPosition - 1

      // Ensure the position is valid
      if (arrayIndex >= 0 && arrayIndex < teams.length && !filledPositions.has(arrayIndex)) {
        result[arrayIndex] = teams[i]
        filledPositions.add(arrayIndex)
      } else {
        // Find the next available position if there's a collision or invalid position
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

  // Fill any remaining undefined positions with remaining teams
  let remainingTeamIndex = 0
  for (let i = 0; i < result.length; i++) {
    if (result[i] === undefined) {
      // Find a team that hasn't been placed yet
      while (remainingTeamIndex < teams.length && filledPositions.has(teams[remainingTeamIndex].id)) {
        remainingTeamIndex++
      }

      if (remainingTeamIndex < teams.length) {
        result[i] = teams[remainingTeamIndex]
        remainingTeamIndex++
      } else {
        // This should not happen if our logic is correct
        console.error(`Cannot fill position ${i}, no remaining teams`)
        // As a fallback, duplicate a team to ensure array length is correct
        result[i] = teams[0]
      }
    }
  }

  // Verify that the result array has the correct length and no undefined elements
  if (result.length !== teams.length) {
    console.error(`avoidTopTeamClashes: Result length (${result.length}) doesn't match input length (${teams.length})`)
    return [...teams] // Return a copy of the original array as fallback
  }

  // Check for undefined elements
  for (let i = 0; i < result.length; i++) {
    if (result[i] === undefined) {
      console.error(`avoidTopTeamClashes: Result contains undefined element at index ${i}`)
      return [...teams] // Return a copy of the original array as fallback
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
  // For a perfect bracket with 2^n teams
  const perfectBracketSize = Math.pow(2, rounds)

  // Base case: seeds 1 and 2
  if (seed === 1) return 1
  if (seed === 2) return perfectBracketSize

  // For other seeds, calculate their position
  let position
  let power = 1
  while (Math.pow(2, power) < seed) {
    power++
  }

  const offset = Math.pow(2, power) - seed
  if (seed % 2 === 1) {
    // Odd seed
    position = Math.pow(2, rounds - power + 1) - (2 * offset - 1)
  } else {
    // Even seed
    position = Math.pow(2, rounds) - Math.pow(2, rounds - power) + 1 + (2 * offset - 2)
  }

  // Ensure position is within valid range (1 to perfectBracketSize)
  position = Math.max(1, Math.min(perfectBracketSize, position))

  return position
}
