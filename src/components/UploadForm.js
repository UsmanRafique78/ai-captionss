"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function UploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("idle")
  const router = useRouter()

  async function upload(ev) {
    ev.preventDefault()
    const files = ev.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setIsUploading(true)
      setUploadProgress(0)
      setUploadStatus("idle")

      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setUploadProgress(progress)
        if (progress >= 95) {
          clearInterval(interval)
        }
      }, 100)

      try {
        const res = await axios.postForm(
          "/api/upload",
          { file },
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                setUploadProgress(percentCompleted)
              }
            },
          }
        )
        clearInterval(interval)
        setUploadProgress(100)
        setUploadStatus("success")
        const newName = res.data.newName
        router.push("/" + newName)
      } catch (error) {
        clearInterval(interval)
        setUploadProgress(0)
        setUploadStatus("error")
        console.error("Upload failed:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <>
      {isUploading && (
        <div className="bg-white/95 text-black fixed inset-0 flex flex-col items-center justify-center z-50 p-4 shadow-xl border border-gray-300">
          <div className="w-full max-w-md text-center">
            <h2 className="text-4xl font-bold mb-4">Uploading</h2>
            <h3 className="text-xl mb-6">Please wait...</h3>
            <Progress
              value={uploadProgress}
              className="w-full h-3 bg-gray-200"
              indicatorClassName="bg-green-600"
            />
            <p className="mt-2 text-lg">{uploadProgress}%</p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-6 bg-white text-black border border-gray-300 rounded-lg shadow-md">
        <Label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center space-y-3 p-4 w-full">
          <UploadCloud className="w-12 h-12 text-gray-500" />
          <span className="text-gray-700 text-lg font-medium text-center">
            {uploadStatus === "success" ? (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Upload successful!
              </span>
            ) : uploadStatus === "error" ? (
              <span className="text-red-600 flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Upload failed.
              </span>
            ) : (
              "Drag and drop your video here, or click to select"
            )}
          </span>
          <Input id="video-upload" type="file" accept="video/*" className="hidden" onChange={upload} />
        </Label>
        <Button
          onClick={() => document.getElementById("video-upload")?.click()}
          disabled={isUploading}
          className="mt-4 w-full max-w-xs bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          Choose file
        </Button>
      </div>
    </>
  )
}
