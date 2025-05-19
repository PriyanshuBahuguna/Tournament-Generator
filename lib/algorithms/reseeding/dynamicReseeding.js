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
  const matchesCopy = [...matches].map((match) => ({ ...match }))

  if (!withdrawnTeamIds || withdrawnTeamIds.length === 0) {
    return matchesCopy
  }

  const withdrawnSet = new Set(withdrawnTeamIds)

  const comparator = (a, b) => rankingType === "higherBetter" ? a.ranking > b.ranking : a.ranking < b.ranking

  const availableTeams = new PriorityQueue(comparator)
  const teamsInMatches = new Set()
  for (const match of matchesCopy) {
    if (match.team1Id) teamsInMatches.add(match.team1Id)
    if (match.team2Id) teamsInMatches.add(match.team2Id)
  }

  for (const team of teams) {
    if (!teamsInMatches.has(team.id) && !withdrawnSet.has(team.id)) {
      availableTeams.enqueue(team)
    }
  }

  for (const match of matchesCopy) {
    if (match.team1Id && match.team2Id && withdrawnSet.has(match.team1Id) && withdrawnSet.has(match.team2Id)) {
      if (availableTeams.size() >= 2) {
        match.team1Id = availableTeams.dequeue().id
        match.team2Id = availableTeams.dequeue().id
      } else if (availableTeams.size() === 1) {
        match.team1Id = availableTeams.dequeue().id
        match.team2Id = null

        propagateBye(matchesCopy, match)
      } else {
        match.team1Id = null
        match.team2Id = null
        match.status = "cancelled"
        match.team1Id = null
        match.team2Id = null
        match.status = "cancelled"

        handleCancelledMatch(matchesCopy, match)
      }
    }
    else if (match.team1Id && withdrawnSet.has(match.team1Id)) {
      if (availableTeams.size() > 0) {
        match.team1Id = availableTeams.dequeue().id
      } else if (match.team2Id) {
        match.team1Id = null
        match.winnerId = match.team2Id
        match.status = "completed"

        propagateWinner(matchesCopy, match, match.team2Id)
      } else {
        match.team1Id = null
        match.status = "cancelled"
        handleCancelledMatch(matchesCopy, match)
      }
    }
    else if (match.team2Id && withdrawnSet.has(match.team2Id)) {
      if (availableTeams.size() > 0) {
        match.team2Id = availableTeams.dequeue().id
      } else if (match.team1Id) {
        match.team2Id = null
        match.winnerId = match.team1Id
        match.status = "completed"
        propagateWinner(matchesCopy, match, match.team1Id)
      } else {
        match.team2Id = null
        match.status = "cancelled"
        handleCancelledMatch(matchesCopy, match)
      }
    }
  }

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

  for (const match of matchesCopy) {
    match.round = roundNames[match.roundIndex]
  }

  return matchesCopy
}


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


function handleCancelledMatch(matches, match) {
  if (!match.nextMatchId) return

  const nextMatch = matches.find((m) => m.id === match.nextMatchId)
  if (!nextMatch) return

  const opposingMatches = matches.filter((m) => m.nextMatchId === match.nextMatchId && m.id !== match.id)

  if (opposingMatches.length) {
    const opposingMatch = opposingMatches[0]

    if (opposingMatch.winnerId) {
      if (match.position === "top") {
        nextMatch.team1Id = opposingMatch.winnerId
        nextMatch.team2Id = opposingMatch.winnerId
        nextMatch.winnerId = opposingMatch.winnerId
        nextMatch.status = "completed"
      } else {
        nextMatch.team1Id = opposingMatch.winnerId
        nextMatch.team2Id = opposingMatch.winnerId
        nextMatch.winnerId = opposingMatch.winnerId
        nextMatch.status = "completed"
      }

      if (nextMatch.nextMatchId) {
        propagateWinner(matches, nextMatch, opposingMatch.winnerId)
      }
    }
  }
}
