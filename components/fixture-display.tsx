"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Copy } from "lucide-react"
import type { Team, TournamentOptions, Match } from "@/lib/types"
import TableView from "@/components/table-view"
import { Badge } from "@/components/ui/badge"
import { generateTournament } from "@/lib/tournament-generator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FixtureDisplayProps {
  teams: Team[]
  options: TournamentOptions
  rankingType: "higherBetter" | "lowerBetter"
  onBack: () => void
}

export default function FixtureDisplay({ teams, options, rankingType, onBack }: FixtureDisplayProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [algorithmInsights, setAlgorithmInsights] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Simulate algorithm execution time
    const timer = setTimeout(() => {
      const { matches, insights } = generateTournament(teams, options, rankingType)
      setMatches(matches)
      setAlgorithmInsights(insights)
      setIsGenerating(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [teams, options, rankingType])

  const handleMatchResult = (matchId: string, winnerId: number) => {
    setMatches((prevMatches) => {
      const updatedMatches = [...prevMatches]

      // Find and update the current match
      const matchIndex = updatedMatches.findIndex((m) => m.id === matchId)
      if (matchIndex >= 0) {
        updatedMatches[matchIndex] = {
          ...updatedMatches[matchIndex],
          winnerId,
          status: "completed",
        }

        // Find the next match where this winner should go
        const currentMatch = updatedMatches[matchIndex]
        const nextMatchId = currentMatch.nextMatchId

        if (nextMatchId) {
          const nextMatchIndex = updatedMatches.findIndex((m) => m.id === nextMatchId)
          if (nextMatchIndex >= 0) {
            // Determine if this winner should be team1 or team2 in the next match
            if (currentMatch.position === "top") {
              updatedMatches[nextMatchIndex] = {
                ...updatedMatches[nextMatchIndex],
                team1Id: winnerId,
              }
            } else {
              updatedMatches[nextMatchIndex] = {
                ...updatedMatches[nextMatchIndex],
                team2Id: winnerId,
              }
            }
          }
        }
      }

      return updatedMatches
    })
  }

  const copyToClipboard = () => {
    const textData = matches
      .map(
        (match) =>
          `Match ${match.id}: ${teams.find((t) => t.id === match.team1Id)?.name || "TBD"} vs ${
            teams.find((t) => t.id === match.team2Id)?.name || "TBD"
          } (${match.round}, Venue: ${match.venue})`,
      )
      .join("\n")

    navigator.clipboard
      .writeText(textData)
      .then(() => alert("Fixture copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Tournament Fixture</CardTitle>
              <CardDescription>
                {isGenerating ? "Generating fixture..." : `${teams.length} teams, Knockout format`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {algorithmInsights.map((insight, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {insight}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Generating Tournament Fixture</p>
              <p className="text-sm text-muted-foreground mt-2">Applying random seeding algorithm...</p>
            </div>
          ) : (
            <>
              {options.tournamentType !== "knockout" ? (
                <Alert>
                  <AlertTitle>Feature Not Available</AlertTitle>
                  <AlertDescription>
                    {options.tournamentType === "roundRobin"
                      ? "Round Robin tournaments are not implemented yet."
                      : "Hybrid Fixture tournaments are not implemented yet."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="bg-card/50 p-4 rounded-lg border">
                  <TableView matches={matches} teams={teams} onMatchResult={handleMatchResult} />
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2 w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4" />
            Back to Customization
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
              disabled={isGenerating || matches.length === 0}
            >
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

