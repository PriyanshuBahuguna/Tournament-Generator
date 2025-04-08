"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, Copy, FileImage, FileIcon as FilePdf, AlertCircle } from "lucide-react"
import { generateTournament } from "@/lib/tournament-generator"
import { exportAsImage, exportAsPDF } from "@/lib/export-utils"
import TableView from "@/components/table-view"
import Script from "next/script"

export default function FixtureDisplay({ teams, options, rankingType, onBack }) {
  const [matches, setMatches] = useState([])
  const [algorithmInsights, setAlgorithmInsights] = useState([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState(null)
  const fixtureRef = useRef(null)
  const [librariesLoaded, setLibrariesLoaded] = useState({
    html2canvas: false,
    jspdf: false,
  })

  useEffect(() => {
    // Simulate algorithm execution time
    const timer = setTimeout(() => {
      try {
        // Validate teams array
        if (!Array.isArray(teams) || teams.length === 0) {
          throw new Error("No teams provided for tournament generation")
        }

        // Check if all teams have an id
        const invalidTeams = teams.filter((team) => !team || team.id === undefined)
        if (invalidTeams.length > 0) {
          throw new Error("Some teams are missing required id property")
        }

        const { matches, insights } = generateTournament(teams, options, rankingType)
        setMatches(matches)
        setAlgorithmInsights(insights)
        setError(null)
      } catch (err) {
        console.error("Error generating tournament:", err)
        setError(err.message || "Failed to generate tournament fixture")
        setMatches([])
        setAlgorithmInsights(["Error: Tournament generation failed"])
      } finally {
        setIsGenerating(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [teams, options, rankingType])

  function handleMatchResult(matchId, winnerId) {
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

  function copyToClipboard() {
    const textData = matches
      .map(
        (match) =>
          `Match ${match.id}: ${teams.find((t) => t?.id === match.team1Id)?.name || "TBD"} vs ${
            teams.find((t) => t?.id === match.team2Id)?.name || "TBD"
          } (${match.round}, Venue: ${match.venue})`,
      )
      .join("\n")

    navigator.clipboard
      .writeText(textData)
      .then(() => alert("Fixture copied to clipboard"))
      .catch((err) => console.error("Failed to copy: ", err))
  }

  function handleExportAsImage() {
    if (!librariesLoaded.html2canvas) {
      alert("Export library is still loading. Please try again in a moment.")
      return
    }

    if (fixtureRef.current) {
      exportAsImage(fixtureRef.current, `tournament-fixture-${new Date().toISOString().slice(0, 10)}.png`)
    }
  }

  function handleExportAsPDF() {
    if (!librariesLoaded.html2canvas || !librariesLoaded.jspdf) {
      alert("Export libraries are still loading. Please try again in a moment.")
      return
    }

    if (fixtureRef.current) {
      exportAsPDF(fixtureRef.current, `tournament-fixture-${new Date().toISOString().slice(0, 10)}.pdf`)
    }
  }

  function handleLibraryLoad(library) {
    setLibrariesLoaded((prev) => ({
      ...prev,
      [library]: true,
    }))
  }

  return (
    <>
      {/* Load required libraries */}
      <Script
        src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"
        onLoad={() => handleLibraryLoad("html2canvas")}
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        onLoad={() => handleLibraryLoad("jspdf")}
        strategy="lazyOnload"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{ width: "100%" }}
      >
        <div
          ref={fixtureRef}
          style={{
            width: "100%",
            maxWidth: "72rem",
            margin: "0 auto",
            backgroundColor: "#080808",
            borderRadius: "0.5rem",
            border: "1px solid #333",
          }}
        >
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #333" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                "@media(minWidth: 768px)": {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.25rem" }}>Tournament Fixture</h2>
                <p style={{ fontSize: "0.875rem", color: "#999" }}>
                  {isGenerating
                    ? "Generating fixture..."
                    : error
                      ? "Error generating fixture"
                      : `${teams.length} teams, Knockout format`}
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {algorithmInsights.map((insight, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      border: "1px solid #333",
                      backgroundColor: insight.includes("Error")
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                      color: insight.includes("Error") ? "#ef4444" : "white",
                    }}
                  >
                    {insight}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {isGenerating ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5rem 0",
                }}
              >
                <div
                  style={{
                    width: "4rem",
                    height: "4rem",
                    borderRadius: "50%",
                    border: "4px solid white",
                    borderTopColor: "transparent",
                    animation: "spin 1s linear infinite",
                    marginBottom: "1rem",
                  }}
                ></div>
                <p style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                  Generating Tournament Fixture
                </p>
                <p style={{ fontSize: "0.875rem", color: "#999" }}>Applying random seeding algorithm...</p>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: "1.5rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <AlertCircle size={48} color="#ef4444" />
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "500", marginBottom: "0.5rem", color: "#ef4444" }}>
                    Error Generating Tournament
                  </h3>
                  <p style={{ color: "#999" }}>{error}</p>
                </div>
                <button
                  onClick={onBack}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "transparent",
                    color: "white",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "1px solid #333",
                    marginTop: "1rem",
                  }}
                >
                  <ChevronLeft size={16} />
                  Back to Setup
                </button>
              </div>
            ) : (
              <>
                {options.tournamentType !== "knockout" ? (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "0.5rem",
                      border: "1px solid #333",
                    }}
                  >
                    <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Feature Not Available</h3>
                    <p>
                      {options.tournamentType === "roundRobin"
                        ? "Round Robin tournaments are not implemented yet."
                        : "Hybrid Fixture tournaments are not implemented yet."}
                    </p>
                  </div>
                ) : matches.length > 0 ? (
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #333",
                    }}
                  >
                    <TableView matches={matches} teams={teams} onMatchResult={handleMatchResult} />
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "0.5rem",
                      border: "1px solid #333",
                      textAlign: "center",
                    }}
                  >
                    <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>No Matches Generated</h3>
                    <p>Unable to generate tournament matches. Please try again with different settings.</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              borderTop: "1px solid #333",
              "@media(minWidth: 640px)": {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            }}
          >
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "transparent",
                color: "white",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer",
                border: "1px solid #333",
                width: "100%",
                "@media(minWidth: 640px)": { width: "auto" },
              }}
            >
              <ChevronLeft size={16} />
              Back to Customization
            </button>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                width: "100%",
                "@media(minWidth: 640px)": {
                  flexDirection: "row",
                  width: "auto",
                },
              }}
            >
              <button
                onClick={copyToClipboard}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "white",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  cursor: isGenerating || matches.length === 0 ? "not-allowed" : "pointer",
                  border: "1px solid #333",
                  opacity: isGenerating || matches.length === 0 ? "0.5" : "1",
                }}
                disabled={isGenerating || matches.length === 0}
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>

              <button
                onClick={handleExportAsImage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "white",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  cursor:
                    isGenerating || matches.length === 0 || !librariesLoaded.html2canvas ? "not-allowed" : "pointer",
                  border: "1px solid #333",
                  opacity: isGenerating || matches.length === 0 || !librariesLoaded.html2canvas ? "0.5" : "1",
                }}
                disabled={isGenerating || matches.length === 0 || !librariesLoaded.html2canvas}
              >
                <FileImage size={16} />
                Export as Image
              </button>

              <button
                onClick={handleExportAsPDF}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "white",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  cursor:
                    isGenerating || matches.length === 0 || !librariesLoaded.html2canvas || !librariesLoaded.jspdf
                      ? "not-allowed"
                      : "pointer",
                  border: "1px solid #333",
                  opacity:
                    isGenerating || matches.length === 0 || !librariesLoaded.html2canvas || !librariesLoaded.jspdf
                      ? "0.5"
                      : "1",
                }}
                disabled={
                  isGenerating || matches.length === 0 || !librariesLoaded.html2canvas || !librariesLoaded.jspdf
                }
              >
                <FilePdf size={16} />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

