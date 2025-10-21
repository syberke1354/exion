"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, CreditCard as Edit, Plus, Calendar, MapPin, Users, Camera } from "lucide-react"
import { documentationOperations } from "@/lib/crud-operations"
import { useAuth } from "@/hooks/use-auth"
import CloudinaryUpload from "./cloudinary-upload"
import type { Documentation, EkskulType } from "@/types"
import LoadingSpinner from "./loading-spinner"

interface AdminDocumentationCRUDProps {
  ekskulType?: EkskulType
}

export default function AdminDocumentationCRUD({ ekskulType }: AdminDocumentationCRUDProps) {
  const { user } = useAuth()
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    category: "training" as "training" | "competition" | "event" | "workshop",
  })
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [error, setError] = useState("")

  // Determine which ekskul type to filter by
  const getFilterEkskulType = (): EkskulType | undefined => {
    if (ekskulType) return ekskulType
    if (user?.role === "super_admin") return undefined // Show all
    return user?.role?.replace("_admin", "") as EkskulType
  }

  useEffect(() => {
    const filterEkskulType = getFilterEkskulType()
    const unsubscribe = documentationOperations.subscribe(
      (data) => {
        const filteredDocs = filterEkskulType ? data.filter((doc) => doc.ekskulType === filterEkskulType) : data
        setDocumentation(filteredDocs)
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
    const now = new Date()

   const docData: Omit<Documentation, "id"> = {
  title: formData.title || "",
  description: formData.description || "",
  date: formData.date ? new Date(formData.date) : now,
  location: formData.location || "",
  participants: formData.participants || "",
  ekskulType: getFilterEkskulType() || "robotik",
  photoUrls: uploadResults.map((result) => result.secure_url || result.url || ""),
  image: uploadResults[0]?.secure_url || uploadResults[0]?.url || "",
  createdBy: user.id,
  createdAt: now,
  updatedAt: now,
}


    if (editingDoc) {
      await documentationOperations.update(editingDoc.id, { ...docData, updatedAt: new Date() })
      console.log("Dokumentasi berhasil diperbarui!")
    } else {
      await documentationOperations.create(docData)
      console.log("Dokumentasi baru berhasil ditambahkan!")
    }

    setIsDialogOpen(false)
    resetForm()
  } catch (error) {
    console.error("Error saving documentation:", error)
    setError("Gagal menyimpan dokumentasi. Silakan coba lagi.")
  } finally {
    setLoading(false)
  }
}

const handleEdit = (doc: Documentation) => {
  setEditingDoc(doc)
  setFormData({
    title: doc.title || "",
    description: doc.description || "",
    date: doc.date && !isNaN(new Date(doc.date).getTime())
          ? new Date(doc.date).toISOString().split("T")[0]
          : "",
    location: doc.location || "",
    participants: doc.participants || "",
    category: (doc as any).category || "training",
  })
  setUploadResults((doc.photoUrls || []).map((url) => ({ url, secure_url: url })))
  setIsDialogOpen(true)
}



  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
      try {
        await documentationOperations.delete(id)
        alert("Dokumentasi berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting documentation:", error)
        alert("Gagal menghapus dokumentasi. Silakan coba lagi.")
      }
    }
  }

  const resetForm = () => {
  setFormData({
    title: "",
    description: "",
    date: "",
    location: "",
    participants: "",
    category: "training",
  })
  setUploadResults([])
  setEditingDoc(null)
}


  if (loading && documentation.length === 0) {
    return <LoadingSpinner size="lg" text="Memuat dokumentasi..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dokumentasi Kegiatan</h2>
          <p className="text-muted-foreground">Kelola dokumentasi dan foto kegiatan</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Dokumentasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDoc ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Kegiatan *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Latihan Rutin Robotik"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi detail tentang kegiatan..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Tanggal Kegiatan *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategori</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="training">Latihan</option>
                    <option value="competition">Kompetisi</option>
                    <option value="event">Event</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Lab Komputer"
                  />
                </div>
                <div>
                  <Label htmlFor="participants">Peserta</Label>
                  <Input
                    id="participants"
                    value={formData.participants}
                    onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                    placeholder="Semua anggota"
                  />
                </div>
              </div>

              <div>
                <Label>Foto Kegiatan</Label>
                <CloudinaryUpload
                  onUploadComplete={(results) => {
                    console.log("Upload results:", results)
                    setUploadResults(results)
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error)
                    setError(error)
                  }}
                  folder="ekskul/documentation"
                  multiple={true}
                  maxFiles={10}
                  accept="image/*"
                />
                {uploadResults.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {uploadResults.map((result, index) => (
                      <img
                        key={index}
                        src={result.secure_url || result.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Menyimpan..." : editingDoc ? "Update Dokumentasi" : "Tambah Dokumentasi"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentation.map((doc) => (
          <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
              {doc.image || doc.photoUrls?.[0] ? (
                <img
                  src={doc.image || doc.photoUrls?.[0] || "/placeholder.svg"}
                  alt={doc.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{doc.title}</h3>
                <Badge variant="outline">{(doc as any).category || "training"}</Badge>
              </div>

              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{doc.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(doc.date).toLocaleDateString("id-ID")}</span>
                </div>
                {doc.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{doc.location}</span>
                  </div>
                )}
                {doc.participants && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="line-clamp-1">{doc.participants}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground">{doc.photoUrls?.length || 0} foto</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(doc)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {documentation.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Belum Ada Dokumentasi</h3>
            <p className="text-muted-foreground">Tambahkan dokumentasi kegiatan pertama Anda</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
