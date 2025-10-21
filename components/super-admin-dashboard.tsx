"use client"

import { useState, useEffect } from "react"
import { Save, Download } from "lucide-react"
import { LayoutDashboard, Users, UserCog, Settings, LogOut, Menu, X, Plus, Shield, ChartBar as BarChart3, Activity, Trophy, FileText, CreditCard as Edit, Trash2, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, TrendingUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { getMembers, getDocumentation, getAchievements } from "@/lib/firebase-service"
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Member, Documentation, Achievement, User, EkskulType } from "@/types"
import LoadingSpinner from "./loading-spinner"

interface SuperAdminDashboardProps {
  onLogout: () => void
}

export default function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data state
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [allDocumentation, setAllDocumentation] = useState<Documentation[]>([])
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([])
  const [adminUsers, setAdminUsers] = useState<User[]>([])

  // User management state
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "robotik_admin" as User["role"],
    password: "",
  })

  // Statistics state
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDocumentation: 0,
    totalAchievements: 0,
    totalAdmins: 0,
    membersByEkskul: {} as Record<EkskulType, number>,
    activitiesByMonth: 0,
    attendanceRate: 92,
    growthRate: 15,
  })

  const ekskulTypes: { value: EkskulType; label: string; color: string; bgColor: string }[] = [
    { value: "robotik", label: "Robotik", color: "text-amber-700", bgColor: "bg-amber-100" },
    { value: "silat", label: "Pencak Silat", color: "text-red-700", bgColor: "bg-red-100" },
    { value: "futsal", label: "Futsal", color: "text-orange-700", bgColor: "bg-orange-100" },
    { value: "band", label: "Band", color: "text-purple-700", bgColor: "bg-purple-100" },
    { value: "hadroh", label: "Hadroh", color: "text-emerald-700", bgColor: "bg-emerald-100" },
    { value: "qori", label: "Qori", color: "text-indigo-700", bgColor: "bg-indigo-100" },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Kelola Admin", icon: UserCog },
    { id: "overview", label: "Overview Ekskul", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "system", label: "System Settings", icon: Settings },
  ]

  useEffect(() => {
    const loadAllData = async () => {
      if (!user || user.role !== "super_admin") return

      setLoading(true)
      try {
        const [membersData, docsData, achievementsData, usersSnapshot] = await Promise.all([
          getMembers(), // Get all members
          getDocumentation(), // Get all documentation
          getAchievements(), // Get all achievements
          getDocs(collection(db, "users")),
        ])

        setAllMembers(membersData)
        setAllDocumentation(docsData)
        setAllAchievements(achievementsData)

        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]
        setAdminUsers(users)

        // Calculate statistics
        const membersByEkskul = membersData.reduce(
          (acc, member) => {
            acc[member.ekskulType] = (acc[member.ekskulType] || 0) + 1
            return acc
          },
          {} as Record<EkskulType, number>,
        )

        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const activitiesThisMonth = docsData.filter((doc) => {
          const docDate = new Date(doc.date)
          return docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear
        }).length

        setStats({
          totalMembers: membersData.length,
          totalDocumentation: docsData.length,
          totalAchievements: achievementsData.length,
          totalAdmins: users.length,
          membersByEkskul,
          activitiesByMonth: activitiesThisMonth,
          attendanceRate: 92, // This would come from attendance data
          growthRate: 15, // This would be calculated from historical data
        })
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [user])

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return

    setLoading(true)
    try {
      const userData = {
        ...newUser,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        lastLogin: null,
      }

      if (editingUser) {
        await updateDoc(doc(db, "users", editingUser.id), {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          updatedAt: new Date(),
        })
      } else {
        await addDoc(collection(db, "users"), userData)
      }

      // Reload users
      const usersSnapshot = await getDocs(collection(db, "users"))
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]
      setAdminUsers(users)

      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "robotik_admin",
        password: "",
      })
      setEditingUser(null)
      setShowUserForm(false)
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Gagal menyimpan data admin")
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "", // Don't show existing password
    })
    setShowUserForm(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus admin ini?")) return

    try {
      await deleteDoc(doc(db, "users", userId))
      setAdminUsers(adminUsers.filter((u) => u.id !== userId))
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Gagal menghapus admin")
    }
  }

  const handleLogout = async () => {
    await logout()
    onLogout()
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Kelola seluruh sistem ekstrakurikuler sekolah</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Super Administrator</span>
        </div>
      </div>

      {/* Enhanced Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="admin-card hover-lift border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Anggota</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{stats.totalMembers}</div>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-500">+{stats.growthRate}%</span>
              <span className="text-muted-foreground">dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card hover-lift border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Admin</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserCog className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">Admin aktif sistem</p>
          </CardContent>
        </Card>

        <Card className="admin-card hover-lift border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Dokumentasi</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{stats.totalDocumentation}</div>
            <p className="text-xs text-muted-foreground">Total kegiatan terdokumentasi</p>
          </CardContent>
        </Card>

        <Card className="admin-card hover-lift border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Prestasi</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">Total prestasi diraih</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Ekstrakurikuler Overview */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Overview Ekstrakurikuler</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("overview")}>
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ekskulTypes.map((ekskul) => (
              <div
                key={ekskul.value}
                className="p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover-lift"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${ekskul.bgColor}`}></div>
                  <h3 className="font-semibold text-foreground">{ekskul.label}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Anggota:</span>
                    <span className="font-semibold text-foreground">{stats.membersByEkskul[ekskul.value] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Dokumentasi:</span>
                    <span className="font-semibold text-foreground">
                      {allDocumentation.filter((doc) => doc.ekskulType === ekskul.value).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Prestasi:</span>
                    <span className="font-semibold text-foreground">
                      {allAchievements.filter((ach) => ach.ekskulType === ekskul.value).length}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs bg-transparent"
                      onClick={() => {
                        // Navigate to specific ekskul admin view
                        console.log(`Viewing ${ekskul.value} details`)
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent System Activity */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Aktivitas Sistem Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {allDocumentation.slice(0, 8).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {ekskulTypes.find((e) => e.value === doc.ekskulType)?.label || doc.ekskulType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
            {allDocumentation.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Belum ada aktivitas sistem</p>
                <p className="text-sm text-muted-foreground">Aktivitas akan muncul ketika admin menambahkan data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Kelola Admin</h1>
          <p className="text-muted-foreground">Kelola akun administrator ekstrakurikuler</p>
        </div>
        <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
          <DialogTrigger asChild>
            <Button className="hover-lift bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {editingUser ? "Edit Admin" : "Tambah Admin"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit Admin" : "Tambah Admin Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nama admin"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="admin@sman1.sch.id"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: User["role"]) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="robotik_admin">Admin Robotik</SelectItem>
                    <SelectItem value="silat_admin">Admin Pencak Silat</SelectItem>
                    <SelectItem value="futsal_admin">Admin Futsal</SelectItem>
                    <SelectItem value="band_admin">Admin Band</SelectItem>
                    <SelectItem value="hadroh_admin">Admin Hadroh</SelectItem>
                    <SelectItem value="qori_admin">Admin Qori</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Password admin"
                  />
                </div>
              )}
              <Button onClick={handleAddUser} className="w-full" disabled={loading}>
                {loading ? "Menyimpan..." : editingUser ? "Update Admin" : "Tambah Admin"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="admin-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Nama</th>
                  <th className="text-left p-4 font-semibold text-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground">Role</th>
                  <th className="text-left p-4 font-semibold text-foreground">Ekstrakurikuler</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Dibuat</th>
                  <th className="text-left p-4 font-semibold text-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">{admin.name}</td>
                    <td className="p-4 text-muted-foreground">{admin.email}</td>
                    <td className="p-4">
                      <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                        {admin.role === "super_admin"
                          ? "Super Admin"
                          : admin.role.replace("_admin", "").charAt(0).toUpperCase() +
                            admin.role.replace("_admin", "").slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {admin.role === "super_admin"
                        ? "Semua"
                        : ekskulTypes.find((e) => e.value === admin.role.replace("_admin", ""))?.label || "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-foreground">Aktif</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("id-ID") : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditUser(admin)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {admin.role !== "super_admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteUser(admin.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {adminUsers.length === 0 && (
        <div className="text-center py-12">
          <UserCog className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Admin</h3>
          <p className="text-muted-foreground">Tambahkan admin pertama untuk mengelola ekstrakurikuler</p>
        </div>
      )}
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Kelola pengaturan sistem dan konfigurasi aplikasi</p>
        </div>
      </div>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="admin-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">Pengaturan Umum</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="school-name">Nama Sekolah</Label>
              <Input id="school-name" defaultValue="SMA Negeri 1" className="mt-1" placeholder="Nama sekolah" />
            </div>
            <div>
              <Label htmlFor="school-address">Alamat Sekolah</Label>
              <Input
                id="school-address"
                defaultValue="Jl. Pendidikan No. 123"
                className="mt-1"
                placeholder="Alamat lengkap sekolah"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email Kontak</Label>
              <Input
                id="contact-email"
                type="email"
                defaultValue="info@sman1.sch.id"
                className="mt-1"
                placeholder="Email kontak sekolah"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Nomor Telepon</Label>
              <Input
                id="contact-phone"
                defaultValue="(021) 123-4567"
                className="mt-1"
                placeholder="Nomor telepon sekolah"
              />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">Pengaturan Ekstrakurikuler</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="max-members">Maksimal Anggota per Ekskul</Label>
              <Input
                id="max-members"
                type="number"
                defaultValue="50"
                className="mt-1"
                placeholder="Jumlah maksimal anggota"
              />
            </div>
            <div>
              <Label htmlFor="registration-period">Periode Pendaftaran</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input type="date" defaultValue="2024-07-01" />
                <Input type="date" defaultValue="2024-07-31" />
              </div>
            </div>
            <div>
              <Label htmlFor="academic-year">Tahun Ajaran</Label>
              <Input id="academic-year" defaultValue="2024/2025" className="mt-1" placeholder="Tahun ajaran aktif" />
            </div>
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Status Sistem</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Database</h3>
              <p className="text-sm text-green-600">Terhubung</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Storage</h3>
              <p className="text-sm text-green-600">Aktif</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Authentication</h3>
              <p className="text-sm text-green-600">Berfungsi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup & Maintenance */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Backup & Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Backup Data</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Backup terakhir: {new Date().toLocaleDateString("id-ID")}
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground mb-4">Aktifkan mode maintenance untuk pemeliharaan sistem</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Toggle Maintenance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "users":
        return renderUserManagement()
      case "overview":
        return renderDashboard() // Enhanced overview in dashboard
      case "analytics":
        return renderDashboard() // Analytics integrated in dashboard
      case "system":
        return renderSystemSettings() // Now renders actual system settings instead of placeholder
      default:
        return renderDashboard()
    }
  }

  if (!user || user.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-foreground">Akses Ditolak</h2>
          <p className="text-muted-foreground">Anda tidak memiliki akses ke halaman ini.</p>
          <Button onClick={handleLogout} className="mt-4">
            Kembali ke Login
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground">Super Admin</h1>
              <p className="text-xs text-primary font-medium">System Control</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover-lift ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-card border-b p-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-foreground">Super Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{loading ? <LoadingSpinner size="lg" text="Memuat data..." /> : renderContent()}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
