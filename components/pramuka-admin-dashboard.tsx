"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, ChartBar as BarChart3, Target, Award, Menu, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { getMembers, getDocumentation, getAchievements } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement } from "@/types"
import LoadingSpinner from "./loading-spinner"
import DashboardCard from "./dashboard-card"
import DashboardSidebar from "./dashboard-sidebar"
import AdminMemberCRUD from "./admin-member-crud"
import AdminDocumentationCRUD from "./admin-documentation-crud"
import AdminAttendanceManagement from "./admin-attendance-management"
import AdminAchievementManagement from "./admin-achievement-management"

interface PramukaAdminDashboardProps {
  onLogout: () => void
}

export default function PramukaAdminDashboard({ onLogout }: PramukaAdminDashboardProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [members, setMembers] = useState<Member[]>([])
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "activities", label: "Kegiatan", icon: Compass },
    { id: "camping", label: "Perkemahan", icon: Target },
    { id: "members", label: "Anggota", icon: Users },
    { id: "badges", label: "TKK & TKU", icon: Award },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "pramuka_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("pramuka"),
          getDocumentation("pramuka"),
          getAchievements("pramuka"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading pramuka data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-amber-600 dark:text-amber-400">
            Dashboard Pramuka
          </h1>
          <p className="text-muted-foreground">Kelola ekstrakurikuler pramuka dan kegiatan kepanduan</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Admin Pramuka</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Anggota Pramuka"
          value={members.length}
          description="Pramuka aktif"
          icon={Users}
          variant="warning"
        />
        <DashboardCard
          title="Dokumentasi"
          value={documentation.length}
          description="Foto kegiatan"
          icon={FileText}
          variant="info"
        />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Penghargaan"
          icon={Trophy}
          variant="success"
        />
        <DashboardCard
          title="Tingkat Kehadiran"
          value="85%"
          description="Rata-rata bulan ini"
          icon={BarChart3}
          variant="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kegiatan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            {documentation.length > 0 ? (
              <div className="space-y-4">
                {documentation.slice(0, 5).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada dokumentasi kegiatan
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prestasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.level}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada prestasi tercatat
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Kehadiran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Rata-rata Kehadiran</span>
              <span className="text-2xl font-bold text-amber-600">85%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    if (loading) return <LoadingSpinner />

    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "members":
        return <AdminMemberCRUD ekskulType="pramuka" onUpdate={() => getMembers("pramuka").then(setMembers)} />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="pramuka" onUpdate={() => getDocumentation("pramuka").then(setDocumentation)} />
      case "badges":
        return <AdminAchievementManagement ekskulType="pramuka" onUpdate={() => getAchievements("pramuka").then(setAchievements)} />
      case "activities":
        return <AdminAttendanceManagement ekskulType="pramuka" />
      default:
        return <div className="text-center py-12 text-muted-foreground">Fitur dalam pengembangan</div>
    }
  }

  if (!user || user.role !== "pramuka_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Akses Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-6">
              Anda tidak memiliki akses ke dashboard Pramuka
            </p>
            <Button onClick={handleLogout} className="w-full">
              Kembali ke Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar
          navigationItems={navigationItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          userRole={user?.role || ""}
          onLogout={handleLogout}
        />

        <div className="flex-1 min-w-0">
          <div className="sticky top-0 z-10 bg-background border-b border-border">
            <div className="flex items-center justify-between px-4 lg:px-8 h-16">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-4 ml-auto">
                <Badge variant="outline" className="hidden sm:flex">
                  <Compass className="w-3 h-3 mr-1" />
                  Pramuka Admin
                </Badge>
              </div>
            </div>
          </div>

          <main className="p-4 lg:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  )
}
