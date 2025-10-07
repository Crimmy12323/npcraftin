"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Youtube, Code, Gamepad2 } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutMe() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#1a1a24] border-gray-800">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NPCraftin</h1>
              <p className="text-xl text-purple-400 mb-2">Content Creator & Roblox Exploiter</p>
              <p className="text-gray-400">Sharing scripts, executors, and gaming content</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
                <Youtube className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">YouTube Creator</h3>
                <p className="text-sm text-gray-400">Roblox videos & tutorials</p>
              </div>
              <div className="text-center p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
                <Code className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Best Showcaser</h3>
                <p className="text-sm text-gray-400">Very good showcaser and very sigma!</p>
              </div>
              <div className="text-center p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
                <Gamepad2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-white font-semibold mb-1">Script & Executor Expert</h3>
                <p className="text-sm text-gray-400">Reviews & guides</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Welcome to my website! Here you'll find the latest Roblox executors, scripts, and content from my
                YouTube channel. I'm passionate about creating helpful content for the Roblox community.
              </p>

              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                <a href="https://e-z.bio/npc" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Visit My Bio
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
