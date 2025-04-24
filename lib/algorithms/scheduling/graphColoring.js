/**
 * Traditional Graph Coloring algorithm for tournament scheduling
 * Time Complexity: O(V^2 + E) where V is the number of matches and E is the number of conflicts
 * Space Complexity: O(V^2)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues
 * @returns {Array} - Matches with assigned venues (colors)
 */
export function graphColoring(matches, numVenues = 1) {
    // Create a copy of the matches array
    const matchesCopy = [...matches].map((match) => ({ ...match }))
  
    // Build the conflict graph (adjacency matrix)
    // Two matches conflict if they share a team
    const n = matchesCopy.length
    const graph = Array(n)
      .fill()
      .map(() => Array(n).fill(false))
  
    // Populate the conflict graph
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // Check if matches share a team
        if (
          matchesCopy[i].team1Id === matchesCopy[j].team1Id ||
          matchesCopy[i].team1Id === matchesCopy[j].team2Id ||
          matchesCopy[i].team2Id === matchesCopy[j].team1Id ||
          matchesCopy[i].team2Id === matchesCopy[j].team2Id
        ) {
          graph[i][j] = true
          graph[j][i] = true
        }
      }
    }
  
    // Assign colors (venues) to matches
    const colors = Array(n).fill(0) // 0 means no color assigned
  
    // For each match
    for (let i = 0; i < n; i++) {
      // Find the first available color
      const usedColors = new Set()
  
      // Check colors of adjacent vertices
      for (let j = 0; j < n; j++) {
        if (graph[i][j] && colors[j] !== 0) {
          usedColors.add(colors[j])
        }
      }
  
      // Find the first available color
      let color = 1
      while (usedColors.has(color)) {
        color++
      }
  
      // Assign the color, but ensure it's within the number of venues
      colors[i] = ((color - 1) % numVenues) + 1
    }
  
    // Update matches with assigned venues
    for (let i = 0; i < n; i++) {
      matchesCopy[i].venue = colors[i]
    }
  
    return matchesCopy
  }
  