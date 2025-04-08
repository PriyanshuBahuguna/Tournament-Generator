import { quickSort } from "./algorithms/seeding/quickSort"
import { mergeSort } from "./algorithms/seeding/mergeSort"
import { randomSeeding } from "./algorithms/seeding/randomSeeding"
import { avoidTopTeamClashes } from "./algorithms/seeding/avoidTopTeamClashes"
import { basicScheduling } from "./algorithms/scheduling/basicScheduling"

export function generateTournament(teams, options, rankingType = "higherBetter") {
  const insights = []
  let matches = []

  // Ensure teams is an array and not empty
  if (!Array.isArray(teams) || teams.length === 0) {
    insights.push("Error: No teams provided")
    return { matches: [], insights, schedule: null }
  }

  // Only implement knockout tournament
  if (options.tournamentType !== "knockout") {
    insights.push("Tournament: " + options.tournamentType + " (Not implemented yet)")
    return { matches: [], insights, schedule: null }
  }

  insights.push("Tournament: Knockout")

  // Step 1: Seed the teams based on the selected method
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

  // Apply top-team clash avoidance if enabled
  if (options.avoidTopTeamClashes) {
    seededTeams = avoidTopTeamClashes(seededTeams)
    insights.push("Optimization: Avoid Top Team Clashes")
  }

  // Step 2: Generate the bracket structure
  matches = generateBracketMatches(seededTeams)

  // Step 3: Assign venues (only basic scheduling is implemented)
  matches = basicScheduling(matches, options.numVenues)
  insights.push("Scheduling: Basic, O(n)")

  return { matches, insights, schedule: null }
}

// Generate the bracket structure
function generateBracketMatches(teams) {
  // Ensure teams is an array and not empty
  if (!Array.isArray(teams) || teams.length === 0) {
    console.error("No teams provided to generateBracketMatches")
    return []
  }

  const matches = []
  const numTeams = teams.length

  // Calculate the number of rounds needed based on team count
  const numRounds = Math.ceil(Math.log2(numTeams))

  // Define round names based on the number of rounds
  const roundNames = []

  // Always have Final
  roundNames.push("Final")

  // Add Semifinals if needed
  if (numRounds > 1) roundNames.unshift("Semifinals")

  // Add Quarterfinals if needed
  if (numRounds > 2) roundNames.unshift("Quarterfinals")

  // Add Round of 16, Round of 32, etc. as needed
  for (let i = 3; i < numRounds; i++) {
    const roundSize = Math.pow(2, i + 1)
    roundNames.unshift(`Round of ${roundSize}`)
  }

  // Generate matches for each round
  for (let roundIndex = 0; roundIndex < numRounds; roundIndex++) {
    const roundName = roundNames[roundIndex]
    const numMatchesInRound = Math.pow(2, numRounds - roundIndex - 1)

    for (let matchIndex = 0; matchIndex < numMatchesInRound; matchIndex++) {
      const matchId = `r${roundIndex + 1}-m${matchIndex + 1}`

      // Determine the next match this winner goes to (if not the final)
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

  // Assign teams to the first round
  const firstRoundMatches = matches.filter((m) => m.round === roundNames[0])

  for (let i = 0; i < firstRoundMatches.length; i++) {
    // Check if team exists at index i*2 before accessing its id
    if (i * 2 < teams.length && teams[i * 2] && teams[i * 2].id !== undefined) {
      firstRoundMatches[i].team1Id = teams[i * 2].id
    }

    // Check if team exists at index i*2+1 before accessing its id
    if (i * 2 + 1 < teams.length && teams[i * 2 + 1] && teams[i * 2 + 1].id !== undefined) {
      firstRoundMatches[i].team2Id = teams[i * 2 + 1].id
    }
  }

  // If we have byes (not enough teams to fill the bracket), propagate teams to next rounds
  propagateByes(matches, roundNames)

  return matches
}

// Propagate byes through the bracket
function propagateByes(matches, roundNames) {
  for (let i = 0; i < roundNames.length - 1; i++) {
    const currentRound = roundNames[i]
    const roundMatches = matches.filter((m) => m.round === currentRound)

    for (const match of roundMatches) {
      // If one team is missing, the other team advances
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

