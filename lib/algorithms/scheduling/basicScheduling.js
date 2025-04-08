/**
 * Basic scheduling algorithm for tournament matches
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues
 * @returns {Array} - Matches with assigned venues
 */
export function basicScheduling(matches, numVenues = 1) {
  // Create a copy of the matches array
  const matchesCopy = []
  for (let i = 0; i < matches.length; i++) {
    matchesCopy[i] = { ...matches[i] }
  }

  // Assign venues in a round-robin fashion
  for (let i = 0; i < matchesCopy.length; i++) {
    matchesCopy[i].venue = (i % numVenues) + 1
  }

  return matchesCopy
}

