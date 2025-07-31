import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import './globals.css'
import SparklesIcon from "@/components/sparkles-icon"
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { ChevronDown, MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EpicCaptions - AI Video Subtitles',
  description: 'Generate stunning subtitles for your videos using AI. Fast, customizable, and easy to use.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white min-h-screen text-black`}>
        <Toaster position="top-center" reverseOrder={false} />
        
         <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
               <div className="flex items-center gap-4">
                   <SparklesIcon className="w-6 h-6 text-yellow-500" />
                 <span className="text-lg font-semibold">Epic Editor</span>
               </div>
               <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-1">
                       Features <ChevronDown className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                     <DropdownMenuItem>Feature 1</DropdownMenuItem>
                     <DropdownMenuItem>Feature 2</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-1">
                       Use Cases <ChevronDown className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                     <DropdownMenuItem>Use Case 1</DropdownMenuItem>
                     <DropdownMenuItem>Use Case 2</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <Button variant="ghost">Pricing</Button>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-1">
                       API <ChevronDown className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                     <DropdownMenuItem>API Docs</DropdownMenuItem>
                     <DropdownMenuItem>Integrations</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-1">
                       Tools <ChevronDown className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                     <DropdownMenuItem>Tool 1</DropdownMenuItem>
                     <DropdownMenuItem>Tool 2</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="flex items-center gap-1">
                       Blog <ChevronDown className="h-4 w-4" />
                     </Button>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent align="start">
                     <DropdownMenuItem>Latest Posts</DropdownMenuItem>
                     <DropdownMenuItem>Categories</DropdownMenuItem>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </nav>
               <div className="flex items-center gap-2">
                 <Button variant="ghost" className="hidden md:inline-flex">
                   Get a demo
                 </Button>
                 <Button
                   variant="outline"
                   className="hidden md:inline-flex bg-transparent"
                 >
                   Login
                 </Button>
                 <Button className="bg-orange-500 hover:bg-orange-600 text-white hidden md:inline-flex">
                   Try For Free
                 </Button>
                 <Sheet>
                   <SheetTrigger asChild>
                     <Button
                       variant="outline"
                       size="icon"
                       className="shrink-0 md:hidden bg-transparent"
                     >
                       <MenuIcon className="h-5 w-5" />
                       <span className="sr-only">Toggle navigation menu</span>
                     </Button>
                   </SheetTrigger>
                   <SheetContent side="right">
                     <nav className="grid gap-6 text-lg font-medium">
                       <a
                         href="#"
                         className="flex items-center gap-2 text-lg font-semibold"
                       >
                         <Image
                           src="/placeholder.svg?height=32&width=32"
                           alt="Submagic Logo"
                           width={32}
                           height={32}
                           className="h-6 w-6"
                         />
                         <span className="sr-only">Submagic</span>
                       </a>
                       <a href="#" className="hover:text-foreground">
                         Features
                       </a>
                       <a href="#" className="hover:text-foreground">
                         Use Cases
                       </a>
                       <a href="#" className="hover:text-foreground">
                         Pricing
                       </a>
                       <a href="#" className="hover:text-foreground">
                         API
                       </a>
                       <a href="#" className="hover:text-foreground">
                         Tools
                       </a>
                       <a href="#" className="hover:text-foreground">
                         Blog
                       </a>
                       <Button variant="ghost">Get a demo</Button>
                       <Button variant="outline">Login</Button>
                       <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                         Try For Free
                       </Button>
                     </nav>
                   </SheetContent>
                 </Sheet>
               </div>
             </header>

        <main className="px-4 sm:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
