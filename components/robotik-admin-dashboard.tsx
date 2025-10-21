"use client"

import { useState, useEffect } from "react"
import { LayoutDashboard, FileText, Users, Settings, Trophy, ChartBar as BarChart3, Cpu, Wrench, Target, Menu, UserCheck, Plus } from "lucide-react"
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
import AdminAchievementManagement from "./admin-achievement-management"
import AdminMemberCRUD from "./admin-member-crud"
import AdminDocumentationCRUD from "./admin-documentation-crud"
import AdminAttendanceManagement from "./admin-attendance-management"

interface RobotikAdminDashboardProps {
  onLogout: () => void
}

export default function RobotikAdminDashboard({ onLogout }: RobotikAdminDashboardProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data state
  const [members, setMembers] = useState<Member[]>([])
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", label: "Proyek Robot", icon: Cpu },
    { id: "competitions", label: "Kompetisi", icon: Trophy },
    { id: "members", label: "Anggota", icon: Users },
    { id: "attendance", label: "Absensi", icon: UserCheck },
    { id: "training", label: "Pelatihan", icon: Wrench },
    { id: "documentation", label: "Dokumentasi", icon: FileText },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== "robotik_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("robotik"),
          getDocumentation("robotik"),
          getAchievements("robotik"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading robotik data:", error)
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
          <h1 className="text-3xl font-heading font-bold mb-2 text-amber-600 dark:text-amber-400">Dashboard Robotik</h1>
          <p className="text-muted-foreground">Kelola ekstrakurikuler robotik dan teknologi</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Admin Robotik</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Anggota Aktif"
          value={members.length}
          description="Programmer & Engineer"
          icon={Users}
          variant="warning"
        />
        <DashboardCard
          title="Dokumentasi"
          value={documentation.length}
          description="Kegiatan terdokumentasi"
          icon={Cpu}
          variant="warning"
        />
        <DashboardCard
          title="Prestasi"
          value={achievements.length}
          description="Total prestasi"
          icon={Trophy}
          variant="warning"
        />
        <DashboardCard
          title="Kegiatan Bulan Ini"
          value={documentation.filter(doc => {
            const docDate = new Date(doc.date)
            const now = new Date()
            return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
          }).length}
          description="Aktivitas terbaru"
          icon={Target}
          variant="warning"
        />
      </div>

      {/* Recent Activities */}
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {documentation.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-3 h-3 bg-amber-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {new Date(doc.date).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
            {documentation.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Belum ada aktivitas terbaru</p>
                <p className="text-sm text-muted-foreground">Mulai dengan menambahkan dokumentasi kegiatan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Proyek Robotik</h1>
          <p className="text-muted-foreground">Kelola proyek dan pengembangan robot</p>
        </div>
        <Button className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Proyek
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Cpu className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Fitur Dalam Pengembangan</h3>
          <p className="text-muted-foreground">Manajemen proyek robotik akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompetitions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Kompetisi Robotik</h1>
          <p className="text-muted-foreground">Kelola kompetisi dan turnamen robotik</p>
        </div>
        <Button className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kompetisi
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Fitur Dalam Pengembangan</h3>
          <p className="text-muted-foreground">Manajemen kompetisi akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderTraining = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Pelatihan Robotik</h1>
          <p className="text-muted-foreground">Kelola materi dan jadwal pelatihan</p>
        </div>
        <Button className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Materi
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Wrench className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Fitur Dalam Pengembangan</h3>
          <p className="text-muted-foreground">Manajemen pelatihan akan segera tersedia</p>
        </CardContent>
      </Card>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Laporan Robotik</h1>
        <p className="text-muted-foreground">Analisis data dan laporan ekstrakurikuler robotik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Anggota</span>
                <span className="font-bold">{members.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Anggota Aktif</span>
                <span className="font-bold text-green-600">{members.filter(m => m.status === 'active').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dokumentasi</span>
                <span className="font-bold">{documentation.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Prestasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Prestasi</span>
                <span className="font-bold">{achievements.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prestasi Nasional</span>
                <span className="font-bold text-yellow-600">{achievements.filter(a => a.level === 'Nasional').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prestasi Tahun Ini</span>
                <span className="font-bold">{achievements.filter(a => new Date(a.date).getFullYear() === new Date().getFullYear()).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Pengaturan Robotik</h1>
        <p className="text-muted-foreground">Kelola pengaturan ekstrakurikuler robotik</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Ekstrakurikuler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nama Ekstrakurikuler</Label>
              <Input value="Robotik" disabled />
            </div>
            <div>
              <Label>Pembina</Label>
              <Input value={user?.name || "Admin Robotik"} disabled />
            </div>
            <div>
              <Label>Lokasi</Label>
              <Input placeholder="Lab Komputer & Lab Robotik" />
            </div>
            <div>
              <Label>Jadwal</Label>
              <Input placeholder="Selasa & Kamis, 15:30-17:30" />
            </div>
            <Button>Simpan Pengaturan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Anggota</span>
              <span className="font-bold">{members.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Dokumentasi</span>
              <span className="font-bold">{documentation.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Prestasi</span>
              <span className="font-bold">{achievements.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "projects":
        return renderProjects()
      case "competitions":
        return renderCompetitions()
      case "training":
        return renderTraining()
      case "members":
        return <AdminMemberCRUD ekskulType="robotik" />
      case "documentation":
        return <AdminDocumentationCRUD ekskulType="robotik" />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      case "reports":
        return renderReports()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "robotik_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard robotik..." variant="primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        title="Robotik Admin"
        subtitle="Technology & Innovation"
        icon={Cpu}
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        variant="robotik"
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Admin Robotik</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {loading ? <LoadingSpinner size="lg" text="Memuat data..." variant="primary" /> : renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}