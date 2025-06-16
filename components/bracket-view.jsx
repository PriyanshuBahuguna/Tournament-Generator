"use client"

import { useMemo, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function BracketView({ matches, teams, onMatchResult, postponedMatches }) {

  const roundMatches = useMemo(() => {
    const grouped = {}

    matches.forEach((match) => {
      if (!grouped[match.round]) {
        grouped[match.round] = []
      }
      grouped[match.round].push(match)
    })

    const roundOrder = {
      "Playoff Final": 100,
      Final: 100,
      "Playoff Semifinals": 90,
      Semifinals: 90,
      "Playoff Quarterfinals": 80,
      Quarterfinals: 80,
    }

    for (let i = 16; i <= 128; i *= 2) {
      roundOrder[`Round of ${i}`] = 70 - Math.log2(i)
      roundOrder[`Playoff Round of ${i}`] = 70 - Math.log2(i)
    }

    return Object.keys(grouped)
      .sort((a, b) => {
        const orderA = roundOrder[a] || 0
        const orderB = roundOrder[b] || 0
        return orderA - orderB
      })
      .map((round) => ({
        name: round,
        matches: grouped[round].sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0)),
      }))
  }, [matches])

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [viewMode, setViewMode] = useState("all")

  const availableViewModes = useMemo(() => {
    const modes = ["custom", "all"]

    const hasSemifinals = roundMatches.some((r) => r.name === "Semifinals" || r.name === "Playoff Semifinals")

    const hasQuarterfinals = roundMatches.some((r) => r.name === "Quarterfinals" || r.name === "Playoff Quarterfinals")

    if (hasSemifinals) {
      modes.push("semifinals")
    }

    modes.push("final")

    return modes
  }, [roundMatches])

  useEffect(() => {
    if (availableViewModes.includes(viewMode)) {
      return
    }

    setViewMode(availableViewModes[1] || "all")
  }, [availableViewModes, viewMode])

  const displayRounds = useMemo(() => {
    if (viewMode === "all") {
      if (roundMatches.length > 4) {
        return roundMatches.slice(-3)
      }
      return roundMatches
    } else if (viewMode === "final") {
      return roundMatches.filter((r) => r.name === "Final" || r.name === "Playoff Final")
    } else if (viewMode === "semifinals") {
      return roundMatches.filter(
        (r) =>
          r.name === "Semifinals" ||
          r.name === "Final" ||
          r.name === "Playoff Semifinals" ||
          r.name === "Playoff Final",
      )
    } else {
      return currentRoundIndex < roundMatches.length ? [roundMatches[currentRoundIndex]] : []
    }
  }, [roundMatches, viewMode, currentRoundIndex])

  const getTeamName = (teamId) => {
    if (!teamId) return "TBD"
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Unknown Team"
  }

  const hasCompletableMatches = matches.some((m) => m.status !== "completed" && m.team1Id && m.team2Id)

  const navigateRound = (direction) => {
    if (direction === "prev" && currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1)
    } else if (direction === "next" && currentRoundIndex < roundMatches.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1)
    }
  }

  const getDisplayName = (viewMode) => {
    switch (viewMode) {
      case "all":
        return roundMatches.length > 3 ? "All Rounds" : "All Rounds"
      case "semifinals":
        return "Semifinals & Final"
      case "final":
        return "Final Only"
      case "custom":
        return "Custom View"
      default:
        return viewMode
    }
  }

  return (
    <div className="flex flex-col items-center bracket-container pdf-content">
      {hasCompletableMatches && (
        <div className="mb-4 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
          Click on a team name to mark them as the winner of their match
        </div>
      )}

      <div className="tabs w-full mb-4">
        <div
          className="tabs-list grid w-full"
          style={{ gridTemplateColumns: `repeat(${availableViewModes.length}, minmax(0, 1fr))` }}
        >
          {availableViewModes.map((mode) => (
            <button
              key={mode}
              className={`tab-trigger ${viewMode === mode ? "active" : ""}`}
              onClick={() => {
                setViewMode(mode)
                if (mode === "custom" && viewMode !== "custom") {
                  setCurrentRoundIndex(0)
                }
              }}
              style={{
                padding: "0.5rem",
                backgroundColor: viewMode === mode ? "#333" : "transparent",
                color: viewMode === mode ? "white" : "#999",
                border: "1px solid #333",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
            >
              {getDisplayName(mode)}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "custom" && (
        <div className="flex items-center justify-center mb-4 space-x-4">
          <button
            onClick={() => navigateRound("prev")}
            disabled={currentRoundIndex === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "0.25rem",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#333",
              cursor: currentRoundIndex === 0 ? "not-allowed" : "pointer",
              opacity: currentRoundIndex === 0 ? "0.5" : "1",
            }}
          >
            <ChevronLeft size={16} />
            Previous Round
          </button>
          <span className="font-medium">{roundMatches[currentRoundIndex]?.name.replace("Playoff ", "")}</span>
          <button
            onClick={() => navigateRound("next")}
            disabled={currentRoundIndex === roundMatches.length - 1}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "white",
              borderRadius: "0.25rem",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: "#333",
              cursor: currentRoundIndex === roundMatches.length - 1 ? "not-allowed" : "pointer",
              opacity: currentRoundIndex === roundMatches.length - 1 ? "0.5" : "1",
            }}
          >
            Next Round
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <div className="flex justify-center">
        <div className="flex space-x-12 py-8 overflow-x-auto">
          {displayRounds.map((round, roundIndex) => (
            <div key={round.name} className="flex flex-col space-y-6">
              <div
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                {round.name.replace("Playoff ", "")}
              </div>

              {round.matches.map((match, matchIndex) => (
                <div
                  key={match.id}
                  style={{
                    opacity: 0,
                    transform: "translateY(10px)",
                    animation: `fadeIn 0.3s ease-out ${matchIndex * 0.05}s forwards`,
                  }}
                >
                  <div
                    style={{
                      width: "16rem",
                      padding: "0.75rem",
                      position: "relative",
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: match.status === "postponed" ? "#eab308" : "#333",
                      borderRadius: "0.375rem",
                      backgroundColor: "#222",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#999",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Match {match.matchNumber || matchIndex + 1} • Venue {match.venue}
                      {match.status === "postponed" && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.7rem",
                            padding: "0.1rem 0.25rem",
                            borderRadius: "0.25rem",
                            backgroundColor: "rgba(234, 179, 8, 0.1)",
                            color: "#eab308",
                          }}
                        >
                          Postponed
                        </span>
                      )}
                      {match.status === "postponed" && postponedMatches[match.id] && (
                        <div
                          style={{
                            marginTop: "0.25rem",
                            fontSize: "0.7rem",
                            padding: "0.1rem 0.25rem",
                            borderRadius: "0.25rem",
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                          }}
                        >
                          Rescheduled: {postponedMatches[match.id]}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.5rem",
                        borderRadius: "0.25rem 0.25rem 0 0",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        backgroundColor:
                          match.status === "completed"
                            ? match.winnerId === match.team1Id
                              ? "rgba(16, 185, 129, 0.2)"
                              : match.team1Id
                                ? "rgba(239, 68, 68, 0.2)"
                                : "transparent"
                            : "transparent",
                        color:
                          match.status === "completed"
                            ? match.winnerId === match.team1Id
                              ? "#10b981"
                              : match.team1Id
                                ? "#ef4444"
                                : "white"
                            : "white",
                      }}
                      onClick={() => match.team1Id && match.team2Id && onMatchResult(match.id, match.team1Id)}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "10rem",
                        }}
                      >
                        {getTeamName(match.team1Id)}
                      </div>

                      {match.status === "completed" && match.winnerId === match.team1Id && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "#10b981",
                          }}
                        >
                          Winner
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #333",
                        margin: "0.25rem 0",
                      }}
                    ></div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.5rem",
                        borderRadius: "0 0 0.25rem 0.25rem",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        backgroundColor:
                          match.status === "completed"
                            ? match.winnerId === match.team2Id
                              ? "rgba(16, 185, 129, 0.2)"
                              : match.team2Id
                                ? "rgba(239, 68, 68, 0.2)"
                                : "transparent"
                            : "transparent",
                        color:
                          match.status === "completed"
                            ? match.winnerId === match.team2Id
                              ? "#10b981"
                              : match.team2Id
                                ? "#ef4444"
                                : "white"
                            : "white",
                      }}
                      onClick={() => match.team1Id && match.team2Id && onMatchResult(match.id, match.team2Id)}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "10rem",
                        }}
                      >
                        {getTeamName(match.team2Id)}
                      </div>

                      {match.status === "completed" && match.winnerId === match.team2Id && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            color: "#10b981",
                          }}
                        >
                          Winner
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
