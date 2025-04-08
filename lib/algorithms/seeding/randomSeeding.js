/**
 * Fisher-Yates shuffle algorithm for random seeding
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * @param {Array} teams - Array of team objects
 * @returns {Array} - Randomly shuffled array of teams
 */
export function randomSeeding(teams) {
  // Create a copy of the array to avoid modifying the original
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  // Fisher-Yates shuffle algorithm
  for (let i = teamsCopy.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements at i and j
    const temp = teamsCopy[i]
    teamsCopy[i] = teamsCopy[j]
    teamsCopy[j] = temp
  }

  return teamsCopy
}

