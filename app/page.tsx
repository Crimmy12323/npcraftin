"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import VideoCard from "@/components/VideoCard"
import VideoPlayer from "@/components/VideoPlayer"
import { motion } from "framer-motion"

const YOUTUBE_API_KEY = "AIzaSyCdYFb75NvXcLPbicc7EOspSFKpit74o8Y"
const CHANNEL_USERNAME = "NPCraftin"

interface Video {
  title: string
  thumbnail: string
  url: string
  description: string
  views: string
  duration: string
  published: string
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [error, setError] = useState<string | null>(null)

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M"
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K"
    }
    return count.toString()
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return "0:00"

    const hours = (match[1] || "").replace("H", "")
    const minutes = (match[2] || "").replace("M", "")
    const seconds = (match[3] || "").replace("S", "")

    let result = ""
    if (hours) result += hours + ":"
    result += (minutes || "0").padStart(hours ? 2 : 1, "0") + ":"
    result += (seconds || "0").padStart(2, "0")

    return result
  }

  const formatPublishedDate = (dateString: string) => {
    const now = new Date()
    const published = new Date(dateString)
    const diffTime = Math.abs(now.getTime() - published.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffWeeks = Math.floor(diffDays / 7)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`
    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    return "Today"
  }

  const loadVideos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // First, get the channel ID from the username
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id,contentDetails&forUsername=${CHANNEL_USERNAME}&key=${YOUTUBE_API_KEY}`,
      )

      let channelData = await channelResponse.json()

      // If forUsername doesn't work, try searching by channel name
      if (!channelData.items || channelData.items.length === 0) {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${CHANNEL_USERNAME}&type=channel&key=${YOUTUBE_API_KEY}`,
        )
        const searchData = await searchResponse.json()

        if (searchData.items && searchData.items.length > 0) {
          const channelId = searchData.items[0].id.channelId
          const channelDetailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`,
          )
          channelData = await channelDetailsResponse.json()
        }
      }

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error("Channel not found")
      }

      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads

      // Get videos from the uploads playlist
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`,
      )

      const playlistData = await playlistResponse.json()

      if (!playlistData.items) {
        throw new Error("No videos found")
      }

      // Get video details (duration, views, etc.)
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(",")
      const videoDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      )

      const videoDetailsData = await videoDetailsResponse.json()

      // Combine the data
      const formattedVideos = playlistData.items.map((item: any) => {
        const videoId = item.snippet.resourceId.videoId
        const details = videoDetailsData.items.find((v: any) => v.id === videoId)

        return {
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          description: item.snippet.description.slice(0, 150),
          views: details ? formatViewCount(Number.parseInt(details.statistics.viewCount)) : "N/A",
          duration: details ? formatDuration(details.contentDetails.duration) : "N/A",
          published: formatPublishedDate(item.snippet.publishedAt),
        }
      })

      setVideos(formattedVideos)
      setLastRefresh(Date.now())
    } catch (error) {
      console.error("Error loading videos:", error)
      setError((error as Error).message)
      setVideos([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    loadVideos()

    // Auto-refresh every 10 minutes
    const interval = setInterval(
      () => {
        loadVideos()
      },
      10 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [loadVideos])

  const filteredVideos = useMemo(
    () =>
      videos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [videos, searchQuery],
  )

  const getTimeSinceRefresh = () => {
    const minutes = Math.floor((Date.now() - lastRefresh) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  return (
    <>
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-2"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Try 'Infinite yield'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 backdrop-blur-md border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-600"
            />
          </div>
        </motion.div>

        {/* Last refresh time */}
        <p className="text-xs text-gray-500 mb-6">Last updated: {getTimeSinceRefresh()}</p>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-600/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load videos: {error}. Please try again.</AlertDescription>
          </Alert>
        )}

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Recent Videos</h2>
          <span className="text-sm text-gray-500">
            {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"}
          </span>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Loading videos from NPCraftin...</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, index) => (
              <VideoCard key={`${video.url}-${index}`} video={video} index={index} onClick={setSelectedVideo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No videos found matching your search</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </>
  )
}
