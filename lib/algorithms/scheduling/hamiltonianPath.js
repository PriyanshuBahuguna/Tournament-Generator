/**
 * Traditional Hamiltonian Path algorithm for tournament scheduling
 * Time Complexity: O(n!) in worst case, but optimized for tournament scheduling
 * Space Complexity: O(n^2)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues
 * @returns {Array} - Matches with assigned venues and optimized scheduling
 */
export function hamiltonianPath(matches, numVenues = 1) {
    // Create a copy of the matches array
    const matchesCopy = [...matches].map((match) => ({ ...match }))
  
    // Group matches by round
    const roundMatches = {}
    for (const match of matchesCopy) {
      if (!roundMatches[match.round]) {
        roundMatches[match.round] = []
      }
      roundMatches[match.round].push(match)
    }
  
    // Process each round separately
    for (const round in roundMatches) {
      const currentRoundMatches = roundMatches[round]
  
      // Build the graph for this round
      const n = currentRoundMatches.length
      const graph = Array(n)
        .fill()
        .map(() => Array(n).fill(0))
  
      // Calculate weights between matches (distance/preference metric)
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i !== j) {
            // Calculate some weight based on team rankings or match importance
            // Higher weight means more preferable to schedule these matches consecutively
            const match1 = currentRoundMatches[i]
            const match2 = currentRoundMatches[j]
  
            // Simple weight calculation - can be customized
            let weight = 0
  
            // Prefer matches with the same venue to be scheduled together
            if (match1.venue === match2.venue) {
              weight += 10
            }
  
            // Store the weight
            graph[i][j] = weight
          }
        }
      }
  
      // Find an approximate Hamiltonian path using a greedy approach
      const path = []
      const visited = new Set()
  
      // Start with the first match
      let current = 0
      path.push(current)
      visited.add(current)
  
      // Build the path
      while (path.length < n) {
        let bestNext = -1
        let bestWeight = -1
  
        // Find the unvisited match with the highest weight
        for (let i = 0; i < n; i++) {
          if (!visited.has(i) && graph[current][i] > bestWeight) {
            bestWeight = graph[current][i]
            bestNext = i
          }
        }
  
        // If no unvisited match found, pick any unvisited match
        if (bestNext === -1) {
          for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
              bestNext = i
              break
            }
          }
        }
  
        // Add to path
        current = bestNext
        path.push(current)
        visited.add(current)
      }
  
      // Assign venues based on the path and available venues
      for (let i = 0; i < path.length; i++) {
        const matchIndex = path[i]
        currentRoundMatches[matchIndex].venue = (i % numVenues) + 1
  
        // Also assign a sequence number for ordering
        currentRoundMatches[matchIndex].sequenceNumber = i + 1
      }
    }
  
    return matchesCopy
  }
  