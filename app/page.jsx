import { Suspense } from "react"
import TournamentSetup from "@/components/tournament-setup"
import LoadingSpinner from "@/components/unrelated/loading-spinner"
import Logo from "@/components/unrelated/logo"

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "black", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Logo />
        </div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}>
          Tournament Bracket Generator
        </h1>
        <Suspense fallback={<LoadingSpinner />}>
          <TournamentSetup />
        </Suspense>
      </div>
    </main>
  )
}

