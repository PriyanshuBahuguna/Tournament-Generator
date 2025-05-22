/**
 * Postpone a match and update the schedule
 *
 * @param {string} matchId - ID of the match to postpone
 * @param {Array} matches - All tournament matches
 * @param {Array} schedule - Tournament schedule
 * @param {Array} teams - All teams
 * @param {Object} options - Tournament options
 * @returns {Object} - Updated matches and schedule
 */
export function postponeMatch(matchId, matches, schedule, teams, options) {
    // Create copies to avoid mutating the originals
    const matchesCopy = JSON.parse(JSON.stringify(matches))
    const scheduleCopy = JSON.parse(JSON.stringify(schedule))
  
    // Convert date strings back to Date objects
    scheduleCopy.forEach((day) => {
      if (day.date && typeof day.date === "string") {
        day.date = new Date(day.date)
      }
    })
  
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
  
    // Find the match to postpone
    const matchIndex = matchesCopy.findIndex((m) => m.id === matchId)
    if (matchIndex === -1) return { matches: matchesCopy, schedule: scheduleCopy }
  
    const match = matchesCopy[matchIndex]
    match.status = "postponed"
  
    // Find the original schedule day for this match
    let originalDay = null
    let originalDayIndex = -1
  
    for (let i = 0; i < scheduleCopy.length; i++) {
      const day = scheduleCopy[i]
      if (!day.isRestDay) {
        const matchIndex = day.matches.findIndex((m) => m.id === matchId)
        if (matchIndex >= 0) {
          originalDay = { ...day }
          originalDayIndex = i
          // Remove the match from its current schedule day
          day.matches.splice(matchIndex, 1)
          break
        }
      }
    }
  
    if (!originalDay) {
      console.error("Could not find original day for match", matchId)
      return { matches: matchesCopy, schedule: scheduleCopy }
    }
  
    // Find a suitable postponement slot
    const postponementSlot = findPostponementSlot(match, matchesCopy, scheduleCopy, teams, options)
  
    // Create a new schedule day for the postponed match
    const newScheduleDay = {
      date: postponementSlot.date,
      isRestDay: false,
      round: `${match.round} (Postponed)`,
      matches: [{ ...match }],
    }
  
    // Add the new day to the schedule
    scheduleCopy.push(newScheduleDay)
  
    // Sort schedule by date
    scheduleCopy.sort((a, b) => new Date(a.date) - new Date(b.date))
  
    // If we need to reschedule subsequent rounds
    if (postponementSlot.needsRescheduling) {
      const postponementDate = new Date(postponementSlot.date).toISOString().split("T")[0]
  
      // Find all days that are after the postponement date and shift them
      for (let i = 0; i < scheduleCopy.length; i++) {
        const day = scheduleCopy[i]
        const dayDate = new Date(day.date).toISOString().split("T")[0]
  
        if (dayDate > postponementDate) {
          // Check if this day contains matches from a later round
          // Only shift days with matches from later rounds
          if (!day.isRestDay) {
            const roundName = day.round.includes("Postponed") ? day.round.replace(" (Postponed)", "") : day.round
  
            const roundIndex = roundOrder[roundName] || 0
  
            if (roundIndex > roundOrder[match.round] || 0) {
              const newDate = new Date(day.date)
              newDate.setDate(newDate.getDate() + postponementSlot.daysToShift)
              scheduleCopy[i].date = newDate
            }
          }
        }
      }
    }
  
    // Ensure proper round ordering
    ensureProperRoundOrdering(scheduleCopy)
  
    return {
      matches: matchesCopy,
      schedule: scheduleCopy,
    }
  }
  
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
  function findPostponementSlot(match, matches, schedule, teams, options) {
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
            const dateStr = new Date(day.date).toISOString().split("T")[0]
            occupiedDates.add(dateStr)
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
        const dayDate = new Date(day.date)
        if (!currentRoundLastDay || dayDate > currentRoundLastDay) {
          currentRoundLastDay = dayDate
        }
      }
      if (!day.isRestDay && day.round === nextRound) {
        const dayDate = new Date(day.date)
        if (!nextRoundFirstDay || dayDate < nextRoundFirstDay) {
          nextRoundFirstDay = dayDate
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
    const lastDay = new Date(Math.max(...schedule.map((day) => new Date(day.date).getTime())))
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
  
  /**
   * Ensure proper round ordering in the schedule
   * (e.g., quarterfinals before semifinals)
   *
   * @param {Array} schedule - Tournament schedule
   */
  function ensureProperRoundOrdering(schedule) {
    const roundOrder = {
      "Round of 128": 1,
      "Round of 64": 2,
      "Round of 32": 3,
      "Round of 16": 4,
      Quarterfinals: 5,
      Semifinals: 6,
      Final: 7,
    }
  
    // Group days by round
    const roundDays = {}
  
    schedule.forEach((day) => {
      if (!day.isRestDay) {
        let roundName = day.round
        if (roundName.includes("(Postponed)")) {
          roundName = roundName.replace(" (Postponed)", "")
        }
  
        const roundIndex = roundOrder[roundName] || 0
        if (roundIndex > 0) {
          if (!roundDays[roundIndex]) {
            roundDays[roundIndex] = []
          }
          roundDays[roundIndex].push(day)
        }
      }
    })
  
    // Check if rounds are in order
    let lastRoundEndDate = null
  
    for (let i = 1; i <= 7; i++) {
      if (roundDays[i] && roundDays[i].length > 0) {
        // Sort days within this round
        roundDays[i].sort((a, b) => new Date(a.date) - new Date(b.date))
  
        const earliestDayInRound = roundDays[i][0]
        const latestDayInRound = roundDays[i][roundDays[i].length - 1]
  
        // If this round starts before the previous round ended, adjust dates
        if (lastRoundEndDate && new Date(earliestDayInRound.date) < lastRoundEndDate) {
          const daysToShift =
            Math.ceil((lastRoundEndDate - new Date(earliestDayInRound.date)) / (24 * 60 * 60 * 1000)) + 1
  
          // Shift all days in this round
          roundDays[i].forEach((day) => {
            const newDate = new Date(day.date)
            newDate.setDate(newDate.getDate() + daysToShift)
            day.date = newDate
          })
  
          // Update latest day in round after shifting
          latestDayInRound.date = new Date(latestDayInRound.date)
          latestDayInRound.date.setDate(latestDayInRound.date.getDate() + daysToShift)
        }
  
        lastRoundEndDate = new Date(latestDayInRound.date)
      }
    }
  }
  