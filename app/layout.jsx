import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Tournament Bracket Generator",
  description: "Create and manage tournament brackets with advanced algorithms",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>{/* Add any additional head elements here */}</head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'