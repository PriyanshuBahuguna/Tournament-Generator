import { quickSort } from "./algorithms/seeding/quickSort"
import { mergeSort } from "./algorithms/seeding/mergeSort"
import { randomSeeding } from "./algorithms/seeding/randomSeeding"
import { avoidTopTeamClashes } from "./algorithms/seeding/avoidTopTeamClashes"
import { basicScheduling } from "./algorithms/scheduling/basicScheduling"

export function generateTournament(teams, options, rankingType = "higherBetter") {
  const insights = []
  let matches = []

  if (!Array.isArray(teams) || teams.length === 0) {
    insights.push("Error: No teams provided")
    return { matches: [], insights, schedule: null }
  }

  if (options.tournamentType !== "knockout") {
    insights.push("Tournament: " + options.tournamentType + " (Not implemented yet)")
    return { matches: [], insights, schedule: null }
  }

  insights.push("Tournament: Knockout")

  let seededTeams = [...teams]

  switch (options.seedingMethod) {
    case "mergeSort":
      seededTeams = mergeSort(teams, rankingType)
      insights.push("Seeding: Merge Sort, O(n log n)")
      break
    case "quickSort":
      seededTeams = quickSort(teams, rankingType)
      insights.push("Seeding: Quick Sort, O(n²)")
      break
    case "random":
    default:
      seededTeams = randomSeeding(teams)
      insights.push("Seeding: Random, O(n)")
      break
  }

  if (options.avoidTopTeamClashes) {
    seededTeams = avoidTopTeamClashes(seededTeams)
    insights.push("Optimization: Avoid Top Team Clashes")
  }

  matches = generateBracketMatches(seededTeams)

  matches = basicScheduling(matches, options.numVenues)
  insights.push("Scheduling: Basic, O(n)")

  return { matches, insights, schedule: null }
}

function generateBracketMatches(teams) {
  if (!Array.isArray(teams) || teams.length === 0) {
    console.error("No teams provided to generateBracketMatches")
    return []
  }

  const matches = []
  const numTeams = teams.length

  const numRounds = Math.ceil(Math.log2(numTeams))

  const roundNames = []

  roundNames.push("Final")

  if (numRounds > 1) roundNames.unshift("Semifinals")

  if (numRounds > 2) roundNames.unshift("Quarterfinals")

  for (let i = 3; i < numRounds; i++) {
    const roundSize = Math.pow(2, i + 1)
    roundNames.unshift(`Round of ${roundSize}`)
  }

  for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
    const roundName = roundNames[roundIndex]
    const numMatchesInRound = Math.pow(2, numRounds - roundIndex - 1)

    for (let matchIndex = 0; matchIndex < numMatchesInRound; matchIndex++) {
      const matchId = `r${roundIndex + 1}-m${matchIndex + 1}`

      let nextMatchId
      if (roundIndex < numRounds - 1) {
        const nextRoundMatchIndex = Math.floor(matchIndex / 2)
        nextMatchId = `r${roundIndex + 2}-m${nextRoundMatchIndex + 1}`
      }

      matches.push({
        id: matchId,
        matchNumber: matchIndex + 1,
        round: roundName,
        team1Id: null,
        team2Id: null,
        venue: 1,
        status: "pending",
        nextMatchId,
        position: matchIndex % 2 === 0 ? "top" : "bottom",
      })
    }
  }

  const firstRoundMatches = matches.filter((m) => m.round === roundNames[0])

  for (let i = 0; i < firstRoundMatches.length; i++) {
    if (i * 2 < teams.length && teams[i * 2] && teams[i * 2].id !== undefined) {
      firstRoundMatches[i].team1Id = teams[i * 2].id
    }

    if (i * 2 + 1 < teams.length && teams[i * 2 + 1] && teams[i * 2 + 1].id !== undefined) {
      firstRoundMatches[i].team2Id = teams[i * 2 + 1].id
    }
  }

  propagateByes(matches, roundNames)

  return matches
}

function propagateByes(matches, roundNames) {
  for (let i = 0; i < roundNames.length - 1; i++) {
    const currentRound = roundNames[i]
    const roundMatches = matches.filter((m) => m.round === currentRound)

    for (const match of roundMatches) {
      if (match.team1Id && !match.team2Id) {
        const nextMatch = matches.find((m) => m.id === match.nextMatchId)
        if (nextMatch) {
          if (match.position === "top") {
            nextMatch.team1Id = match.team1Id
          } else {
            nextMatch.team2Id = match.team1Id
          }
        }
      } else if (!match.team1Id && match.team2Id) {
        const nextMatch = matches.find((m) => m.id === match.nextMatchId)
        if (nextMatch) {
          if (match.position === "top") {
            nextMatch.team1Id = match.team2Id
          } else {
            nextMatch.team2Id = match.team2Id
          }
        }
      }
    }
  }
}

