"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CustomizationScreen from "@/components/customization-screen"
import FixtureDisplay from "@/components/fixture-display"
import { AlertCircle, HelpCircle, Ban, Upload, RefreshCw, ChevronRight } from "lucide-react"

const VALID_TEAM_COUNTS = [2, 4, 8, 16, 32, 64, 128]

export default function TournamentSetup() {
  const [step, setStep] = useState("setup")
  const [numTeams, setNumTeams] = useState(8)
  const [teams, setTeams] = useState([])
  const [tournamentType, setTournamentType] = useState("knockout")
  const [teamEntryMethod, setTeamEntryMethod] = useState("manual")
  const [rankingType, setRankingType] = useState("higherBetter")
  const [error, setError] = useState(null)
  // Add options state
  const [options, setOptions] = useState({
    tournamentType: "knockout",
    seedingMethod: "random",
    schedulingMethod: "basic",
    numVenues: 1,
    avoidTopTeamClashes: false,
    enableDynamicReseeding: false,
    maxMatchesPerDay: 4,
  })

  useEffect(() => {
    generateEmptyTeams(numTeams)
  }, [])

  function generateEmptyTeams(count) {
    const newTeams = Array(count)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        name: `Team ${i + 1}`,
        ranking: 0,
      }))
    setTeams(newTeams)
  }

  function handleNumTeamsChange(value) {
    const teamCount = Number.parseInt(value)
    if (VALID_TEAM_COUNTS.includes(teamCount)) {
      setNumTeams(teamCount)
      setError(null)
      if (teamEntryMethod === "manual") {
        generateEmptyTeams(teamCount)
      }
    } else {
      setError("Please select a valid number of teams (powers of 2: 2, 4, 8, 16, 32, 64, 128)")
    }
  }

  function handleTeamChange(index, field, value) {
    const newTeams = [...teams]
    if (field === "name") {
      newTeams[index].name = value
    } else {
      newTeams[index].ranking = Number.parseInt(value) || 0
    }
    setTeams(newTeams)
  }

  function generateRandomTeams() {
    const randomTeams = Array(numTeams)
      .fill(null)
      .map((_, i) => {
        let ranking
        if (rankingType === "higherBetter") {
          ranking = Math.floor(Math.random() * 1000) + 1000
        } else {
          ranking = i + 1
        }
        return { id: i + 1, name: `Team ${i + 1}`, ranking }
      })
    setTeams(randomTeams)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result
        const lines = content.split("\n")
        const uploadedTeams = lines
          .map((line, index) => {
            const [name, rankingStr] = line.split(",")
            return {
              id: index + 1, // Ensure each team has a unique ID
              name: name?.trim() || `Team ${index + 1}`,
              ranking: Number.parseInt(rankingStr?.trim() || "0") || 0,
            }
          })
          .slice(0, numTeams)
        if (uploadedTeams.length !== numTeams) {
          setError(`Your file contains ${uploadedTeams.length} teams, but you need exactly ${numTeams} teams.`)
          return
        }
        setTeams(uploadedTeams)
        setError(null)
      }
      reader.readAsText(file)
    }
  }

  function proceedToCustomization() {
    if (teams.length < 2) {
      setError("You need at least 2 teams to create a tournament")
      return
    }
    if (teams.length !== numTeams) {
      setError(`You need exactly ${numTeams} teams for this tournament`)
      return
    }

    // Validate that all teams have an ID
    const invalidTeams = teams.filter((team) => !team || team.id === undefined)
    if (invalidTeams.length > 0) {
      setError("Some teams are missing required ID. Please regenerate teams or fix the data.")
      return
    }

    if (teamEntryMethod === "manual" && teams.some((team) => !team.name)) {
      setError("All teams must have a name")
      return
    }

    setOptions((prev) => ({ ...prev, tournamentType })) // Sync tournamentType
    setStep("customization")
    setError(null)
  }

  return (
    <AnimatePresence mode="wait">
      {step === "setup" && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "64rem",
              margin: "0 auto",
              backgroundColor: "#080808",
              borderRadius: "0.5rem",
              border: "1px solid #333",
            }}
          >
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #333" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Tournament Setup</div>
              <div style={{ fontSize: "0.875rem", color: "#999" }}>Enter the basic details for your tournament</div>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {error && (
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                      borderRadius: "0.5rem",
                      color: "#ef4444",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <AlertCircle size={16} />
                      <div>{error}</div>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}
                    htmlFor="numTeams"
                  >
                    Number of Teams
                  </label>
                  <select
                    id="numTeams"
                    value={numTeams.toString()}
                    onChange={(e) => handleNumTeamsChange(e.target.value)}
                    style={{
                      maxWidth: "16rem",
                      padding: "0.5rem",
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "0.375rem",
                      color: "white",
                    }}
                  >
                    {VALID_TEAM_COUNTS.map((count) => (
                      <option key={count} value={count.toString()}>
                        {count} teams
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem" }}>
                    Tournament brackets work best with powers of 2 (2, 4, 8, 16, 32, 64, 128)
                  </p>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginRight: "0.5rem" }}>
                      Tournament Type
                    </label>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.25rem",
                        height: "1.25rem",
                      }}
                      title="Tournament Types Info"
                    >
                      <HelpCircle size={16} color="#999" />
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        name="tournamentType"
                        value="knockout"
                        checked={tournamentType === "knockout"}
                        onChange={() => setTournamentType("knockout")}
                      />
                      Knockout
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                      <input type="radio" name="tournamentType" value="roundRobin" disabled />
                      <label style={{ color: "#999" }}>Round Robin</label>
                      <Ban size={16} color="#ef4444" style={{ position: "absolute", left: "-4px", top: "0" }} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", position: "relative" }}>
                      <input type="radio" name="tournamentType" value="hybridFixture" disabled />
                      <label style={{ color: "#999" }}>Hybrid Fixture</label>
                      <Ban size={16} color="#ef4444" style={{ position: "absolute", left: "-4px", top: "0" }} />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                    Ranking Type
                  </label>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        name="rankingType"
                        value="higherBetter"
                        checked={rankingType === "higherBetter"}
                        onChange={() => setRankingType("higherBetter")}
                      />
                      Higher is Better (e.g., 1500, 1400...)
                    </label>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        name="rankingType"
                        value="lowerBetter"
                        checked={rankingType === "lowerBetter"}
                        onChange={() => setRankingType("lowerBetter")}
                      />
                      Lower is Better (e.g., 1, 2, 3...)
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                    Team Entry Method
                  </label>
                  <div style={{ marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: teamEntryMethod === "manual" ? "#111" : "transparent",
                          border: "none",
                          borderBottom: teamEntryMethod === "manual" ? "2px solid white" : "none",
                          color: teamEntryMethod === "manual" ? "white" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => setTeamEntryMethod("manual")}
                      >
                        Manual Entry
                      </button>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: teamEntryMethod === "file" ? "#111" : "transparent",
                          border: "none",
                          borderBottom: teamEntryMethod === "file" ? "2px solid white" : "none",
                          color: teamEntryMethod === "file" ? "white" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => setTeamEntryMethod("file")}
                      >
                        File Upload
                      </button>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: teamEntryMethod === "random" ? "#111" : "transparent",
                          border: "none",
                          borderBottom: teamEntryMethod === "random" ? "2px solid white" : "none",
                          color: teamEntryMethod === "random" ? "white" : "#999",
                          cursor: "pointer",
                        }}
                        onClick={() => setTeamEntryMethod("random")}
                      >
                        Random Generation
                      </button>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      {teamEntryMethod === "manual" && (
                        <div>
                          <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
                            Enter team names and rankings manually
                          </p>
                          <div style={{ maxHeight: "20rem", overflowY: "auto", paddingRight: "0.5rem" }}>
                            <table style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Team Name</th>
                                  <th style={{ textAlign: "left", paddingBottom: "0.5rem" }}>Ranking</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array(numTeams)
                                  .fill(null)
                                  .map((_, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #333" }}>
                                      <td
                                        style={{ paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                                      >
                                        <input
                                          style={{
                                            width: "100%",
                                            padding: "0.5rem",
                                            backgroundColor: "#111",
                                            border: "1px solid #333",
                                            borderRadius: "0.375rem",
                                            color: "white",
                                          }}
                                          placeholder={`Team ${index + 1}`}
                                          value={teams[index]?.name || ""}
                                          onChange={(e) => handleTeamChange(index, "name", e.target.value)}
                                        />
                                      </td>
                                      <td style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}>
                                        <input
                                          style={{
                                            width: "100%",
                                            padding: "0.5rem",
                                            backgroundColor: "#111",
                                            border: "1px solid #333",
                                            borderRadius: "0.375rem",
                                            color: "white",
                                          }}
                                          type="number"
                                          placeholder="0"
                                          value={teams[index]?.ranking || 0}
                                          onChange={(e) => handleTeamChange(index, "ranking", e.target.value)}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {teamEntryMethod === "file" && (
                        <div>
                          <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
                            Upload a CSV file with team names and rankings (format: "Team Name, Ranking")
                          </p>
                          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <label
                              htmlFor="file-upload"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "8rem",
                                border: "2px dashed #333",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                backgroundColor: "#111",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "1.25rem 0 1.5rem",
                                }}
                              >
                                <Upload size={32} style={{ marginBottom: "0.5rem", color: "#999" }} />
                                <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "#999" }}>
                                  <span style={{ fontWeight: "600" }}>Click to upload</span> or drag and drop
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "#999" }}>CSV file with team data</p>
                              </div>
                              <input
                                id="file-upload"
                                type="file"
                                accept=".csv"
                                style={{ display: "none" }}
                                onChange={handleFileUpload}
                              />
                            </label>
                          </div>
                          {teams.length > 0 && (
                            <div style={{ marginTop: "1rem" }}>
                              <p style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Uploaded Teams:</p>
                              <div style={{ maxHeight: "10rem", overflowY: "auto" }}>
                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                  {teams.map((team, index) => (
                                    <li key={index} style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                      {team.name} (Ranking: {team.ranking})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {teamEntryMethod === "random" && (
                        <div>
                          <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
                            Generate random team names and rankings
                          </p>
                          <button
                            onClick={generateRandomTeams}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.5rem 1rem",
                              backgroundColor: "transparent",
                              color: "white",
                              borderRadius: "0.375rem",
                              border: "1px solid #333",
                              cursor: "pointer",
                            }}
                          >
                            <RefreshCw size={16} />
                            Generate Random Teams
                          </button>
                          {teams.length > 0 && (
                            <div style={{ marginTop: "1rem" }}>
                              <p style={{ fontWeight: "500", marginBottom: "0.5rem" }}>Generated Teams:</p>
                              <div
                                style={{
                                  maxHeight: "15rem",
                                  overflowY: "auto",
                                  display: "grid",
                                  gridTemplateColumns: "repeat(2, 1fr)",
                                  gap: "0.5rem",
                                }}
                              >
                                {teams.map((team, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      fontSize: "0.875rem",
                                      padding: "0.5rem",
                                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                                      borderRadius: "0.25rem",
                                    }}
                                  >
                                    {team.name} (Ranking: {team.ranking})
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
                borderTop: "1px solid #333",
              }}
            >
              <button
                onClick={proceedToCustomization}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "0.375rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {step === "customization" && (
        <CustomizationScreen
          teams={teams}
          tournamentType={tournamentType}
          rankingType={rankingType}
          options={options}
          setOptions={setOptions}
          onBack={() => setStep("setup")}
          setStep={setStep}
        />
      )}

      {step === "display" && (
        <FixtureDisplay
          teams={teams}
          options={options}
          rankingType={rankingType}
          onBack={() => setStep("customization")}
        />
      )}
    </AnimatePresence>
  )
}

