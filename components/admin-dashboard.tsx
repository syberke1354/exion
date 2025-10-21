"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { LayoutDashboard, FileText, Users, Settings, LogOut, Menu, X, Plus, Calendar, MapPin, Camera, CreditCard as Edit, Trash2, UserPlus, GraduationCap, Shield, Clock, Trophy, ChartBar as BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import { uploadImage } from "@/lib/cloudinary-upload"   // ✅ fix: pakai uploadImage
import { addMember, addDocumentation, getMembers, getDocumentation } from "@/lib/firebase-service"
import type { Member, Documentation, EkskulType } from "@/types"
import AdminScheduleManagement from "./admin-schedule-management"
import AdminAttendanceManagement from "./admin-attendance-management"
import AdminAchievementManagement from "./admin-achievement-management"
import LoadingSpinner from "./loading-spinner"

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data state
  const [dokumentasi, setDokumentasi] = useState<Documentation[]>([])
  const [members, setMembers] = useState<Member[]>([])

  // Documentation state
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
  })
  const [docPhoto, setDocPhoto] = useState<File | null>(null)
  const [docPhotoPreview, setDocPhotoPreview] = useState<string>("")

  // Member state
  const [newMember, setNewMember] = useState({
    name: "",
    class: "",
    phone: "",
    email: "",
    joinDate: "",
    role: "Anggota",
  })
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null)
  const [memberPhotoPreview, setMemberPhotoPreview] = useState<string>("")

  const canAccessEkskul = (ekskulType: string) => {
    if (!user) return false
    if (user.role === "super_admin") return true
    return user.role === `${ekskulType}_admin`
  }

  const getCurrentEkskulType = (): EkskulType | null => {
    if (!user) return null
    if (user.role === "super_admin") return null
    return user.role.replace("_admin", "") as EkskulType
  }

  const getEkskulName = () => {
    const ekskulType = getCurrentEkskulType()
    switch (ekskulType) {
      case "silat":
        return "Pencak Silat"
      case "robotik":
        return "Robotik"
      case "futsal":
        return "Futsal"
      case "band":
        return "Band"
      case "hadroh":
        return "Hadroh"
      case "qori":
        return "Qori"
      default:
        return "Semua Ekstrakurikuler"
    }
  }

  const getAdminName = () => {
    if (!user) return "Administrator"
    switch (user.role) {
      case "super_admin":
        return "Super Admin"
      case "robotik_admin":
        return "Admin Robotik"
      case "silat_admin":
        return "Admin Pencak Silat"
      case "futsal_admin":
        return "Admin Futsal"
      case "band_admin":
        return "Admin Band"
      case "hadroh_admin":
        return "Admin Hadroh"
      case "qori_admin":
        return "Admin Qori"
      default:
        return "Administrator"
    }
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const ekskulType = getCurrentEkskulType()
        const [docsData, membersData] = await Promise.all([
          getDocumentation(ekskulType || undefined),
          getMembers(ekskulType || undefined),
        ])
        setDokumentasi(docsData)
        setMembers(membersData)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }
    loadData()
  }, [user])

  const handleDocPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setDocPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setDocPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleMemberPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setMemberPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setMemberPhotoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAddDokumentasi = async () => {
    if (!newDoc.title || !newDoc.description || !newDoc.date || !user) return

    setLoading(true)
    try {
      let imageUrl = ""
      if (docPhoto) {
        const formData = new FormData()
        formData.append("file", docPhoto)
        formData.append("folder", "ekskul/documentation")
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        })
        
        if (response.ok) {
          const result = await response.json()
          imageUrl = result.secure_url
        }
      }

      const ekskulType = getCurrentEkskulType()
      if (!ekskulType && user.role !== "super_admin") {
        throw new Error("Invalid ekstrakurikuler type")
      }

      const docData = {
        ...newDoc,
        image: imageUrl,
        photoUrls: imageUrl ? [imageUrl] : [],
        ekskulType: ekskulType || "robotik",
        createdBy: user.id,
        date: newDoc.date ? new Date(newDoc.date) : new Date(),
      }

      await addDocumentation(docData)

      const updatedDocs = await getDocumentation(ekskulType || undefined)
      setDokumentasi(updatedDocs)

      setNewDoc({ title: "", description: "", date: "", location: "", participants: "" })
      setDocPhoto(null)
      setDocPhotoPreview("")
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding documentation:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.class || !newMember.joinDate || !user) return

    setLoading(true)
    try {
      let photoUrl = ""
      if (memberPhoto) {
        const formData = new FormData()
        formData.append("file", memberPhoto)
        formData.append("folder", "ekskul/members")
        
        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        })
        
        if (response.ok) {
          const result = await response.json()
          photoUrl = result.secure_url
        }
      }

      const ekskulType = getCurrentEkskulType()
      if (!ekskulType && user.role !== "super_admin") {
        throw new Error("Invalid ekstrakurikuler type")
      }

      const memberData = {
        ...newMember,
        photoUrl,
        ekskulType: ekskulType || "robotik",
        status: "active" as const,
        joinDate: newMember.joinDate ? new Date(newMember.joinDate) : new Date(),
        studentId: `STD${Date.now()}`,
        role: newMember.role,
      }

      await addMember(memberData)

      const updatedMembers = await getMembers(ekskulType || undefined)
      setMembers(updatedMembers)

      setNewMember({ name: "", class: "", phone: "", email: "", joinDate: "", role: "Anggota" })
      setMemberPhoto(null)
      setMemberPhotoPreview("")
      setShowMemberForm(false)
    } catch (error) {
      console.error("Error adding member:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    onLogout()
  }
  
  // Updated navigation items to include new admin features
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "dokumentasi", label: "Dokumentasi", icon: FileText },
    { id: "members", label: "Anggota", icon: Users },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "attendance", label: "Absensi", icon: Clock },
    { id: "achievements", label: "Prestasi", icon: Trophy },
    { id: "reports", label: "Laporan", icon: BarChart3 },
    { id: "settings", label: "Pengaturan", icon: Settings },
  ]

  // Show loading or error if user is not available
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat data pengguna..." />
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Dashboard {getEkskulName()}</h1>
          <p className="text-muted-foreground">Selamat datang, {user.name || getAdminName()}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">{getAdminName()}</span>
        </div>
      </div>

      {/* Enhanced Stats Cards with better colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="admin-card hover-lift border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Anggota</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">{members.length}</div>
            <p className="text-xs text-muted-foreground">Anggota aktif</p>
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
            <div className="text-2xl font-bold font-heading text-foreground">{dokumentasi.length}</div>
            <p className="text-xs text-muted-foreground">Kegiatan terdokumentasi</p>
          </CardContent>
        </Card>

        <Card className="admin-card hover-lift border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Kegiatan Bulan Ini</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">
              {
                dokumentasi.filter((doc) => {
                  const docDate = new Date(doc.date)
                  const now = new Date()
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Kegiatan bulan ini</p>
          </CardContent>
        </Card>

        <Card className="admin-card hover-lift border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Kegiatan Bulan Ini</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading text-foreground">
              {
                dokumentasi.filter((doc) => {
                  const docDate = new Date(doc.date)
                  const now = new Date()
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Kegiatan bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activities */}
      <Card className="admin-card">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {dokumentasi.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{doc.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{doc.description}</p>
                </div>
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {new Date(doc.date).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
            {dokumentasi.length === 0 && (
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

  const renderDokumentasi = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Dokumentasi {getEkskulName()}</h1>
          <p className="text-muted-foreground">Kelola dokumentasi kegiatan ekstrakurikuler</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Dokumentasi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dokumentasi.map((doc) => (
          <Card key={doc.id} className="overflow-hidden hover-lift">
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {doc.image ? (
                <img src={doc.image || "/placeholder.svg"} alt={doc.title} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{doc.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(doc.date).toLocaleDateString("id-ID")}</span>
                </div>
                {doc.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{doc.location}</span>
                  </div>
                )}
                {doc.participants && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{doc.participants}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {dokumentasi.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Dokumentasi</h3>
          <p className="text-muted-foreground">Tambahkan dokumentasi kegiatan pertama Anda</p>
        </div>
      )}

      {/* Add Documentation Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Tambah Dokumentasi</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="title">Judul Kegiatan</Label>
                <Input
                  id="title"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="Masukkan judul kegiatan"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <textarea
                  id="description"
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })}
                  placeholder="Masukkan deskripsi kegiatan"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[100px] resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Tanggal Kegiatan</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDoc.date}
                    onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={newDoc.location}
                    onChange={(e) => setNewDoc({ ...newDoc, location: e.target.value })}
                    placeholder="Masukkan lokasi kegiatan"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="participants">Peserta</Label>
                <Input
                  id="participants"
                  value={newDoc.participants}
                  onChange={(e) => setNewDoc({ ...newDoc, participants: e.target.value })}
                  placeholder="Masukkan jumlah atau nama peserta"
                />
              </div>

              <div>
                <Label htmlFor="photo">Foto Kegiatan</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleDocPhotoUpload}
                  className="cursor-pointer"
                />
                {docPhotoPreview && (
                  <div className="mt-2">
                    <img
                      src={docPhotoPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddDokumentasi} disabled={loading} className="flex-1">
                  {loading ? "Menyimpan..." : "Simpan Dokumentasi"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2 text-foreground">Anggota {getEkskulName()}</h1>
          <p className="text-muted-foreground">Kelola data anggota ekstrakurikuler</p>
        </div>
        <Button onClick={() => setShowMemberForm(true)} className="hover-lift bg-primary hover:bg-primary/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Tambah Anggota
        </Button>
      </div>

      <Card className="admin-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Foto</th>
                  <th className="text-left p-4 font-semibold text-foreground">Nama</th>
                  <th className="text-left p-4 font-semibold text-foreground">Kelas</th>
                  <th className="text-left p-4 font-semibold text-foreground">Telepon</th>
                  <th className="text-left p-4 font-semibold text-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground">Bergabung</th>
                  <th className="text-left p-4 font-semibold text-foreground">Jabatan</th>
                  <th className="text-left p-4 font-semibold text-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-border">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-foreground">{member.name.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{member.name}</td>
                    <td className="p-4 text-muted-foreground">{member.class}</td>
                    <td className="p-4 text-muted-foreground">{member.phone}</td>
                    <td className="p-4 text-muted-foreground">{member.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4 text-muted-foreground">{(member as any).role || "Anggota"}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 status-active rounded-full text-xs font-medium">{member.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {members.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Anggota</h3>
          <p className="text-muted-foreground">Tambahkan anggota pertama ekstrakurikuler Anda</p>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Tambah Anggota Baru</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowMemberForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="memberPhoto">Foto Anggota</Label>
                <Input
                  id="memberPhoto"
                  type="file"
                  accept="image/*"
                  onChange={handleMemberPhotoUpload}
                  className="cursor-pointer"
                />
                {memberPhotoPreview && (
                  <div className="mt-2 flex justify-center">
                    <img
                      src={memberPhotoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <Label htmlFor="class">Kelas</Label>
                  <Input
                    id="class"
                    value={newMember.class}
                    onChange={(e) => setNewMember({ ...newMember, class: e.target.value })}
                    placeholder="Contoh: XII IPA 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="Contoh: nama@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="joinDate">Tanggal Bergabung</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={newMember.joinDate}
                    onChange={(e) => setNewMember({ ...newMember, joinDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Jabatan</Label>
                  <select
                    id="role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="Ketua">Ketua</option>
                    <option value="Wakil Ketua">Wakil Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Anggota">Anggota</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddMember} disabled={loading} className="flex-1">
                  {loading ? "Menyimpan..." : "Simpan Anggota"}
                </Button>
                <Button variant="outline" onClick={() => setShowMemberForm(false)} className="flex-1">
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Laporan & Analitik</h1>
        <p className="text-muted-foreground">Analisis data dan laporan ekstrakurikuler</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Kehadiran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Tingkat Kehadiran Rata-rata</span>
                <span className="font-bold text-green-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Sesi Bulan Ini</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Anggota Paling Aktif</span>
                <span className="font-bold">Ahmad Rizki</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Aktivitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Dokumentasi</span>
                <span className="font-bold">{dokumentasi.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Kegiatan Bulan Ini</span>
                <span className="font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prestasi Tahun Ini</span>
                <span className="font-bold">5</span>
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
        <h1 className="text-3xl font-heading font-bold mb-2">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan akun dan ekstrakurikuler</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nama Admin</Label>
              <Input value={user.name || getAdminName()} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={getAdminName()} disabled />
            </div>
            <div>
              <Label>Ekstrakurikuler</Label>
              <Input value={getEkskulName()} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Ekstrakurikuler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Jadwal Latihan</Label>
              <Input placeholder="Selasa & Kamis, 15:30-17:30" />
            </div>
            <div>
              <Label>Lokasi</Label>
              <Input placeholder="Lab Komputer" />
            </div>
            <div>
              <Label>Kapasitas Maksimal</Label>
              <Input type="number" placeholder="30" />
            </div>
            <Button>Simpan Pengaturan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "dokumentasi":
        return renderDokumentasi()
      case "members":
        return renderMembers()
      case "schedule":
        return <AdminScheduleManagement />
      case "attendance":
        return <AdminAttendanceManagement />
      case "achievements":
        return <AdminAchievementManagement />
      case "reports":
        return renderReports()
      case "settings":
        return renderSettings()
      default:
        return null
    }
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
              <GraduationCap className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg">Admin Panel</h1>
              <p className="text-xs text-primary font-medium">{getEkskulName()}</p>
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
            <span className="font-medium">{getAdminName()}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}