import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Navigation from "@/components/Navigation"
import "./globals.css"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "NPCraftin",
  description: "Your source for Roblox scripts and executors",
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] via-[#16001e] to-[#0a0012]">
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
            </Suspense>
            <main>{children}</main>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
