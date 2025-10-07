"use client"

import { useEffect } from "react"
import { X, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Video {
  title: string
  url: string
  description?: string
  views?: string
  published?: string
}

interface VideoPlayerProps {
  video: Video
  onClose: () => void
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getVideoId(video.url)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full max-w-6xl bg-[#12121a]/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/50 backdrop-blur-xl bg-black/30">
            <div className="flex-1 mr-4">
              <h2 className="text-white font-bold text-lg line-clamp-1">{video.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(video.url, "_blank")}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ExternalLink className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Unable to load video</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6 space-y-4 backdrop-blur-xl bg-black/30">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              {video.views && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{video.views} views</span>
                </div>
              )}
              {video.published && <span>{video.published}</span>}
            </div>

            {video.description && (
              <div className="border-t border-gray-800/50 pt-4">
                <p className="text-gray-300 text-sm leading-relaxed">{video.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
