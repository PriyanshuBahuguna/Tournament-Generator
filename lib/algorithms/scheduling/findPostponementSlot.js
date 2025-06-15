/**
 * Find a suitable date to postpone a match
 * Time Complexity: O(n) where n is the number of days in the schedule
 * Space Complexity: O(n)
 *
 * @param {Object} match - The match to be postponed
 * @param {Array} matches - All tournament matches
 * @param {Array} schedule - Tournament schedule
 * @param {Array} teams - All teams
 * @param {Object} options - Tournament options
 * @returns {Object} - Postponement details
 */
export function findPostponementSlot(match, matches, schedule, teams, options) {
    const { team1Id, team2Id, round } = match
    const { enableRestDays, restDayInterval } = options
  
    // Define round order for reference
    const roundOrder = {
      "Round of 128": 1,
      "Round of 64": 2,
      "Round of 32": 3,
      "Round of 16": 4,
      Quarterfinals: 5,
      Semifinals: 6,
      Final: 7,
    }
  
    // Find current round index and next round index
    const currentRoundIndex = roundOrder[round] || 0
    let nextRound = null
  
    // Find the next round
    for (let i = currentRoundIndex + 1; i <= 7; i++) {
      const roundName = Object.keys(roundOrder).find((key) => roundOrder[key] === i)
      if (roundName && matches.some((m) => m.round === roundName)) {
        nextRound = roundName
        break
      }
    }
  
    // Get all scheduled matches for both teams
    const team1Matches = matches.filter((m) => (m.team1Id === team1Id || m.team2Id === team1Id) && m.id !== match.id)
    const team2Matches = matches.filter((m) => (m.team1Id === team2Id || m.team2Id === team2Id) && m.id !== match.id)
  
    // Get dates when either team has a match
    const occupiedDates = new Set()
    schedule.forEach((day) => {
      if (!day.isRestDay) {
        day.matches.forEach((m) => {
          if (
            m.id !== match.id &&
            (m.team1Id === team1Id || m.team2Id === team1Id || m.team1Id === team2Id || m.team2Id === team2Id)
          ) {
            occupiedDates.add(day.date.toISOString().split("T")[0])
          }
        })
      }
    })
  
    // Find the current match's scheduled date
    let currentMatchDate = null
    for (const day of schedule) {
      if (!day.isRestDay) {
        for (const m of day.matches) {
          if (m.id === match.id) {
            currentMatchDate = new Date(day.date).toISOString().split("T")[0]
            break
          }
        }
        if (currentMatchDate) break
      }
    }
  
    // Find available dates between current round and next round
    const availableDates = []
    let currentRoundLastDay = null
    let nextRoundFirstDay = null
  
    // Find last day of current round and first day of next round
    schedule.forEach((day) => {
      if (!day.isRestDay && day.round === round) {
        if (!currentRoundLastDay || day.date > currentRoundLastDay) {
          currentRoundLastDay = new Date(day.date)
        }
      }
      if (!day.isRestDay && day.round === nextRound) {
        if (!nextRoundFirstDay || day.date < nextRoundFirstDay) {
          nextRoundFirstDay = new Date(day.date)
        }
      }
    })
  
    // If we found both days, check dates in between
    if (currentRoundLastDay && nextRoundFirstDay) {
      const dayAfterCurrentRound = new Date(currentRoundLastDay)
      dayAfterCurrentRound.setDate(dayAfterCurrentRound.getDate() + 1)
  
      for (let d = new Date(dayAfterCurrentRound); d < nextRoundFirstDay; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0]
        if (!occupiedDates.has(dateStr) && dateStr !== currentMatchDate) {
          availableDates.push(new Date(d))
        }
      }
    }
  
    // If available dates found, return the first one
    if (availableDates.length > 0) {
      return {
        date: availableDates[0],
        needsRescheduling: false,
      }
    }
  
    // If no available dates between rounds, look for the next available date after the current round
    // but before the next round's matches
    if (nextRoundFirstDay) {
      // Find a date that's at least one day after the current match date
      // but before the next round
      const currentDate = new Date(currentMatchDate)
      const potentialDate = new Date(currentDate)
      potentialDate.setDate(potentialDate.getDate() + 1) // At least one day later
  
      // Keep incrementing until we find a date that's not occupied
      while (potentialDate < nextRoundFirstDay) {
        const dateStr = potentialDate.toISOString().split("T")[0]
        if (!occupiedDates.has(dateStr)) {
          return {
            date: new Date(potentialDate),
            needsRescheduling: false,
          }
        }
        potentialDate.setDate(potentialDate.getDate() + 1)
      }
  
      // If we still couldn't find a date, use the day before next round
      // and shift everything
      const dayBeforeNextRound = new Date(nextRoundFirstDay)
      dayBeforeNextRound.setDate(dayBeforeNextRound.getDate() - 1)
  
      return {
        date: dayBeforeNextRound,
        needsRescheduling: true,
        daysToShift: enableRestDays ? restDayInterval : 1,
      }
    }
  
    // If no next round, add to the end
    const lastDay = new Date(Math.max(...schedule.map((day) => day.date.getTime())))
    const newDate = new Date(lastDay)
    newDate.setDate(newDate.getDate() + 1)
  
    // Make sure the new date is different from the current match date
    if (newDate.toISOString().split("T")[0] === currentMatchDate) {
      newDate.setDate(newDate.getDate() + 1)
    }
  
    return {
      date: newDate,
      needsRescheduling: false,
    }
  }
  