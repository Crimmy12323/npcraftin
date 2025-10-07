"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAdmin: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_USERNAME = "npcraftin"
const ADMIN_PASSWORD_HASH = "6dad9b569619ce0582bc368fb9bedce2f02c0297dc560a09bac5a0731e57cb00"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const adminStatus = sessionStorage.getItem("isAdmin")
    const loginTime = sessionStorage.getItem("loginTime")

    if (adminStatus === "true" && loginTime) {
      const now = Date.now()
      const elapsed = now - Number.parseInt(loginTime)
      if (elapsed < 2 * 60 * 60 * 1000) {
        setIsAdmin(true)
      } else {
        sessionStorage.removeItem("isAdmin")
        sessionStorage.removeItem("loginTime")
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    let passwordToCheck = password
    if (password.length !== 64) {
      // Not a hash, so hash it
      passwordToCheck = await hashPassword(password)
    }

    if (username === ADMIN_USERNAME && passwordToCheck === ADMIN_PASSWORD_HASH) {
      setIsAdmin(true)
      sessionStorage.setItem("isAdmin", "true")
      sessionStorage.setItem("loginTime", Date.now().toString())
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem("isAdmin")
    sessionStorage.removeItem("loginTime")
  }

  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
