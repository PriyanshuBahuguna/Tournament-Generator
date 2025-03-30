import { format, addDays, differenceInDays } from "date-fns"
import type { Match, TournamentOptions, TournamentSchedule } from "../types"

export function scheduleMatches(matches: Match[], options: TournamentOptions) {
  const { startDate, endDate, includeRestDays, restDayInterval = 3, maxMatchesPerDay } = options

  if (!startDate || !endDate) {
    return { matches, schedule: null }
  }

  // Create a copy of matches to avoid modifying the original
  const scheduledMatches = [...matches]

  // Calculate total days available
  const totalDays = differenceInDays(endDate, startDate) + 1

  // Group matches by round
  const roundMatches: { [round: string]: Match[] } = {}
  scheduledMatches.forEach((match) => {
    if (!roundMatches[match.round]) {
      roundMatches[match.round] = []
    }
    roundMatches[match.round].push(match)
  })

  // Sort rounds by their logical order
  const rounds = Object.keys(roundMatches).sort((a, b) => {
    // Custom sort logic for round names
    const roundOrder: { [key: string]: number } = {
      "Round of 128": 1,
      "Round of 64": 2,
      "Round of 32": 3,
      "Round of 16": 4,
      Quarterfinals: 5,
      Semifinals: 6,
      Final: 7,
    }

    return (roundOrder[a] || 0) - (roundOrder[b] || 0)
  })

  // Calculate match days and rest days
  const matchDays: Date[] = []
  const restDays: Date[] = []
  const roundDates: { [round: string]: Date[] } = {}

  let currentDate = new Date(startDate)
  let dayCounter = 0
  let matchesScheduledToday = 0

  // Distribute matches across available days
  for (const round of rounds) {
    if (!roundDates[round]) {
      roundDates[round] = []
    }

    const matchesInRound = roundMatches[round]

    for (const match of matchesInRound) {
      // Check if we need to move to the next day
      if (maxMatchesPerDay && matchesScheduledToday >= maxMatchesPerDay) {
        currentDate = addDays(currentDate, 1)
        dayCounter++
        matchesScheduledToday = 0
      }

      // Check if this is a rest day
      if (includeRestDays && dayCounter > 0 && dayCounter % restDayInterval === 0) {
        restDays.push(new Date(currentDate))
        currentDate = addDays(currentDate, 1)
        dayCounter++
      }

      // Schedule the match
      match.scheduledDate = new Date(currentDate)
      matchDays.push(new Date(currentDate))
      roundDates[round].push(new Date(currentDate))
      matchesScheduledToday++
    }

    // Move to the next day for the next round
    currentDate = addDays(currentDate, 1)
    dayCounter++
    matchesScheduledToday = 0
  }

  // Create the schedule object
  const schedule: TournamentSchedule = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    matchDays: [...new Set(matchDays.map((d) => format(d, "yyyy-MM-dd")))].map((d) => new Date(d)),
    restDays,
    roundDates,
  }

  return { matches: scheduledMatches, schedule }
}

