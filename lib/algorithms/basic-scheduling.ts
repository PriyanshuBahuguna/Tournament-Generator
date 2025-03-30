import type { Match } from "../types"

export function assignVenuesBasic(matches: Match[]) {
  matches.forEach((match, index) => {
    match.venue = (index % 2) + 1
  })

  return matches
}

