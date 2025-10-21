"use client"

import { ArrowRight, Users, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExtracurricularsPageProps {
  onNavigate: (section: string) => void
}

export default function ExtracurricularsPage({ onNavigate }: ExtracurricularsPageProps) {
  const extracurriculars = [
    {
      id: "robotik",
      name: "Robotik",
      category: "Teknologi",
      description:
        "Pelajari teknologi robotika, pemrograman Arduino, dan IoT. Ikuti kompetisi robotik tingkat nasional dan internasional.",
      image: "/IoT.webp",
      members: 24,
      schedule: "Selasa & Kamis, 15:30-17:30",
      location: "Lab Komputer",
      achievements: ["Juara 1 Kompetisi Robotik Nasional 2023", "Juara 3 Robot Sumo Regional"],
      color: "from-blue-500 to-cyan-400",
      icon: "🤖",
    },
    {
      id: "futsal",
      name: "Futsal",
      category: "Olahraga",
      description:
        "Olahraga tim yang mengasah kerjasama, strategi, dan kebugaran fisik. Berlatih teknik dasar hingga advanced.",
      image: "/futsal.webp",
      members: 32,
      schedule: "Senin & Rabu, 16:00-18:00",
      location: "Lapangan Futsal",
      achievements: ["Juara 3 Kejuaraan Futsal Antar SMA", "Juara 2 Liga Futsal Pelajar"],
      color: "from-green-500 to-emerald-400",
      icon: "⚽",
    },
    {
      id: "musik",
      name: "Musik",
      category: "Seni",
      description:
        "Ekspresikan kreativitas melalui musik. Belajar berbagai alat musik dan tampil di berbagai acara sekolah.",
      image: "/musik.jpeg",
      members: 20,
      schedule: "Rabu & Jumat, 15:00-17:00",
      location: "Studio Musik",
      achievements: ["Juara 2 Festival Musik Pelajar Provinsi", "Best Performance Award 2023"],
      color: "from-purple-500 to-pink-400",
      icon: "🎵",
    },
    {
      id: "silat",
      name: "Pencak Silat",
      category: "Bela Diri",
      description:
        "Seni bela diri tradisional Indonesia yang mengajarkan disiplin, karakter, dan teknik pertahanan diri.",
      image: "/silat.webp",
      members: 18,
      schedule: "Selasa & Kamis, 16:00-18:00",
      location: "Aula Sekolah",
      achievements: ["Juara 1 Kejuaraan Pencak Silat Pelajar", "Medali Emas Porda 2023"],
      color: "from-red-500 to-orange-400",
      icon: "🥋",
    },
    {
      id: "hadroh",
      name: "Hadroh",
      category: "Seni Islami",
      description:
        "Seni musik Islami yang memadukan dakwah dan keindahan. Belajar bermain rebana dan vokal Islami.",
      image: "/hadroh.jpeg",
      members: 22,
      schedule: "Jumat & Minggu, 15:00-17:00",
      location: "Masjid Sekolah",
      achievements: ["Juara 1 Festival Hadroh Provinsi", "Best Performance Islamic Festival"],
      color: "from-emerald-500 to-teal-400",
      icon: "🎵",
    },
    {
      id: "qori",
      name: "Qori",
      category: "Tilawah",
      description:
        "Seni baca Al-Quran dengan tartil dan indah. Persiapan untuk kompetisi MTQ dan festival tilawah.",
      image: "https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg",
      members: 16,
      schedule: "Rabu & Sabtu, 16:00-18:00",
      location: "Masjid Sekolah",
      achievements: ["Juara 2 MTQ Tingkat Provinsi", "Harapan 1 Festival Tilawah"],
      color: "from-indigo-500 to-purple-400",
      icon: "📖",
    },
    {
      id: "pramuka",
      name: "Pramuka",
      category: "Kepanduan",
      description: "Kegiatan kepanduan yang mengembangkan karakter, kepemimpinan, dan kecintaan terhadap alam.",
      image: "/pramuka.webp",
      members: 45,
      schedule: "Sabtu, 08:00-12:00",
      location: "Lapangan Sekolah",
      achievements: ["Juara Umum Jambore Daerah", "Penghargaan Gugus Depan Terbaik"],
      color: "from-amber-500 to-orange-500",
      icon: "🏕️",
    },
    {
      id: "paskib",
      name: "Paskibra",
      category: "Kepanduan",
      description: "Pasukan Pengibar Bendera Pusaka yang melatih kedisiplinan, kekompakan, dan nasionalisme.",
      image: "/paskib.jpeg",
      members: 28,
      schedule: "Senin & Kamis, 15:00-17:00",
      location: "Lapangan Upacara",
      achievements: ["Juara 1 LKBB Tingkat Kota", "Best Marching Team Award"],
      color: "from-red-500 to-rose-500",
      icon: "🎖️",
    },
  ]

  const categories = ["Semua", "Teknologi", "Olahraga", "Seni", "Bela Diri", "Seni Islami", "Tilawah", "Kepanduan"]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
            Ekstrakurikuler <span className="text-blue-600">SMK TI BAZMA</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Temukan passion Anda dan kembangkan talenta melalui berbagai kegiatan ekstrakurikuler yang kami tawarkan.
            Setiap kegiatan dirancang untuk mengasah kemampuan dan karakter siswa.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Extracurriculars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {extracurriculars.map((ekskul) => (
            <Card
              key={ekskul.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              onClick={() => onNavigate(ekskul.id)}
            >
              <div className="relative h-48 flex-shrink-0">
                <img
                  src={ekskul.image || "/placeholder.svg"}
                  alt={ekskul.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${ekskul.color} px-3 py-1 rounded-full shadow-lg`}>
                  <span className="text-white font-semibold text-sm">{ekskul.category}</span>
                </div>
                <div className="absolute top-4 right-4 text-3xl drop-shadow-lg">{ekskul.icon}</div>
              </div>

              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="font-semibold text-xl mb-2">{ekskul.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">{ekskul.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{ekskul.members} anggota aktif</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{ekskul.schedule}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{ekskul.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t mt-auto">
                  <Badge variant="secondary" className="text-xs">
                    {ekskul.achievements.length} prestasi
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h2 className="font-heading font-bold text-3xl mb-4 text-gray-900">Tertarik Bergabung?</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut tentang pendaftaran ekstrakurikuler dan jadwal kegiatan
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("contact")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg"
          >
            Hubungi Kami
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
