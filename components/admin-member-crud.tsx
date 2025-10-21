"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, CreditCard as Edit, Plus, Search, Filter } from "lucide-react"
import { memberOperations } from "@/lib/crud-operations"
import { useAuth } from "@/hooks/use-auth"
import CloudinaryUpload from "./cloudinary-upload"
import type { Member, EkskulType } from "@/types"
import LoadingSpinner from "./loading-spinner"

interface AdminMemberCRUDProps {
  ekskulType?: EkskulType
}

export default function AdminMemberCRUD({ ekskulType }: AdminMemberCRUDProps) {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    studentId: "",
    joinDate: "",
    status: "active" as "active" | "inactive",
    notes: "",
    role: "Anggota",
  })
  const [uploadResults, setUploadResults] = useState<any[]>([])

  const getFilterEkskulType = (): EkskulType | undefined => {
    if (ekskulType) return ekskulType
    if (user?.role === "super_admin") return undefined // Show all
    return user?.role?.replace("_admin", "") as EkskulType
  }

  useEffect(() => {
    const filterEkskulType = getFilterEkskulType()
    const unsubscribe = memberOperations.subscribe(
      (data) => {
        const filteredMembers = filterEkskulType
          ? data.filter((member) => member.ekskulType === filterEkskulType)
          : data
        setMembers(filteredMembers)
        setLoading(false)
      },
      filterEkskulType ? [{ field: "ekskulType", operator: "==", value: filterEkskulType }] : undefined,
    )

    return unsubscribe
  }, [ekskulType, user])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) return

  setLoading(true)
  try {
    const memberData: any = {
      ...formData,
      ekskulType: getFilterEkskulType() || "robotik",
      joinDate: formData.joinDate ? new Date(formData.joinDate) : new Date(),
      photoUrl: uploadResults[0]?.secure_url || uploadResults[0]?.url || "",
      createdBy: user.id,
    }

    Object.keys(memberData).forEach((key) => {
      if (memberData[key] === undefined) {
        delete memberData[key]
      }
    })

    if (editingMember) {
      await memberOperations.update(editingMember.id, memberData)
      console.log("Data anggota berhasil diperbarui!")
    } else {
      await memberOperations.create(memberData)
      console.log("Anggota baru berhasil ditambahkan!")
    }

    setIsDialogOpen(false)
    resetForm()
  } catch (error) {
    console.error("Error saving member:", error)
  } finally {
    setLoading(false)
  }
}

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      class: member.class,
      studentId: member.studentId,
      joinDate: member.joinDate.toISOString().split("T")[0],
      status: member.status,
      notes: (member as any).notes || "",
      role: (member as any).role || "Anggota",
    })
    setUploadResults(member.photoUrl ? [{ url: member.photoUrl, secureUrl: member.photoUrl }] : [])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      try {
        await memberOperations.delete(id)
        alert("Anggota berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting member:", error)
        alert("Gagal menghapus anggota. Silakan coba lagi.")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      class: "",
      studentId: "",
      joinDate: "",
      status: "active",
      notes: "",
      role: "Anggota",
    })
    setUploadResults([])
    setEditingMember(null)
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.class.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || member.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading && members.length === 0) {
    return <LoadingSpinner size="lg" text="Memuat data anggota..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Anggota</h2>
          <p className="text-muted-foreground">Kelola data anggota ekstrakurikuler</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Anggota" : "Tambah Anggota Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">NIS *</Label>
                  <Input
                    id="studentId"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">No. Telepon *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="class">Kelas *</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    placeholder="XII RPL 1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate">Tanggal Bergabung *</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan tentang anggota..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="role">Jabatan</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ketua">Ketua</SelectItem>
                    <SelectItem value="Wakil Ketua">Wakil Ketua</SelectItem>
                    <SelectItem value="Sekretaris">Sekretaris</SelectItem>
                    <SelectItem value="Bendahara">Bendahara</SelectItem>
                    <SelectItem value="Anggota">Anggota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Foto Profil</Label>
                <CloudinaryUpload
                  onUploadComplete={(results) => {
                    console.log("Member photo upload results:", results)
                    setUploadResults(results)
                  }}
                  onUploadError={(error) => console.error("Member photo upload error:", error)}
                  folder="ekskul/members"
                  multiple={false}
                  accept="image/*"
                />
                {uploadResults[0] && (
                  <div className="mt-2">
                    <img
                      src={uploadResults[0].secure_url || uploadResults[0].url}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full border"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Menyimpan..." : editingMember ? "Update Anggota" : "Tambah Anggota"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari nama, email, atau kelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.photoUrl || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{member.class}</span>
                      <span>•</span>
                      <span>{member.studentId}</span>
                      <span>•</span>
                      <span>{member.email}</span>
                      <span>•</span>
                      <span>{(member as any).role || "Anggota"}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Bergabung: {new Date(member.joinDate).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {searchTerm || statusFilter !== "all" ? "Tidak Ada Hasil" : "Belum Ada Anggota"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Tambahkan anggota pertama ekstrakurikuler Anda"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}