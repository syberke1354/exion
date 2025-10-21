"use client"

import { useState, useEffect } from "react"
import { Camera, Calendar, MapPin, Users, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDocumentation } from "@/lib/firebase-service"
import type { Documentation } from "@/types"

export default function DocumentationGalleryPage() {
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<Documentation | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const docs = await getDocumentation()
        setDocumentation(docs)
      } catch (error) {
        console.error("Error loading documentation:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const ekskulTypes = [
    { id: "all", label: "Semua Kegiatan" },
    { id: "robotik", label: "Robotik" },
    { id: "futsal", label: "Futsal" },
    { id: "musik", label: "Musik" },
    { id: "silat", label: "Pencak Silat" },
    { id: "hadroh", label: "Hadroh" },
    { id: "qori", label: "Qori" },
    { id: "pramuka", label: "Pramuka" },
    { id: "paskib", label: "Paskibra" },
  ]

  const filteredDocs = filter === "all"
    ? documentation
    : documentation.filter(doc => doc.ekskulType === filter)

  const handleImageClick = (doc: Documentation) => {
    setSelectedImage(doc)
    setCurrentImageIndex(0)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
    setCurrentImageIndex(0)
  }

  const handlePrevDocImage = () => {
    if (!selectedImage) return
    const images = selectedImage.photoUrls || [selectedImage.image].filter(Boolean) as string[]
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextDocImage = () => {
    if (!selectedImage) return
    const images = selectedImage.photoUrls || [selectedImage.image].filter(Boolean) as string[]
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handlePrevImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredDocs.findIndex(doc => doc.id === selectedImage.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredDocs.length - 1
    setSelectedImage(filteredDocs[prevIndex])
  }

  const handleNextImage = () => {
    if (!selectedImage) return
    const currentIndex = filteredDocs.findIndex(doc => doc.id === selectedImage.id)
    const nextIndex = currentIndex < filteredDocs.length - 1 ? currentIndex + 1 : 0
    setSelectedImage(filteredDocs[nextIndex])
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat dokumentasi...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Galeri Dokumentasi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Momen berharga dan kegiatan ekstrakurikuler SMK TI Bazma dalam gambar
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ekskulTypes.map((type) => (
            <Badge
              key={type.id}
              variant={filter === type.id ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setFilter(type.id)}
            >
              {type.label}
            </Badge>
          ))}
        </div>

        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocs.map((doc) => (
              <Card
                key={doc.id}
                className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => handleImageClick(doc)}
              >
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                  {doc.image ? (
                    <>
                      <img
                        src={doc.image}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </>
                  ) : (
                    <Camera className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2 line-clamp-2">{doc.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(doc.date).toLocaleDateString("id-ID")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Belum ada dokumentasi untuk kategori ini</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={handleCloseModal}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handlePrevImage()
            }}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handleNextImage()
            }}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative">
                {(() => {
                  const images = selectedImage.photoUrls || [selectedImage.image].filter(Boolean) as string[]
                  const currentImage = images[currentImageIndex]

                  return currentImage ? (
                    <>
                      <img
                        src={currentImage}
                        alt={selectedImage.title}
                        className="w-full h-full object-contain"
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePrevDocImage()
                            }}
                          >
                            <ChevronLeft className="w-6 h-6 text-white" />
                          </button>
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleNextDocImage()
                            }}
                          >
                            <ChevronRight className="w-6 h-6 text-white" />
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <Camera className="w-24 h-24 text-muted-foreground" />
                  )
                })()}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{selectedImage.title}</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  
                     {selectedImage.location && (
                    <div className="flex items-center gap-2  text-sm">
                       {selectedImage.participants && (
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary " />
                      <span>{selectedImage.participants}</span>
                    </div>
                  )}
                        <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(selectedImage.date).toLocaleDateString("id-ID", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{selectedImage.location}</span>
                    </div>
                  )}
                 
                  {selectedImage.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                  
                  </div>
               
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
