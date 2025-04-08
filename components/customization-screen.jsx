"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Info, Ban } from "lucide-react"

export default function CustomizationScreen({
  teams,
  tournamentType,
  rankingType,
  options,
  setOptions,
  onBack,
  setStep,
}) {
  function handleOptionChange(key, value) {
    setOptions({ ...options, [key]: value })
  }

  function generateFixture() {
    setStep("display")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ 
        width: "100%", 
        maxWidth: "64rem", 
        margin: "0 auto", 
        backgroundColor: "#080808", 
        borderRadius: "0.5rem",
        border: "1px solid #333"
      }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #333" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Customize Tournament</div>
          <div style={{ fontSize: "0.875rem", color: "#999" }}>Configure how the tournament fixture is generated</div>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {tournamentType !== "knockout" && (
            <div style={{ 
              padding: "1rem", 
              backgroundColor: "rgba(255, 255, 255, 0.05)", 
              borderRadius: "0.5rem", 
              border: "1px solid #333" 
            }}>
              <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Feature Not Available</h3>
              <p>
                {tournamentType === "roundRobin"
                  ? "Round Robin tournaments are not implemented yet."
                  : "Hybrid Fixture tournaments are not implemented yet."}
                Please select Knockout tournament type.
              </p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: "1.125rem", fontWeight: "500" }}>Knockout Tournament Options</label>
              <button 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "2.5rem",
                  height: "2.5rem"
                }}
                title="Knockout Tournament Info"
              >
                <Info size={16} color="#999" />
              </button>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr", 
              gap: "1.5rem",
              "@media(minWidth: 768px)": { gridTemplateColumns: "1fr 1fr" }
            }}>
              <div>
                <label 
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }} 
                  htmlFor="seedingMethod"
                >
                  Seeding Method
                </label>
                <select 
                  id="seedingMethod" 
                  value={options.seedingMethod} 
                  onChange={(e) => handleOptionChange("seedingMethod", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    backgroundColor: "#111",
                    border: "1px solid #333",
                    borderRadius: "0.375rem",
                    color: "white"
                  }}
                >
                  <option value="random">Random Seeding</option>
                  <option value="mergeSort">Ranked Seeding (Merge Sort)</option>
                  <option value="quickSort">Ranked Seeding (Quick Sort)</option>
                </select>
                <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem" }}>
                  Choose how teams are seeded in the tournament
                </p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.5rem" }}>
                  <input 
                    id="avoidTopTeamClashes" 
                    type="checkbox" 
                    checked={options.avoidTopTeamClashes} 
                    onChange={(e) => handleOptionChange("avoidTopTeamClashes", e.target.checked)} 
                    disabled={false}
                    style={{ cursor: "pointer" }}
                  />
                  <label 
                    htmlFor="avoidTopTeamClashes" 
                    style={{ 
                      color: "white", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem",
                      cursor: "pointer"
                    }}
                    title="Avoid early matches between top-ranked teams"
                  >
                    Avoid early top-team clashes
                  </label>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                  Places top-ranked teams in different parts of the bracket
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ fontSize: "1.125rem", fontWeight: "500" }}>Venue Options</label>
                <button 
                  style={{ 
                    background: "none", 
                    border: "none", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    width: "2.5rem",
                    height: "2.5rem"
                  }}
                  title="Scheduling Methods Info"
                >
                  <Info size={16} color="#999" />
                </button>
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr", 
                gap: "1.5rem",
                "@media(minWidth: 768px)": { gridTemplateColumns: "1fr 1fr" }
              }}>
                <div>
                  <label 
                    style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }} 
                    htmlFor="schedulingMethod"
                  >
                    Scheduling Method
                  </label>
                  <select 
                    id="schedulingMethod" 
                    value={options.schedulingMethod} 
                    onChange={(e) => handleOptionChange("schedulingMethod", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "0.375rem",
                      color: "white"
                    }}
                  >
                    <option value="basic">Basic Scheduling</option>
                    <option value="graphColoring" disabled style={{ color: "#999" }}>
                      Graph Coloring
                    </option>
                    <option value="hamiltonianPath" disabled style={{ color: "#999" }}>
                      Hamiltonian Path
                    </option>
                  </select>
                  <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem" }}>
                    Only Basic Scheduling is available
                  </p>
                </div>

                <div>
                  <label 
                    style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }} 
                    htmlFor="numVenues"
                  >
                    Number of Venues
                  </label>
                  <input 
                    id="numVenues" 
                    type="number" 
                    min="1" 
                    value={options.numVenues} 
                    onChange={(e) => handleOptionChange("numVenues", Number.parseInt(e.target.value) || 1)} 
                    disabled={true}
                    style={{
                      maxWidth: "16rem",
                      padding: "0.5rem",
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      borderRadius: "0.375rem",
                      color: "#999",
                      cursor: "not-allowed"
                    }}
                  />
                  <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem" }}>
                    This feature is not available yet
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: "1.125rem", fontWeight: "500" }}>Dynamic Updates</label>
              <button 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "2.5rem",
                  height: "2.5rem"
                }}
                title="Dynamic Updates Info"
              >
                <Info size={16} color="#999" />
              </button>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input 
                  id="enableDynamicReseeding" 
                  type="checkbox" 
                  checked={options.enableDynamicReseeding} 
                  onChange={(e) => handleOptionChange("enableDynamicReseeding", e.target.checked)} 
                  disabled={true}
                  style={{ cursor: "not-allowed" }}
                />
                <label 
                  htmlFor="enableDynamicReseeding" 
                  style={{ 
                    color: "#999", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem",
                    cursor: "not-allowed"
                  }}
                  title="To be implemented in future updates"
                >
                  Enable Dynamic Reseeding
                  <Ban size={16} color="#ef4444" />
                </label>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#999", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                Automatically adjust brackets when teams withdraw
              </p>
            </div>
          </div>
        </div>
        <div style={{
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #333"
        }}>
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
              border: "1px solid #333"
            }}
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            onClick={generateFixture}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              color: "black",
              borderRadius: "0.375rem",
              fontWeight: "500",
              cursor: tournamentType !== "knockout" ? "not-allowed" : "pointer",
              border: "none",
              opacity: tournamentType !== "knockout" ? "0.5" : "1"
            }}
            disabled={tournamentType !== "knockout"}
          >
            Generate Fixture
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

