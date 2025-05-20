/**
 * Hamiltonian Path Scheduling for Tournament Matches
 *
 * Time Complexity : O(n!)
 * Space Complexity : O(n^2)
 *
 * @param {Array} matches - Array of match objects
 * @param {number} numVenues - Number of available venues
 * @returns {Array} - Matches with optimized scheduling and assigned venues
 */
export function hamiltonianPath(matches, numVenues = 1) {
  const matchesCopy = matches.map((match) => ({ ...match }));

  // Group matches by round
  const roundMatches = {};
  matchesCopy.forEach((match) => {
    if (!roundMatches[match.round]) {
      roundMatches[match.round] = [];
    }
    roundMatches[match.round].push(match);
  });

  // Process each round individually
  for (const round in roundMatches) {
    const currentRoundMatches = roundMatches[round];
    const n = currentRoundMatches.length;

    // Build weight graph (adjacency matrix)
    const graph = Array(n)
      .fill()
      .map(() => Array(n).fill(0));

    // Calculate preference weights (higher weight = preferable sequence)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const match1 = currentRoundMatches[i];
          const match2 = currentRoundMatches[j];

          let weight = 0;

          // Prefer matches in same venue together
          if (match1.venue === match2.venue) {
            weight += 10;
          }

          graph[i][j] = weight;
        }
      }
    }

    // Approximate Hamiltonian path using greedy selection
    const path = [];
    const visited = new Set();
    let current = 0;

    path.push(current);
    visited.add(current);

    while (path.length < n) {
      let bestNext = -1;
      let bestWeight = -1;

      for (let i = 0; i < n; i++) {
        if (!visited.has(i) && graph[current][i] > bestWeight) {
          bestWeight = graph[current][i];
          bestNext = i;
        }
      }

      if (bestNext === -1) {
        for (let i = 0; i < n; i++) {
          if (!visited.has(i)) {
            bestNext = i;
            break;
          }
        }
      }

      current = bestNext;
      path.push(current);
      visited.add(current);
    }

    // Assign venues and sequence numbers based on path
    for (let i = 0; i < path.length; i++) {
      const matchIndex = path[i];
      currentRoundMatches[matchIndex].venue = (i % numVenues) + 1;
      currentRoundMatches[matchIndex].sequenceNumber = i + 1;
    }
  }

  return matchesCopy;
}
