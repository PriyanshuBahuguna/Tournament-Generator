import { PriorityQueue } from "./priorityQueue"

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

  // Create a priority queue of available teams (not in the tournament yet)
  // These are teams that could replace withdrawn teams
  const comparator = (a, b) => {
    if (rankingType === "higherBetter") {
      return a.ranking > b.ranking
    } else {
      return a.ranking < b.ranking
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
  for (const team of teams) {
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
