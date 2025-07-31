import { Sparkles } from "lucide-react"

export default function SparklesIcon() {
  return (
    <div className="flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
      <Sparkles className="w-8 h-8 text-white animate-pulse" />
    </div>
  )
}
