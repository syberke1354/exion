"use client"

import { ArrowLeft, Users, Calendar, Award, Camera, Clock, MapPin, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MusikPage({ onNavigate }) {
  const members = [
    { name: "Andi Mustofa", role: "Ketua", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg", instrument: "Gitar", class: "XI IPA 1" },
    {
      name: "Sari Melodi",
      role: "Wakil Ketua",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      instrument: "Vokal",
      class: "XI IPA 2",
    },
    {
      name: "Budi Harmoni",
      role: "Sekretaris",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      instrument: "Bass",
      class: "X IPA 1",
    },
    {
      name: "Maya Nada",
      role: "Bendahara",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      instrument: "Keyboard",
      class: "X IPA 3",
    },
    { name: "Doni Ritme", role: "Anggota", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg", instrument: "Drum", class: "XI IPA 3" },
    {
      name: "Lisa Akord",
      role: "Anggota",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      instrument: "Vokal",
      class: "X IPA 2",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Latihan Ensemble Band",
      date: "2024-01-10",
      image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg",
      description: "Persiapan untuk penampilan di acara sekolah bulan depan dengan repertoar lagu pop dan tradisional",
      participants: 15,
    },
    {
      id: 2,
      title: "Recording Session",
      date: "2024-01-05",
      image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg",
      description: "Merekam lagu original karya siswa untuk album ekstrakurikuler musik",
      participants: 8,
    },
    {
      id: 3,
      title: "Workshop Musik Tradisional",
      date: "2024-01-01",
      image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg",
      description: "Belajar alat musik tradisional Indonesia seperti angklung dan gamelan",
      participants: 20,
    },
  ]

  const achievements = [
    {
      title: "Juara 2 Festival Musik Pelajar Provinsi",
      level: "Provinsi",
      year: "2023",
      description: "Kategori band pop dengan lagu original",
    },
    {
      title: "Best Performance Award",
      level: "Regional",
      year: "2023",
      description: "Pentas seni tingkat regional",
    },
    {
      title: "Juara 1 Lomba Cipta Lagu",
      level: "Kota",
      year: "2022",
      description: "Kompetisi cipta lagu tingkat kota",
    },
  ]

  const schedule = [
    { day: "Rabu", time: "15:00 - 17:00", activity: "Latihan Ensemble & Band" },
    { day: "Jumat", time: "15:00 - 17:00", activity: "Latihan Vokal & Instrumen" },
    { day: "Sabtu", time: "09:00 - 12:00", activity: "Recording & Performance" },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4" onClick={() =>  onNavigate("extracurriculars")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="text-6xl">🎵</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Ekstrakurikuler Musik</h1>
                <p className="text-purple-100 text-lg">Bermain Alat Musik dan Bernyanyi</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    20 Anggota
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Award className="w-4 h-4 mr-1" />3 Prestasi
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tentang Ekstrakurikuler Musik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Ekstrakurikuler Musik adalah wadah bagi siswa untuk mengembangkan bakat bermusik, baik dalam bermain
                  alat musik maupun bernyanyi. Kami fokus pada pembelajaran ensemble, teknik bermusik, dan penampilan di
                  berbagai acara sekolah serta kompetisi musik tingkat regional.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">20</div>
                    <div className="text-sm text-muted-foreground">Anggota</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">8</div>
                    <div className="text-sm text-muted-foreground">Alat Musik</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15</div>
                    <div className="text-sm text-muted-foreground">Lagu</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">6</div>
                    <div className="text-sm text-muted-foreground">Penampilan</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Band Inti & Anggota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                      <img
                        src={member.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.role} • {member.class}
                        </div>
                      </div>
                      <Badge
                        variant={
                          member.instrument === "Vokal"
                            ? "default"
                            : member.instrument === "Gitar"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {member.instrument}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activities Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Dokumentasi Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-muted rounded-lg overflow-hidden">
                      <img
                        src={activity.image || "/placeholder.svg?height=200&width=300"}
                        alt={activity.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(activity.date).toLocaleDateString("id-ID")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{activity.participants} peserta</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Jadwal Latihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <div className="font-medium text-sm">{item.activity}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.day}, {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Studio Musik Sekolah</p>
                <p className="text-sm text-muted-foreground mt-2">Gedung Seni, Lantai 2</p>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Prestasi Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border"
                    >
                      <div className="font-semibold text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">{achievement.level}</Badge>
                        <span className="text-xs text-muted-foreground">{achievement.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Pembina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Bu Sari Musik</p>
                  <p className="text-sm text-muted-foreground">Guru Seni Budaya</p>
                  <p className="text-sm text-muted-foreground">📞 0814-5678-9012</p>
                  <p className="text-sm text-muted-foreground">✉️ sari.musik@sman1.sch.id</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
