export interface Team {
  id: number
  name: string
  ranking: number
}

export interface TournamentOptions {
  tournamentType: "knockout" | "roundRobin" | "hybridFixture"
  seedingMethod: "random" | "mergeSort" | "quickSort"
  schedulingMethod: "basic" | "graphColoring" | "hamiltonianPath"
  numVenues: number
  avoidTopTeamClashes: boolean
  enableDynamicReseeding: boolean

  // Scheduling options
  startDate?: Date
  endDate?: Date
  maxMatchesPerDay?: number
  matchesPerPair?: number
}

export interface Match {
  id: string
  matchNumber: number
  round: string
  team1Id: number | null
  team2Id: number | null
  venue: number
  status: "pending" | "completed"
  winnerId?: number | null
  nextMatchId?: string
  scheduledDate?: Date
  position: "top" | "bottom" | "none"
}

export interface TournamentSchedule {
  startDate: Date
  endDate: Date
  matchDays: Date[]
  restDays: Date[]
  roundDates: { [round: string]: Date[] }
}

