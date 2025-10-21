"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { addAchievement, deleteAchievement, getAchievements, updateAchievement } from "@/lib/firebase-service"
import type { Achievement } from "@/types"
import { Award, CreditCard as Edit, Medal, Plus, Save, Trash2, Trophy, X } from "lucide-react"
import { useEffect, useState } from "react"
import CloudinaryUpload from "./cloudinary-upload"

export default function AdminAchievementManagement() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)


  const [achievementPhotoPreview, setAchievementPhotoPreview] = useState<string>("")
  const [uploadResults, setUploadResults] = useState<{ secure_url: string }[]>([])

  const getCurrentEkskulType = () => {
    if (!user) return null
    if (user.role === "super_admin") return null
    return user.role.replace("_admin", "") as "robotik" | "silat" | "futsal" | "band" | "hadroh" | "qori"
  }

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return
      try {
        const ekskulType = getCurrentEkskulType()
        const achievementsData = await getAchievements(ekskulType || undefined)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading achievements:", error)
      }
    }

    loadAchievements()
  }, [user])

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.date || !newAchievement.level || !user) return

    setLoading(true)
    try {
      const imageUrl = uploadResults[0]?.secure_url || ""

      const ekskulType = getCurrentEkskulType()
      if (!ekskulType && user.role !== "super_admin") {
        throw new Error("Invalid ekstrakurikuler type")
      }

      const achievementData: Omit<Achievement, "id" | "createdAt" | "updatedAt"> = {
        title: newAchievement.title,
        description: newAchievement.description,
        date: newAchievement.date ? new Date(newAchievement.date) : new Date(),
        level: newAchievement.level,
        position: newAchievement.position,
        participants: newAchievement.participants,
        image: imageUrl,
        ekskulType: ekskulType || "robotik", // fallback default
        createdBy: user.id,
      }

      if (editingAchievement) {
        await updateAchievement(editingAchievement.id, achievementData)
        console.log("Prestasi berhasil diperbarui!")
      } else {
        await addAchievement(achievementData)
        console.log("Prestasi baru berhasil ditambahkan!")
      }

      const updatedAchievements = await getAchievements(ekskulType || undefined)
      setAchievements(updatedAchievements)

      resetForm()
    } catch (error) {
      console.error("Error saving achievement:", error)
    } finally {
      setLoading(false)
    }
  }
const [newAchievement, setNewAchievement] = useState<AchievementForm>({
  title: "",
  description: "",
  date: "",
  level: "Sekolah", // harus salah satu dari union
  position: "",
  participants: [],
})
type AchievementLevel = "Sekolah" | "Kota" | "Provinsi" | "Nasional" | "Internasional"

type AchievementForm = {
  title: string
  description: string
  date: string
  level: AchievementLevel
  position: string
  participants: string[]
}

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      date: new Date(achievement.date).toISOString().split("T")[0], // biar masuk input date
      level: achievement.level,
      position: achievement.position,
      participants: achievement.participants || [],
    })
    setAchievementPhotoPreview(achievement.image || "")
    setUploadResults(achievement.image ? [{ secure_url: achievement.image }] : [])
    setShowAddForm(true)
  }

  const handleDeleteAchievement = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus prestasi ini?")) {
      try {
        await deleteAchievement(id)
        const ekskulType = getCurrentEkskulType()
        const updatedAchievements = await getAchievements(ekskulType || undefined)
        setAchievements(updatedAchievements)
        alert("Prestasi berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting achievement:", error)
        alert("Gagal menghapus prestasi. Silakan coba lagi.")
      }
    }
  }

  const resetForm = () => {
    setNewAchievement({
      title: "",
      description: "",
      date: "",
      level: "Sekolah",
      position: "",
      participants: [],
    })
    setAchievementPhotoPreview("")
    setUploadResults([])
    setShowAddForm(false)
    setEditingAchievement(null)
  }

  const levelColors = {
    Sekolah: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    Kota: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Provinsi: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Nasional: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Internasional: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }

  const getAchievementStats = () => {
    const totalAchievements = achievements.length
    const goldMedals = achievements.filter(
      (a) => a.position.toLowerCase().includes("juara 1") || a.position.toLowerCase().includes("emas"),
    ).length
    const nationalAchievements = achievements.filter((a) => a.level === "Nasional").length
    const thisYearAchievements = achievements.filter(
      (a) => new Date(a.date).getFullYear() === new Date().getFullYear(),
    ).length

    return {
      totalAchievements,
      goldMedals,
      nationalAchievements,
      thisYearAchievements,
    }
  }

  const stats = getAchievementStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Manajemen Prestasi</h1>
          <p className="text-muted-foreground">Kelola prestasi dan penghargaan ekstrakurikuler</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <div className="text-sm text-muted-foreground">Total Prestasi</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Medal className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.goldMedals}</div>
            <div className="text-sm text-muted-foreground">Medali Emas</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.nationalAchievements}</div>
            <div className="text-sm text-muted-foreground">Prestasi Nasional</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.thisYearAchievements}</div>
            <div className="text-sm text-muted-foreground">Prestasi Tahun Ini</div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Prestasi */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Prestasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden hover-lift">
                <div className="relative">
                  {achievement.image ? (
                    <img
                      src={achievement.image || "/placeholder.svg"}
                      alt={achievement.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={levelColors[achievement.level as keyof typeof levelColors]}>
                      {achievement.level}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{achievement.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Posisi:</span>
                      <span className="font-medium">{achievement.position}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{new Date(achievement.date).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="outline">{new Date(achievement.date).getFullYear()}</Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAchievement(achievement)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {achievements.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Prestasi</h3>
              <p className="text-muted-foreground">Tambahkan prestasi pertama ekstrakurikuler Anda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Tambah/Edit */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingAchievement ? "Edit Prestasi" : "Tambah Prestasi Baru"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="achievementTitle">Judul Prestasi</Label>
                <Input
                  id="achievementTitle"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                  placeholder="Masukkan judul prestasi"
                />
              </div>

              <div>
                <Label htmlFor="achievementDescription">Deskripsi</Label>
                <Textarea
                  id="achievementDescription"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Deskripsi prestasi"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="achievementPhoto">Upload Foto Prestasi</Label>
                <CloudinaryUpload
                  onUploadComplete={(results) => {
                    console.log("Achievement photo upload results:", results)
                    setUploadResults(results)
                    if (results[0]?.secure_url) {
                      setAchievementPhotoPreview(results[0].secure_url)
                    }
                  }}
                  onUploadError={(error) => {
                    console.error("Achievement photo upload error:", error)
                  }}
                  multiple={false}
                  accept="image/*"
                />
                {achievementPhotoPreview && (
                  <div className="mt-2">
                    <img
                      src={achievementPhotoPreview}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded border"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="achievementLevel">Tingkat</Label>
               <Select
  value={newAchievement.level}
  onValueChange={(value: AchievementLevel) =>
    setNewAchievement({ ...newAchievement, level: value })
  }
>
  <SelectTrigger>
    <SelectValue placeholder="Pilih tingkat" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Sekolah">Sekolah</SelectItem>
    <SelectItem value="Kota">Kota</SelectItem>
    <SelectItem value="Provinsi">Provinsi</SelectItem>
    <SelectItem value="Nasional">Nasional</SelectItem>
    <SelectItem value="Internasional">Internasional</SelectItem>
  </SelectContent>
</Select>

                </div>
                <div>
                  <Label htmlFor="achievementPosition">Posisi/Peringkat</Label>
                  <Input
                    id="achievementPosition"
                    value={newAchievement.position}
                    onChange={(e) => setNewAchievement({ ...newAchievement, position: e.target.value })}
                    placeholder="Juara 1, Medali Emas, dll"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="achievementDate">Tanggal</Label>
                <Input
                  id="achievementDate"
                  type="date"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddAchievement} className="flex-1" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingAchievement ? "Update" : "Simpan"}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm} disabled={loading}>
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
