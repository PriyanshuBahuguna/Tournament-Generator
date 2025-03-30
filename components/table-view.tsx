"use client"

import { useMemo } from "react"
import type { Match, Team } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TableViewProps {
  matches: Match[]
  teams: Team[]
  onMatchResult: (matchId: string, winnerId: number) => void
}

export default function TableView({ matches, teams, onMatchResult }: TableViewProps) {
  // Sort matches by round and match number
  const sortedMatches = useMemo(() => {
    const roundOrder = {
      "Round 1": 1,
      Quarterfinals: 2,
      Semifinals: 3,
      Final: 4,
    }

    return [...matches].sort((a, b) => {
      const roundDiff = roundOrder[a.round as keyof typeof roundOrder] - roundOrder[b.round as keyof typeof roundOrder]
      if (roundDiff !== 0) return roundDiff
      return a.matchNumber - b.matchNumber
    })
  }, [matches])

  const getTeamName = (teamId: number | null) => {
    if (!teamId) return "TBD"
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Unknown Team"
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Match</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Team 1</TableHead>
            <TableHead>Team 2</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="font-medium">{match.matchNumber}</TableCell>
              <TableCell>{match.round}</TableCell>
              <TableCell
                className={
                  match.status === "completed"
                    ? match.winnerId === match.team1Id
                      ? "font-bold text-green-500"
                      : match.team1Id
                        ? "text-red-500"
                        : ""
                    : ""
                }
              >
                {getTeamName(match.team1Id)}
                {match.winnerId === match.team1Id && (
                  <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-500 border-green-500">
                    Winner
                  </Badge>
                )}
              </TableCell>
              <TableCell
                className={
                  match.status === "completed"
                    ? match.winnerId === match.team2Id
                      ? "font-bold text-green-500"
                      : match.team2Id
                        ? "text-red-500"
                        : ""
                    : ""
                }
              >
                {getTeamName(match.team2Id)}
                {match.winnerId === match.team2Id && (
                  <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-500 border-green-500">
                    Winner
                  </Badge>
                )}
              </TableCell>
              <TableCell>Venue {match.venue}</TableCell>
              <TableCell>
                <Badge variant={match.status === "completed" ? "default" : "secondary"}>
                  {match.status === "completed" ? "Completed" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell>
                {match.status !== "completed" && match.team1Id && match.team2Id && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onMatchResult(match.id, match.team1Id!)}>
                      {getTeamName(match.team1Id)} wins
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onMatchResult(match.id, match.team2Id!)}>
                      {getTeamName(match.team2Id)} wins
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

