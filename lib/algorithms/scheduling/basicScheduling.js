/**
 * Basic Venue Scheduling Algorithm
 * Assigns venues to matches in a simple round-robin manner.
 *
 * Time Complexity : O(n)
 * Space Complexity : O(n)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues (default 1)
 * @returns {Array} - Matches with assigned venues
 */
export function basicScheduling(matches, numVenues = 1) {
  // Create a copy to avoid modifying original array
  const matchesCopy = matches.map((match) => ({ ...match }));

  // Assign venue numbers in round-robin style
  for (let i = 0; i < matchesCopy.length; i++) {
    matchesCopy[i].venue = (i % numVenues) + 1;
  }

  // Return scheduled matches
  return matchesCopy;
}
