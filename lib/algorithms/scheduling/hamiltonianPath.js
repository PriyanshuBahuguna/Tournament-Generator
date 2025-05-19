/**
 * Traditional Hamiltonian Path algorithm for tournament scheduling
 * Time Complexity: O(n!) in worst case, but optimized for tournament scheduling
 * Space Complexity: O(n^2)
 *
 * @param {Array} matches - Array of match objts
 * @param {number} numVenues - Number of available venues
 * @returns {Array} - Matches with assigned venues and optimized scheduling
 */
export function hamiltonianPath(matches, numVenues = 1) {
  const matchesCopy = [...matches].map((match) => ({ ...match }));

  const roundMatches = {};
  for (const match of matchesCopy) {
    if (!roundMatches[match.round]) {
      roundMatches[match.round] = [];
    }
    roundMatches[match.round].push(match);
  }

  for (const round in roundMatches) {
    const currentRoundMatches = roundMatches[round];
    const n = currentRoundMatches.length;
    const graph = Array(n)
      .fill()
      .map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const match1 = currentRoundMatches[i];
          const match2 = currentRoundMatches[j];
          let weight = 0;
          if (match1.venue === match2.venue) {
            weight += 10;
          }
          graph[i][j] = weight;
        }
      }
    }

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

    for (let i = 0; i < path.length; i++) {
      const matchIndex = path[i];
      currentRoundMatches[matchIndex].venue = (i % numVenues) + 1;
      currentRoundMatches[matchIndex].sequenceNumber = i + 1;
    }
  }

  return matchesCopy;
}
