/**
 * Basic Venue Scheduling Algorithm
 * Assigns venues to matches in a simple round-robin manner using venue names.
 *
 * Time Complexity : O(n)
 * Space Complexity : O(n)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues (default 1)
 * @param {Array} venueNames - Array of venue names (optional)
 * @returns {Array} - Matches with assigned venues
 */
export function basicScheduling(matches, numVenues = 1, venueNames = []) {
  const matchesCopy = matches.map((match) => ({ ...match }));

  const venues = Array(numVenues).fill("").map((_, i) => 
    venueNames[i] || `Venue ${i + 1}`
  );

  for (let i = 0; i < matchesCopy.length; i++) {
    matchesCopy[i].venue = venues[i % numVenues];
  }

  return matchesCopy;
}