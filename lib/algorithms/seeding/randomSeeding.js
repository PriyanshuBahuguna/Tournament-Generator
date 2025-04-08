/**
 * @param {Array} teams - Array of team objects
 * @returns {Array} - Randomly shuffled array of teams
 */
export function randomSeeding(teams) {
  const teamsCopy = []
  for (let i = 0; i < teams.length; i++) {
    teamsCopy[i] = teams[i]
  }

  for (let i = teamsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    const temp = teamsCopy[i]
    teamsCopy[i] = teamsCopy[j]
    teamsCopy[j] = temp
  }

  return teamsCopy
}

