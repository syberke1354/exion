"use client"

import AboutPage from "@/components/about-page"
import AchievementsPage from "@/components/achievements-page"
import AdminDashboardRouter from "@/components/admin-dashboard-router"
import AdminLoginPage from "@/components/admin-login-page"
import ContactPage from "@/components/contact-page"
import DocumentationGalleryPage from "@/components/documentation-gallery-page"
import ExtracurricularsPage from "@/components/extracurriculars-page"
import Footer from "@/components/footer"
import FutsalPage from "@/components/futsal-page"
import HadrohPage from "@/components/hadroh-page"
import HomePage from "@/components/home-page"
import { LoadingScreen } from "@/components/loading-screen"
import MusikPage from "@/components/musik-page"
import Navbar from "@/components/navbar"
import PramukaPage from "@/components/pramuka-page"
import PaskibPage from "@/components/paskib-page"
import QoriPage from "@/components/qori-page"
import RobotikPage from "@/components/robotik-page"
import SilatPage from "@/components/silat-page"
import { useAuth } from "@/hooks/use-auth"
import { getDocumentation, getMembers } from "@/lib/firebase-service"
import type { Documentation, Member } from "@/types"
import React, { useEffect, useState } from "react"

export default function SchoolWebsite() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1)
      return hash || sessionStorage.getItem("activeSection") || "home"
    }
    return "home"
  })
  const { user, loading } = useAuth()
  const [showLoadingScreen, setShowLoadingScreen] = useState(() => {
    // Only show loading screen if this is the first visit
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasVisited")
    }
    return false // Fix hydration by defaulting to false on server
  })

  const [globalDokumentasi, setGlobalDokumentasi] = useState<Documentation[]>([])
  const [globalMembers, setGlobalMembers] = useState<Member[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        setDataLoading(true)
        const [docsData, membersData] = await Promise.all([getDocumentation(), getMembers()])

        setGlobalDokumentasi(docsData)
        setGlobalMembers(membersData)
      } catch (error) {
        console.error("Error loading public data:", error)
        setGlobalDokumentasi([])
        setGlobalMembers([])
      } finally {
        setDataLoading(false)
      }
    }

    loadPublicData()
  }, [])

  const handleLoadingComplete = () => {
    setShowLoadingScreen(false)
    // Mark that user has visited
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hasVisited", "true")
    }
  }

  // Fix hydration by checking loading screen state on client
  React.useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("hasVisited")) {
      setShowLoadingScreen(true)
    }
  }, [])

  const handleAdminLogin = (role: string) => {
    setActiveSection("admin-dashboard")
  }

  const handleLogout = () => {
    setActiveSection("home")
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("activeSection", activeSection)
      window.location.hash = activeSection === "home" ? "" : activeSection
    }
  }, [activeSection])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        setActiveSection(hash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const renderPage = () => {
    if (user && activeSection === "admin-dashboard") {
      return <AdminDashboardRouter onLogout={handleLogout} />
    }

    if (activeSection === "admin-login") {
      if (user) {
        setActiveSection("admin-dashboard")
        return <AdminDashboardRouter onLogout={handleLogout} />
      }
      return <AdminLoginPage onLogin={handleAdminLogin} />
    }

    switch (activeSection) {
      case "home":
        return <HomePage onNavigate={setActiveSection} dokumentasi={globalDokumentasi} members={globalMembers} />
      case "about":
        return <AboutPage />
      case "extracurriculars":
        return <ExtracurricularsPage onNavigate={setActiveSection} />
      case "achievements":
        return <AchievementsPage />
      case "contact":
        return <ContactPage />
case "robotik":
  return <RobotikPage onNavigate={setActiveSection} />
      case "silat":
        return <SilatPage onNavigate={setActiveSection}/>
      case "futsal":
        return <FutsalPage onNavigate={setActiveSection}/>
      case "musik":
        return <MusikPage onNavigate={setActiveSection}/>
      case "hadroh":
        return <HadrohPage onNavigate={setActiveSection}/>
      case "qori":
        return <QoriPage onNavigate={setActiveSection}/>
      case "pramuka":
        return <PramukaPage onNavigate={setActiveSection}/>
      case "paskib":
        return <PaskibPage onNavigate={setActiveSection}/>
      case "documentation":
        return <DocumentationGalleryPage />
      default:
        return <HomePage onNavigate={setActiveSection} dokumentasi={globalDokumentasi} members={globalMembers} />
    }
  }

  if (showLoadingScreen) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat...</span>
        </div>
      </div>
    )
  }

  const isAdminPage = user && activeSection === "admin-dashboard"

  return (
    <div className="min-h-screen bg-background">
      {!isAdminPage && <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />}
      <main className="w-full">{renderPage()}</main>
      {!isAdminPage && <Footer onNavigate={setActiveSection} />}
    </div>
  )
}
