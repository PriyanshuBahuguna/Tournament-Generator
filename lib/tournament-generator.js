import { mergeSort } from "./algorithms/seeding/mergeSort"
import { randomSeeding } from "./algorithms/seeding/randomSeeding"
import { manualSeeding } from "./algorithms/seeding/manualSeeding"
import { avoidTopTeamClashes } from "./algorithms/seeding/avoidTopTeamClashes"
import { basicScheduling } from "./algorithms/scheduling/basicScheduling"
import { graphColoring } from "./algorithms/scheduling/graphColoring"
import { scheduleMatchDates } from "./algorithms/scheduling/dates"
import { dynamicReseeding } from "./algorithms/reseeding/dynamicReseeding"

export function generateTournament(teams, options, rankingType = "higherBetter") {
  const insights = []
  let matches = []
  let schedule = []

  if (!Array.isArray(teams) || teams.length === 0) {
    insights.push("Error: No teams provided")
    return { matches: [], insights, schedule: [] }
  }

  insights.push("Tournament: Knockout")

  let seededTeams = [...teams]

  try {
    switch (options.seedingMethod) {
      case "mergeSort":
        seededTeams = mergeSort(teams, rankingType)
        insights.push("Seeding: Merge Sort, O(n log n)")
        break
      case "manual":
        seededTeams = manualSeeding(teams)
        insights.push("Seeding: Manual, O(n)")
        break
      case "random":
      default:
        seededTeams = randomSeeding(teams)
        insights.push("Seeding: Random, O(n)")
        break
    }

    if (options.avoidTopTeamClashes && options.seedingMethod !== "manual") {
      try {
        const avoidedTeams = avoidTopTeamClashes(seededTeams)

        if (Array.isArray(avoidedTeams) && avoidedTeams.length === seededTeams.length) {
          seededTeams = avoidedTeams
          insights.push("Optimization: Avoid Top Team Clashes")
        } else {
          console.error("avoidTopTeamClashes returned invalid result, using original seeding")
          insights.push("Error: Top Team Clash avoidance failed, using original seeding")
        }
      } catch (error) {
        console.error("Error in avoidTopTeamClashes:", error)
        insights.push("Error: Top Team Clash avoidance failed, using original seeding")
      }
    } else if (options.avoidTopTeamClashes && options.seedingMethod === "manual") {
      insights.push("Note: Top Team Clash avoidance not applied with Manual seeding")
    }

    matches = generateBracketMatches(seededTeams)

    switch (options.schedulingMethod) {
      case "graphColoring":
        matches = graphColoring(matches, options.numVenues, options.venueNames)
        insights.push("Scheduling: Graph Coloring, O(n²)")
        break
      case "basic":
      default:
        matches = basicScheduling(matches, options.numVenues, options.venueNames)
        insights.push("Scheduling: Basic, O(n)")
        break
    }

    if (options.enableDynamicReseeding && options.withdrawnTeams && options.withdrawnTeams.length > 0) {
      matches = dynamicReseeding(matches, teams, options.withdrawnTeams, rankingType)
      insights.push("Dynamic Reseeding: Enabled with Priority Queue")
    }

    if (options.startDate && options.endDate) {
      schedule = scheduleMatchDates(matches, options)
      insights.push("Date Scheduling: Enabled")
      if (options.enableRestDays) {
        insights.push(`Rest Days: Between rounds`)
      }
    }
  } catch (error) {
    console.error("Error generating tournament:", error)
    insights.push(`Error: ${error.message || "Tournament generation failed"}`)
  }

  return { matches, insights, schedule }
}

function generateBracketMatches(teams) {
  if (!Array.isArray(teams) || teams.length === 0) {
    console.error("No teams provided to generateBracketMatches")
    return []
  }

  const matches = []
  const numTeams = teams.length

  let roundNames = []

  if (numTeams <= 2) {
    roundNames = ["Final"]
  } else if (numTeams <= 4) {
    roundNames = ["Semifinals", "Final"]
  } else if (numTeams <= 8) {
    roundNames = ["Quarterfinals", "Semifinals", "Final"]
  } else if (numTeams <= 16) {
    roundNames = ["Round of 16", "Quarterfinals", "Semifinals", "Final"]
  } else if (numTeams <= 32) {
    roundNames = ["Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"]
  } else if (numTeams <= 64) {
    roundNames = ["Round of 64", "Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"]
  } else {
    roundNames = ["Round of 128", "Round of 64", "Round of 32", "Round of 16", "Quarterfinals", "Semifinals", "Final"]
  }

  for (let roundIndex = 0; roundIndex < roundNames.length; roundIndex++) {
    const roundName = roundNames[roundIndex]
    const numMatchesInRound = Math.pow(2, roundNames.length - roundIndex - 1)

    for (let matchIndex = 0; matchIndex < numMatchesInRound; matchIndex++) {
      const matchId = `r${roundIndex + 1}-m${matchIndex + 1}`

      let nextMatchId
      if (roundIndex < roundNames.length - 1) {
        const nextRoundMatchIndex = Math.floor(matchIndex / 2)
        nextMatchId = `r${roundIndex + 2}-m${nextRoundMatchIndex + 1}`
      }

      matches.push({
        id: matchId,
        matchNumber: matchIndex + 1,
        round: roundName,
        team1Id: null,
        team2Id: null,
        venue: "Venue 1", // Default value
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

// Propagate byes through the bracket
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