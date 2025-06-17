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
  // Create a copy to avoid modifying original array
  const matchesCopy = matches.map((match) => ({ ...match }));

  // Generate default venue names if not provided
  const venues = Array(numVenues).fill("").map((_, i) => 
    venueNames[i] || `Venue ${i + 1}`
  );

  // Assign venue names in round-robin style
  for (let i = 0; i < matchesCopy.length; i++) {
    matchesCopy[i].venue = venues[i % numVenues];
  }

  // Return scheduled matches
  return matchesCopy;
}