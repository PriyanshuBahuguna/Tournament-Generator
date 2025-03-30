import { Suspense } from "react"
import TournamentSetup from "@/components/tournament-setup"
import LoadingSpinner from "@/components/loading-spinner"
import Logo from "@/components/logo"
import AboutUs from "@/components/about-us"

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <AboutUs />
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">Tournament Bracket Generator</h1>
        <Suspense fallback={<LoadingSpinner />}>
          <TournamentSetup />
        </Suspense>
      </div>
    </main>
  )
}

