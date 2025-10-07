"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Code,
  Edit,
  Trash2,
  Plus,
  Key,
  CreditCard,
  Unlock,
  Search,
  Loader2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gift,
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Scripts() {
  const { isAdmin } = useAuth()
  const [scripts, setScripts] = useState<any[]>([])
  const [editingScript, setEditingScript] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchScripts()
  }, [])

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase.from("scripts").select("*").order("position", { ascending: true })

      if (error) throw error
      setScripts(data || [])
    } catch (error) {
      console.error("[v0] Error fetching scripts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = scripts.findIndex((s) => s.id === id)
    if (currentIndex === -1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= scripts.length) return

    const currentScript = scripts[currentIndex]
    const targetScript = scripts[targetIndex]

    try {
      await supabase.from("scripts").update({ position: targetScript.position }).eq("id", currentScript.id)
      await supabase.from("scripts").update({ position: currentScript.position }).eq("id", targetScript.id)

      const newScripts = [...scripts]
      newScripts[currentIndex] = { ...currentScript, position: targetScript.position }
      newScripts[targetIndex] = { ...targetScript, position: currentScript.position }
      newScripts.sort((a, b) => a.position - b.position)
      setScripts(newScripts)
    } catch (error) {
      console.error("[v0] Error reordering scripts:", error)
    }
  }

  const handleReorderHorizontal = async (id: string, direction: "left" | "right") => {
    const currentIndex = scripts.findIndex((s) => s.id === id)
    if (currentIndex === -1) return

    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= scripts.length) return

    const currentScript = scripts[currentIndex]
    const targetScript = scripts[targetIndex]

    try {
      await supabase.from("scripts").update({ position: targetScript.position }).eq("id", currentScript.id)
      await supabase.from("scripts").update({ position: currentScript.position }).eq("id", targetScript.id)

      const newScripts = [...scripts]
      newScripts[currentIndex] = { ...currentScript, position: targetScript.position }
      newScripts[targetIndex] = { ...targetScript, position: currentScript.position }
      newScripts.sort((a, b) => a.position - b.position)
      setScripts(newScripts)
    } catch (error) {
      console.error("[v0] Error reordering scripts:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("scripts").delete().eq("id", id)

      if (error) throw error
      setScripts(scripts.filter((s) => s.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting script:", error)
    }
  }

  const handleEdit = (script: any) => {
    setEditingScript({
      ...script,
      access_type: script.access_type || "Keyless",
    })
  }

  const handleSave = async () => {
    try {
      const scriptData: any = {
        name: editingScript.name,
        description: editingScript.description,
        link: editingScript.link,
        access_type: editingScript.access_type || "Keyless",
        image_url: editingScript.image_url,
      }

      if (editingScript.id) {
        const { error } = await supabase.from("scripts").update(scriptData).eq("id", editingScript.id)

        if (error) throw error

        setScripts(scripts.map((s) => (s.id === editingScript.id ? { ...s, ...scriptData, id: editingScript.id } : s)))
      } else {
        const maxPosition = scripts.length > 0 ? Math.max(...scripts.map((s) => s.position || 0)) : -1
        scriptData.position = maxPosition + 1

        const { data, error } = await supabase.from("scripts").insert(scriptData).select().single()

        if (error) throw error

        setScripts([...scripts, data])
      }
      setEditingScript(null)
      setShowAddDialog(false)
    } catch (error) {
      console.error("[v0] Error saving script:", error)
      alert("Error saving script. Please check the console for details.")
    }
  }

  const filteredScripts = scripts.filter(
    (script) =>
      script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading scripts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-3xl font-bold mb-2">Roblox Scripts</h1>
            <p className="text-gray-400">Popular scripts for various games and purposes</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Script
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 backdrop-blur-md border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-600"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredScripts.length} {filteredScripts.length === 1 ? "script" : "scripts"}
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredScripts.map((script, index) => (
          <motion.div
            key={script.id}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            whileHover={{ y: -8 }}
          >
            <div className="absolute -inset-2 bg-purple-600 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />

            <Card className="relative bg-[#1a1a24] border-gray-800 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex flex-col">
                {isAdmin && (
                  <div className="grid grid-cols-3 gap-1 mb-2 w-fit">
                    <div />
                    <Button
                      onClick={() => handleReorder(script.id, "up")}
                      disabled={index === 0}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <div />
                    <Button
                      onClick={() => handleReorderHorizontal(script.id, "left")}
                      disabled={index === 0}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(script.id, "down")}
                      disabled={index === filteredScripts.length - 1}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleReorderHorizontal(script.id, "right")}
                      disabled={index === filteredScripts.length - 1}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg truncate flex-1">{script.name}</h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {script.access_type === "Free & Paid" && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-600/30 to-yellow-600/30 text-green-300 border-green-600/50 text-xs font-semibold"
                    >
                      <Gift className="w-3 h-3 mr-1 inline" />
                      Free & Paid
                    </Badge>
                  )}
                  {script.access_type === "Free" && (
                    <Badge
                      variant="secondary"
                      className="bg-green-600/30 text-green-300 border-green-600/50 text-xs font-semibold"
                    >
                      <Gift className="w-3 h-3 mr-1 inline" />
                      Free
                    </Badge>
                  )}
                  {script.access_type === "Paid" && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-600/30 text-yellow-300 border-yellow-600/50 text-xs font-semibold"
                    >
                      <CreditCard className="w-3 h-3 mr-1 inline" />
                      Paid
                    </Badge>
                  )}
                  {script.access_type === "Keyless" && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/30 text-purple-300 border-purple-600/50 text-xs font-semibold"
                    >
                      <Unlock className="w-3 h-3 mr-1 inline" />
                      Keyless
                    </Badge>
                  )}
                  {script.access_type === "Key System" && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-600/30 text-blue-300 border-blue-600/50 text-xs font-semibold"
                    >
                      <Key className="w-3 h-3 mr-1 inline" />
                      Key System
                    </Badge>
                  )}
                  {!script.access_type && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/30 text-purple-300 border-purple-600/50 text-xs font-semibold"
                    >
                      <Unlock className="w-3 h-3 mr-1 inline" />
                      Keyless
                    </Badge>
                  )}
                </div>

                {script.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={script.image_url || "/placeholder.svg"}
                      alt={script.name}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{script.description}</p>

                <div>
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(script)}
                        className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm text-sm h-9"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(script.id)}
                        className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 backdrop-blur-sm text-sm h-9"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => window.open(script.link, "_blank")}
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm text-sm h-9"
                    >
                      <Code className="w-4 h-4 mr-1.5" />
                      Get Script
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!editingScript || showAddDialog}
        onOpenChange={() => {
          setEditingScript(null)
          setShowAddDialog(false)
        }}
      >
        <DialogContent className="bg-[#1a1a24] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingScript?.id ? "Edit Script" : "Add New Script"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editingScript?.name || ""}
                onChange={(e) => setEditingScript({ ...editingScript, name: e.target.value })}
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={editingScript?.description || ""}
                onChange={(e) => setEditingScript({ ...editingScript, description: e.target.value })}
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Script Link</Label>
              <Input
                value={editingScript?.link || ""}
                onChange={(e) => setEditingScript({ ...editingScript, link: e.target.value })}
                placeholder="https://example.com/script"
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Thumbnail Image URL (optional)</Label>
              <Input
                value={editingScript?.image_url || ""}
                onChange={(e) => setEditingScript({ ...editingScript, image_url: e.target.value })}
                placeholder="https://example.com/image.png"
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Access Type</Label>
              <select
                value={editingScript?.access_type || "Keyless"}
                onChange={(e) => setEditingScript({ ...editingScript, access_type: e.target.value })}
                className="w-full bg-[#0f0f17] border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="Free & Paid">Free & Paid</option>
                <option value="Free">Free</option>
                <option value="Keyless">Keyless</option>
                <option value="Paid">Paid</option>
                <option value="Key System">Key System</option>
              </select>
            </div>
            <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
