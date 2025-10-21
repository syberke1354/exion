"use client"

import { useState } from "react"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: "home", label: "Beranda" },
    { id: "about", label: "Tentang" },
    { id: "extracurriculars", label: "Ekstrakurikuler" },
    { id: "achievements", label: "Prestasi" },
    { id: "documentation", label: "Dokumentasi" },
    { id: "contact", label: "Kontak" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container-responsive">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-foreground">EXION</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 ${
                  activeSection === item.id
                    ? "text-primary border-b-2 border-primary pb-1 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSectionChange("admin-login")}
              className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              Admin
            </Button>
          </div>

          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-primary/10 hover:text-primary transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 bg-white">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`text-left px-2 py-2 text-sm font-medium transition-all duration-300 hover:text-primary hover:translate-x-2 ${
                    activeSection === item.id ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-primary/10 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => {
                    onSectionChange("admin-login")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Admin Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
