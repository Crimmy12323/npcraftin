"use client"
import { useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Lock } from "lucide-react"

interface AdminLoginProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AdminLogin({ open, onOpenChange }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(username, password)
    if (success) {
      onOpenChange(false)
      setUsername("")
      setPassword("")
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/50 backdrop-blur-2xl border border-white/20 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-purple-400" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-200">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/40 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/40 backdrop-blur-sm border-white/30 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
              placeholder="Enter password"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
