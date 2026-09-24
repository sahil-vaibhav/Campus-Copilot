import React from "react"
import { Menu, Bell, Search } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Avatar, AvatarFallback } from "../ui/Avatar"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation()
  
  // Create a page title based on the pathname
  const getPageTitle = () => {
    const path = location.pathname.split("/")[1]
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <h1 className="text-xl font-semibold hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search campus..." 
            className="pl-8 bg-muted/50 border-transparent focus-visible:bg-background"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        
        <Avatar className="h-8 w-8 cursor-pointer hidden sm:flex">
          <AvatarFallback>SV</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
