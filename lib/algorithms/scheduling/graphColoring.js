/**
 * Graph Coloring Algorithm for Conflict-Free Tournament Scheduling
 *
 * Time Complexity : O(V^2 + E)
 * Space Complexity : O(V^2)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues
 * @param {Array} venueNames - Array of venue names (optional)
 * @returns {Array} - Matches with assigned venues (colors)
 */
export function graphColoring(matches, numVenues = 1, venueNames = []) {
    const matchesCopy = [...matches].map((match) => ({ ...match }))
  
    const n = matchesCopy.length
    const graph = Array(n)
      .fill()
      .map(() => Array(n).fill(false))
  
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (
          matchesCopy[i].team1Id === matchesCopy[j].team1Id ||
          matchesCopy[i].team1Id === matchesCopy[j].team2Id ||
          matchesCopy[i].team2Id === matchesCopy[j].team1Id ||
          matchesCopy[i].team2Id === matchesCopy[j].team2Id
        )  {
          graph[i][j] = true
          graph[j][i] = true
        }
      }
    }
  
    const colors = Array(n).fill(0)
  
    for (let i = 0; i < n; i++){
      const usedColors = new Set()
  
      for (let j = 0; j < n; j++){
        if (graph[i][j] && colors[j] !== 0) {
          usedColors.add(colors[j])
        }
      }
  
      let color = 1
      while (usedColors.has(color)){
        color++
      }
  
      colors[i] = ((color - 1) % numVenues) + 1
    }

    const venues = Array(numVenues).fill("").map((_, i) => 
      venueNames[i] || `Venue ${i + 1}`
    );

    for (let i = 0; i < n; i++){
      matchesCopy[i].venue = venues[colors[i] - 1]
    }
    return matchesCopy
}