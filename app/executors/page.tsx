"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Download,
  Shield,
  AlertTriangle,
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

export default function RobloxExecutors() {
  const { isAdmin } = useAuth()
  const [executors, setExecutors] = useState<any[]>([])
  const [editingExecutor, setEditingExecutor] = useState<any>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchExecutors()
  }, [])

  const fetchExecutors = async () => {
    try {
      const { data, error } = await supabase.from("executors").select("*").order("position", { ascending: true })

      if (error) throw error
      setExecutors(data || [])
    } catch (error) {
      console.error("[v0] Error fetching executors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = executors.findIndex((e) => e.id === id)
    if (currentIndex === -1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= executors.length) return

    const currentExecutor = executors[currentIndex]
    const targetExecutor = executors[targetIndex]

    try {
      await supabase.from("executors").update({ position: targetExecutor.position }).eq("id", currentExecutor.id)

      await supabase.from("executors").update({ position: currentExecutor.position }).eq("id", targetExecutor.id)

      const newExecutors = [...executors]
      newExecutors[currentIndex] = { ...currentExecutor, position: targetExecutor.position }
      newExecutors[targetIndex] = { ...targetExecutor, position: currentExecutor.position }
      newExecutors.sort((a, b) => a.position - b.position)
      setExecutors(newExecutors)
    } catch (error) {
      console.error("[v0] Error reordering executors:", error)
    }
  }

  const handleReorderHorizontal = async (id: string, direction: "left" | "right") => {
    const currentIndex = executors.findIndex((e) => e.id === id)
    if (currentIndex === -1) return

    const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= executors.length) return

    const currentExecutor = executors[currentIndex]
    const targetExecutor = executors[targetIndex]

    try {
      await supabase.from("executors").update({ position: targetExecutor.position }).eq("id", currentExecutor.id)

      await supabase.from("executors").update({ position: currentExecutor.position }).eq("id", targetExecutor.id)

      const newExecutors = [...executors]
      newExecutors[currentIndex] = { ...currentExecutor, position: targetExecutor.position }
      newExecutors[targetIndex] = { ...targetExecutor, position: currentExecutor.position }
      newExecutors.sort((a, b) => a.position - b.position)
      setExecutors(newExecutors)
    } catch (error) {
      console.error("[v0] Error reordering executors:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("executors").delete().eq("id", id)

      if (error) throw error
      setExecutors(executors.filter((e: any) => e.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting executor:", error)
    }
  }

  const handleEdit = (executor: any) => {
    setEditingExecutor({
      ...executor,
      access_type: executor.access_type || "Keyless",
      videoUrl: executor.video_url,
      imageUrl: executor.image_url,
    })
  }

  const handleSave = async () => {
    try {
      const executorData: any = {
        name: editingExecutor.name,
        description: editingExecutor.description,
        unc: editingExecutor.unc,
        sunc: editingExecutor.sunc,
        features: editingExecutor.features.filter((f: string) => f.trim()),
        link: editingExecutor.link,
        video_url: editingExecutor.videoUrl,
        image_url: editingExecutor.imageUrl,
        access_type: editingExecutor.access_type || "Keyless",
      }

      if (editingExecutor.id) {
        const { error } = await supabase.from("executors").update(executorData).eq("id", editingExecutor.id)

        if (error) {
          if (error.message.includes("access_type")) {
            alert("Please run the database migration scripts first to enable access type features.")
          }
          throw error
        }

        setExecutors(
          executors.map((e: any) =>
            e.id === editingExecutor.id ? { ...e, ...executorData, id: editingExecutor.id } : e,
          ),
        )
      } else {
        const maxPosition = executors.length > 0 ? Math.max(...executors.map((e) => e.position || 0)) : -1
        executorData.position = maxPosition + 1

        const { data, error } = await supabase.from("executors").insert(executorData).select().single()

        if (error) {
          if (error.message.includes("access_type")) {
            alert("Please run the database migration scripts first to enable access type features.")
          }
          throw error
        }

        setExecutors([...executors, data])
      }
      setEditingExecutor(null)
      setShowAddDialog(false)
    } catch (error) {
      console.error("[v0] Error saving executor:", error)
    }
  }

  const filteredExecutors = executors.filter(
    (executor) =>
      executor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      executor.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400 text-sm">Loading executors...</p>
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
            <h1 className="text-white text-3xl font-bold mb-2">Roblox Executors</h1>
            <p className="text-gray-400">Comprehensive guide to the best Roblox script executors</p>
          </div>
          {isAdmin && (
            <Button onClick={() => setShowAddDialog(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Executor
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search executors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 backdrop-blur-md border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-600"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredExecutors.length} {filteredExecutors.length === 1 ? "executor" : "executors"}
          </span>
        </div>
      </motion.div>

      <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-yellow-400 font-semibold mb-1">Important Disclaimer</h3>
          <p className="text-gray-400 text-sm">
            Using script executors may violate Roblox&apos;s Terms of Service and could result in account bans. Use at
            your own risk and always download from official sources.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredExecutors.map((executor: any, index) => (
          <motion.div
            key={executor.id}
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

            <Card className="relative bg-[#1a1a24] border-gray-800 hover:border-purple-600/50 transition-all flex flex-col">
              <CardContent className="p-5 flex flex-col">
                {isAdmin && (
                  <div className="grid grid-cols-3 gap-1 mb-2 w-fit">
                    <div />
                    <Button
                      onClick={() => handleReorder(executor.id, "up")}
                      disabled={index === 0}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <div />
                    <Button
                      onClick={() => handleReorderHorizontal(executor.id, "left")}
                      disabled={index === 0}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleReorder(executor.id, "down")}
                      disabled={index === filteredExecutors.length - 1}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleReorderHorizontal(executor.id, "right")}
                      disabled={index === filteredExecutors.length - 1}
                      className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg truncate flex-1">{executor.name}</h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {executor.access_type === "Free & Paid" && (
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-600/30 to-yellow-600/30 text-green-300 border-green-600/50 text-xs font-semibold"
                    >
                      <Gift className="w-3 h-3 mr-1 inline" />
                      Free & Paid
                    </Badge>
                  )}
                  {executor.access_type === "Free" && (
                    <Badge
                      variant="secondary"
                      className="bg-green-600/30 text-green-300 border-green-600/50 text-xs font-semibold"
                    >
                      <Gift className="w-3 h-3 mr-1 inline" />
                      Free
                    </Badge>
                  )}
                  {executor.access_type === "Paid" && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-600/30 text-yellow-300 border-yellow-600/50 text-xs font-semibold"
                    >
                      <CreditCard className="w-3 h-3 mr-1 inline" />
                      Paid
                    </Badge>
                  )}
                  {executor.access_type === "Keyless" && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/30 text-purple-300 border-purple-600/50 text-xs font-semibold"
                    >
                      <Unlock className="w-3 h-3 mr-1 inline" />
                      Keyless
                    </Badge>
                  )}
                  {executor.access_type === "Key System" && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-600/30 text-blue-300 border-blue-600/50 text-xs font-semibold"
                    >
                      <Key className="w-3 h-3 mr-1 inline" />
                      Key System
                    </Badge>
                  )}
                  {!executor.access_type && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-600/30 text-purple-300 border-purple-600/50 text-xs font-semibold"
                    >
                      <Unlock className="w-3 h-3 mr-1 inline" />
                      Keyless
                    </Badge>
                  )}
                  <span className="text-xs text-gray-400">
                    {executor.unc}% UNC / {executor.sunc}% SUNC
                  </span>
                </div>

                {executor.image_url && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img
                      src={executor.image_url || "/placeholder.svg"}
                      alt={executor.name}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{executor.description}</p>

                <div className="space-y-1 mb-4 flex-1">
                  {executor.features?.slice(0, 3).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-base">
                      <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300 truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(executor)}
                        className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm text-sm h-10"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(executor.id)}
                        className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 backdrop-blur-sm text-sm h-10"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => window.open(executor.link, "_blank")}
                      className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm text-sm h-10"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Get Executor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={!!editingExecutor || showAddDialog}
        onOpenChange={() => {
          setEditingExecutor(null)
          setShowAddDialog(false)
        }}
      >
        <DialogContent className="bg-[#1a1a24] border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExecutor?.id ? "Edit Executor" : "Add New Executor"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editingExecutor?.name || ""}
                onChange={(e) => setEditingExecutor({ ...editingExecutor, name: e.target.value })}
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={editingExecutor?.description || ""}
                onChange={(e) => setEditingExecutor({ ...editingExecutor, description: e.target.value })}
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Download Link</Label>
              <Input
                value={editingExecutor?.link || ""}
                onChange={(e) => setEditingExecutor({ ...editingExecutor, link: e.target.value })}
                placeholder="https://example.com/executor"
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL (optional)</Label>
              <Input
                value={editingExecutor?.imageUrl || editingExecutor?.image_url || ""}
                onChange={(e) => setEditingExecutor({ ...editingExecutor, imageUrl: e.target.value })}
                placeholder="https://example.com/image.png"
                className="bg-[#0f0f17] border-gray-700"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Access Type</Label>
              <select
                value={editingExecutor?.access_type || "Keyless"}
                onChange={(e) =>
                  setEditingExecutor({
                    ...editingExecutor,
                    access_type: e.target.value,
                  })
                }
                className="w-full bg-[#0f0f17] border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="Free & Paid">Free & Paid</option>
                <option value="Free">Free</option>
                <option value="Keyless">Keyless</option>
                <option value="Paid">Paid</option>
                <option value="Key System">Key System</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>UNC Compatibility (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editingExecutor?.unc || 0}
                  onChange={(e) => setEditingExecutor({ ...editingExecutor, unc: Number.parseInt(e.target.value) })}
                  className="bg-[#0f0f17] border-gray-700"
                />
              </div>
              <div className="space-y-1.5">
                <Label>SUNC Compatibility (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editingExecutor?.sunc || 0}
                  onChange={(e) => setEditingExecutor({ ...editingExecutor, sunc: Number.parseInt(e.target.value) })}
                  className="bg-[#0f0f17] border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Features (one per line)</Label>
              <Textarea
                value={editingExecutor?.features?.join("\n") || ""}
                onChange={(e) =>
                  setEditingExecutor({
                    ...editingExecutor,
                    features: e.target.value.split("\n"),
                  })
                }
                placeholder="Level 8 execution\nCustom UI\nScript hub\nAuto-update"
                className="bg-[#0f0f17] border-gray-700 min-h-[200px] resize-y"
              />
              <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
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
