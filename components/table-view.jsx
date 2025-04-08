"use client"

import { useMemo } from "react"

export default function TableView({ matches, teams, onMatchResult }) {
  // Sort matches by round and match number
  const sortedMatches = useMemo(() => {
    const roundOrder = {
      "Round 1": 1,
      Quarterfinals: 2,
      Semifinals: 3,
      Final: 4,
    }

    return [...matches].sort((a, b) => {
      const roundDiff = roundOrder[a.round] - roundOrder[b.round]
      if (roundDiff !== 0) return roundDiff
      return a.matchNumber - b.matchNumber
    })
  }, [matches])

  function getTeamName(teamId) {
    if (!teamId) return "TBD"
    const team = teams.find((t) => t && t.id === teamId)
    return team ? team.name : "Unknown Team"
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Match
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Round
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Team 1
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Team 2
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Venue
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Status
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "0.75rem 1rem",
                fontWeight: "500",
                color: "#999",
                borderBottom: "1px solid #333",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMatches.map((match) => (
            <tr key={match.id} style={{ borderBottom: "1px solid #333" }}>
              <td style={{ padding: "0.75rem 1rem", fontWeight: "500" }}>{match.matchNumber}</td>
              <td style={{ padding: "0.75rem 1rem" }}>{match.round}</td>
              <td
                style={{
                  padding: "0.75rem 1rem",
                  fontWeight: match.status === "completed" && match.winnerId === match.team1Id ? "bold" : "normal",
                  color:
                    match.status === "completed"
                      ? match.winnerId === match.team1Id
                        ? "#10b981"
                        : match.team1Id
                          ? "#ef4444"
                          : "white"
                      : "white",
                }}
              >
                {getTeamName(match.team1Id)}
                {match.winnerId === match.team1Id && (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                      border: "1px solid #10b981",
                    }}
                  >
                    Winner
                  </span>
                )}
              </td>
              <td
                style={{
                  padding: "0.75rem 1rem",
                  fontWeight: match.status === "completed" && match.winnerId === match.team2Id ? "bold" : "normal",
                  color:
                    match.status === "completed"
                      ? match.winnerId === match.team2Id
                        ? "#10b981"
                        : match.team2Id
                          ? "#ef4444"
                          : "white"
                      : "white",
                }}
              >
                {getTeamName(match.team2Id)}
                {match.winnerId === match.team2Id && (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      fontSize: "0.75rem",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(16, 185, 129, 0.2)",
                      color: "#10b981",
                      border: "1px solid #10b981",
                    }}
                  >
                    Winner
                  </span>
                )}
              </td>
              <td style={{ padding: "0.75rem 1rem" }}>Venue {match.venue}</td>
              <td style={{ padding: "0.75rem 1rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.75rem",
                    padding: "0.125rem 0.5rem",
                    borderRadius: "9999px",
                    backgroundColor:
                      match.status === "completed" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
                    color: match.status === "completed" ? "white" : "#999",
                    border: "1px solid #333",
                  }}
                >
                  {match.status === "completed" ? "Completed" : "Pending"}
                </span>
              </td>
              <td style={{ padding: "0.75rem 1rem" }}>
                {match.status !== "completed" && match.team1Id && match.team2Id && (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "transparent",
                        color: "white",
                        borderRadius: "0.25rem",
                        border: "1px solid #333",
                        cursor: "pointer",
                      }}
                      onClick={() => onMatchResult(match.id, match.team1Id)}
                    >
                      {getTeamName(match.team1Id)} wins
                    </button>
                    <button
                      style={{
                        fontSize: "0.875rem",
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "transparent",
                        color: "white",
                        borderRadius: "0.25rem",
                        border: "1px solid #333",
                        cursor: "pointer",
                      }}
                      onClick={() => onMatchResult(match.id, match.team2Id)}
                    >
                      {getTeamName(match.team2Id)} wins
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

