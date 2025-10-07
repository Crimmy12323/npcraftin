"use client"
import { Eye } from "lucide-react"
import { motion } from "framer-motion"

interface Video {
  title: string
  thumbnail: string
  url: string
  description?: string
  views?: string
  duration?: string
  published?: string
}

interface VideoCardProps {
  video: Video
  index: number
  onClick: (video: Video) => void
}

export default function VideoCard({ video, index, onClick }: VideoCardProps) {
  return (
    <motion.button
      onClick={() => onClick(video)}
      className="group block w-full text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{ y: -8 }}
    >
      <div className="relative">
        <div className="absolute -inset-2 bg-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />

        <div className="relative bg-[#1a1a24] rounded-2xl overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-all duration-300">
          <div className="relative aspect-video bg-black overflow-hidden">
            <img
              src={video.thumbnail || "/placeholder.svg?height=1080&width=1920"}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />

            {video.views && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-2xl px-3 py-1.5 rounded-full text-xs text-white font-semibold border border-white/10 shadow-2xl">
                <Eye className="w-3.5 h-3.5" />
                <span>{video.views}</span>
              </div>
            )}

            {video.duration && (
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-2xl px-3 py-1.5 rounded-lg text-xs text-white font-bold border border-white/10 shadow-2xl">
                {video.duration}
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-white font-semibold text-base leading-tight line-clamp-2 group-hover:text-purple-400 group-hover:translate-x-2 transition-all duration-300">
              {video.title}
            </h3>

            {video.published && <p className="text-xs text-gray-500 mt-2">{video.published}</p>}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
