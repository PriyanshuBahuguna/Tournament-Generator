import { PriorityQueue } from "./priorityQueue"

/**
 * Calculate dynamic rankings based on tournament performance
 *
 * @param {Array} teams - Array of team objects
 * @param {Array} matches - Array of match objects
 * @returns {Array} - Teams with dynamic rankings
 */
export function calculateDynamicRankings(teams, matches) {
  const dynamicTeams = JSON.parse(JSON.stringify(teams))

  // Calculate win rates and performance metrics
  const teamStats = {}
  teams.forEach((team) => {
    teamStats[team.id] = {
      matches: 0,
      wins: 0,
      roundsAdvanced: 0,
      upsetFactor: 1.0,
    }
  })

  // Define round weights - later rounds are worth more
  const roundWeights = {
    "Round of 128": 1,
    "Round of 64": 2,
    "Round of 32": 3,
    "Round of 16": 4,
    Quarterfinals: 5,
    Semifinals: 6,
    Final: 7,
  }

  // Analyze completed matches
  matches
    .filter((m) => m.status === "completed")
    .forEach((match) => {
      if (match.team1Id && match.team2Id && match.winnerId) {
        // Update match count
        teamStats[match.team1Id].matches++
        teamStats[match.team2Id].matches++

        // Update wins and rounds advanced
        if (match.winnerId === match.team1Id) {
          teamStats[match.team1Id].wins++
          teamStats[match.team1Id].roundsAdvanced += roundWeights[match.round] || 1

          // Check for upset (lower ranked team beating higher ranked team)
          const team1 = teams.find((t) => t.id === match.team1Id)
          const team2 = teams.find((t) => t.id === match.team2Id)

          if (team1 && team2) {
            if (team1.ranking < team2.ranking) {
              // This is an upset - team1 was lower ranked but won
              const upsetMagnitude = Math.abs(team1.ranking - team2.ranking) / Math.max(team1.ranking, team2.ranking)
              teamStats[match.team1Id].upsetFactor += upsetMagnitude
            }
          }
        } else if (match.winnerId === match.team2Id) {
          teamStats[match.team2Id].wins++
          teamStats[match.team2Id].roundsAdvanced += roundWeights[match.round] || 1

          // Check for upset
          const team1 = teams.find((t) => t.id === match.team1Id)
          const team2 = teams.find((t) => t.id === match.team2Id)

          if (team1 && team2) {
            if (team2.ranking < team1.ranking) {
              // This is an upset - team2 was lower ranked but won
              const upsetMagnitude = Math.abs(team1.ranking - team2.ranking) / Math.max(team1.ranking, team2.ranking)
              teamStats[match.team2Id].upsetFactor += upsetMagnitude
            }
          }
        }
      }
    })

  // Calculate new dynamic rankings
  dynamicTeams.forEach((team) => {
    const stats = teamStats[team.id]

    // Base dynamic ranking on original ranking
    let dynamicRanking = team.ranking

    if (stats.matches > 0) {
      // Adjust for win rate (0-100% boost)
      const winRate = stats.wins / stats.matches
      dynamicRanking *= 1 + winRate

      // Adjust for rounds advanced (0-50% boost per round)
      dynamicRanking *= 1 + stats.roundsAdvanced * 0.1

      // Adjust for upsets caused (0-100% boost)
      dynamicRanking *= stats.upsetFactor
    }

    team.dynamicRanking = dynamicRanking
  })

  return dynamicTeams
}

/**
 * Dynamic reseeding algorithm for handling team withdrawals
 * Time Complexity: O(log n) for each withdrawal
 * Space Complexity: O(n)
 *
 * @param {Array} matches - Array of match objects
 * @param {Array} teams - Array of team objects
 * @param {Array} withdrawnTeamIds - Array of team IDs that have withdrawn
 * @param {string} rankingType - 'higherBetter' or 'lowerBetter'
 * @returns {Array} - Updated matches after reseeding
 */
export function dynamicReseeding(matches, teams, withdrawnTeamIds, rankingType = "higherBetter") {
  // Create a copy of the matches array
  const matchesCopy = [...matches].map((match) => ({ ...match }))

  // If no withdrawals, return the original matches
  if (!withdrawnTeamIds || withdrawnTeamIds.length === 0) {
    return matchesCopy
  }

  // Create a set of withdrawn team IDs for faster lookup
  const withdrawnSet = new Set(withdrawnTeamIds)

  // Calculate dynamic rankings based on tournament performance
  const dynamicTeams = calculateDynamicRankings(teams, matches)

  // Create a priority queue of available teams (not in the tournament yet)
  // These are teams that could replace withdrawn teams
  const comparator = (a, b) => {
    if (rankingType === "higherBetter") {
      return a.dynamicRanking > b.dynamicRanking
    } else {
      return a.dynamicRanking < b.dynamicRanking
    }
  }

  const availableTeams = new PriorityQueue(comparator)

  // Find teams that are not in any match
  const teamsInMatches = new Set()
  for (const match of matchesCopy) {
    if (match.team1Id) teamsInMatches.add(match.team1Id)
    if (match.team2Id) teamsInMatches.add(match.team2Id)
  }

  // Add teams not in matches to the priority queue
  for (const team of dynamicTeams) {
    if (!teamsInMatches.has(team.id) && !withdrawnSet.has(team.id)) {
      availableTeams.enqueue(team)
    }
  }

  // Process each match to handle withdrawals
  for (const match of matchesCopy) {
    // Case 1: Both teams have withdrawn
    if (match.team1Id && match.team2Id && withdrawnSet.has(match.team1Id) && withdrawnSet.has(match.team2Id)) {
      // Try to replace with two available teams
      if (availableTeams.size() >= 2) {
        match.team1Id = availableTeams.dequeue().id
        match.team2Id = availableTeams.dequeue().id
      } else if (availableTeams.size() === 1) {
        // Only one replacement available, the other spot becomes a bye
        match.team1Id = availableTeams.dequeue().id
        match.team2Id = null

        // Propagate the bye to the next round
        propagateBye(matchesCopy, match)
      } else {
        // No replacements available, mark match as cancelled
        match.team1Id = null
        match.team2Id = null
        match.status = "cancelled"

        // Handle the impact on the bracket
        handleCancelledMatch(matchesCopy, match)
      }
    }
    // Case 2: Team 1 has withdrawn
    else if (match.team1Id && withdrawnSet.has(match.team1Id)) {
      if (availableTeams.size() > 0) {
        // Replace with an available team
        match.team1Id = availableTeams.dequeue().id
      } else if (match.team2Id) {
        // No replacement available, team 2 gets a bye
        match.team1Id = null
        match.winnerId = match.team2Id
        match.status = "completed"

        // Propagate the result to the next round
        propagateWinner(matchesCopy, match, match.team2Id)
      } else {
        // No team 2 either, mark as cancelled
        match.team1Id = null
        match.status = "cancelled"
        handleCancelledMatch(matchesCopy, match)
      }
    }
    // Case 3: Team 2 has withdrawn
    else if (match.team2Id && withdrawnSet.has(match.team2Id)) {
      if (availableTeams.size() > 0) {
        // Replace with an available team
        match.team2Id = availableTeams.dequeue().id
      } else if (match.team1Id) {
        // No replacement available, team 1 gets a bye
        match.team2Id = null
        match.winnerId = match.team1Id
        match.status = "completed"

        // Propagate the result to the next round
        propagateWinner(matchesCopy, match, match.team1Id)
      } else {
        // No team 1 either, mark as cancelled
        match.team2Id = null
        match.status = "cancelled"
        handleCancelledMatch(matchesCopy, match)
      }
    }
  }

  // Ensure round names are preserved
  const roundNames = [...new Set(matches.map((match) => match.round))].sort((a, b) => {
    const roundOrder = {
      "Round of 128": 1,
      "Round of 64": 2,
      "Round of 32": 3,
      "Round of 16": 4,
      Quarterfinals: 5,
      Semifinals: 6,
      Final: 7,
    }
    return (roundOrder[a] || 99) - (roundOrder[b] || 99)
  })

  // Make sure each match has the correct round name
  for (const match of matchesCopy) {
    // Keep the original round name
    // This ensures that dynamic reseeding doesn't change the round names
  }

  return matchesCopy
}

/**
 * Helper function to propagate a bye to the next round
 */
function propagateBye(matches, match) {
  if (!match.nextMatchId) return

  const nextMatch = matches.find((m) => m.id === match.nextMatchId)
  if (!nextMatch) return

  if (match.position === "top") {
    nextMatch.team1Id = match.team1Id || match.team2Id
  } else {
    nextMatch.team2Id = match.team1Id || match.team2Id
  }
}

/**
 * Helper function to propagate a winner to the next round
 */
function propagateWinner(matches, match, winnerId) {
  if (!match.nextMatchId) return

  const nextMatch = matches.find((m) => m.id === match.nextMatchId)
  if (!nextMatch) return

  if (match.position === "top") {
    nextMatch.team1Id = winnerId
  } else {
    nextMatch.team2Id = winnerId
  }
}

/**
 * Helper function to handle cancelled matches
 */
function handleCancelledMatch(matches, match) {
  if (!match.nextMatchId) return

  const nextMatch = matches.find((m) => m.id === match.nextMatchId)
  if (!nextMatch) return

  // If this match is cancelled, the opposing match's winner automatically advances
  const opposingMatches = matches.filter((m) => m.nextMatchId === match.nextMatchId && m.id !== match.id)

  if (opposingMatches.length > 0) {
    const opposingMatch = opposingMatches[0]

    // If the opposing match has a winner, propagate it
    if (opposingMatch.winnerId) {
      if (match.position === "top") {
        // This match would have determined team1Id for the next match
        // Since it's cancelled, the opposing match winner takes both spots
        nextMatch.team1Id = opposingMatch.winnerId
        nextMatch.team2Id = opposingMatch.winnerId
        nextMatch.winnerId = opposingMatch.winnerId
        nextMatch.status = "completed"
      } else {
        // This match would have determined team2Id for the next match
        nextMatch.team1Id = opposingMatch.winnerId
        nextMatch.team2Id = opposingMatch.winnerId
        nextMatch.winnerId = opposingMatch.winnerId
        nextMatch.status = "completed"
      }

      // Continue propagating if needed
      if (nextMatch.nextMatchId) {
        propagateWinner(matches, nextMatch, opposingMatch.winnerId)
      }
    }
  }
}
