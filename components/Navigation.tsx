"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gamepad2, FileCode, User, LogOut, LogIn, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import AdminLogin from "./AdminLogin"

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Executors",
    url: "/executors",
    icon: Gamepad2,
  },
  {
    title: "Scripts",
    url: "/scripts",
    icon: FileCode,
  },
  {
    title: "About me",
    url: "/about",
    icon: User,
  },
]

export default function Navigation() {
  const pathname = usePathname()
  const [showLogin, setShowLogin] = useState(false)
  const { isAdmin, logout } = useAuth()

  return (
    <>
      <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/images/design-mode/image.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </Link>

              {/* Navigation Tabs */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.title}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a
                href="https://elysiumproducts.net"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-all"
              >
                <span className="hidden sm:inline">Elysium Products</span>
              </a>

              <a
                href="https://discord.gg/Nzy9gzSFYM"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Join Discord</span>
              </a>

              {isAdmin ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.url
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Admin Login Dialog */}
      <AdminLogin open={showLogin} onOpenChange={setShowLogin} />
    </>
  )
}
