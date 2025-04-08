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
    return teams
  }

  // Create a new array for the result
  const result = new Array(teams.length)

  // Calculate the number of rounds in the tournament
  const numRounds = Math.ceil(Math.log2(teams.length))

  // Place teams according to standard tournament seeding pattern
  // This ensures top seeds are placed in different parts of the bracket
  for (let i = 0; i < teams.length; i++) {
    const seedPosition = getSeedPosition(i + 1, numRounds)
    result[seedPosition - 1] = teams[i]
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

  return position
}

