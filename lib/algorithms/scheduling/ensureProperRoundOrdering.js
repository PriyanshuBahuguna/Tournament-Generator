/**
 * Ensure proper round ordering in the schedule
 * (e.g., quarterfinals before semifinals)
 *
 * @param {Array} schedule - Tournament schedule
 */
export function ensureProperRoundOrdering(schedule) {
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
  