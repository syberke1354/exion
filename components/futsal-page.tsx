"use client"

import { ArrowLeft, Users, Calendar, Award, Camera, Clock, MapPin, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FutsalPage({ onNavigate }) {
  const members = [
    {
      name: "Rio Ferdinand",
      role: "Kapten",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      position: "Defender",
      class: "XI IPA 1",
    },
    {
      name: "Maya Sari",
      role: "Wakil Kapten",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      position: "Midfielder",
      class: "XI IPA 2",
    },
    {
      name: "Eko Prasetyo",
      role: "Striker",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      position: "Forward",
      class: "X IPA 1",
    },
    {
      name: "Dina Marlina",
      role: "Kiper",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      position: "Goalkeeper",
      class: "X IPA 3",
    },
    {
      name: "Arif Budiman",
      role: "Anggota",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg",
      position: "Midfielder",
      class: "XI IPA 3",
    },
    {
      name: "Sari Indah",
      role: "Anggota",
      avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
      position: "Forward",
      class: "X IPA 2",
    },
  ]

  const activities = [
    {
      id: 1,
      title: "Pertandingan Persahabatan",
      date: "2024-01-12",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      description: "Pertandingan melawan tim futsal dari SMA Negeri 2 dengan skor 3-2",
      participants: 22,
    },
    {
      id: 2,
      title: "Latihan Teknik Dasar",
      date: "2024-01-08",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      description: "Latihan passing, dribbling, dan shooting untuk meningkatkan skill individu",
      participants: 28,
    },
    {
      id: 3,
      title: "Turnamen Internal",
      date: "2024-01-05",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      description: "Turnamen antar kelas untuk seleksi tim inti dan cadangan",
      participants: 45,
    },
  ]

  const achievements = [
    {
      title: "Juara 3 Kejuaraan Futsal Antar SMA",
      level: "Regional",
      year: "2023",
      description: "Kompetisi futsal tingkat Jawa Barat",
    },
    {
      title: "Juara 2 Liga Futsal Pelajar",
      level: "Kota",
      year: "2023",
      description: "Liga futsal tingkat kota Bandung",
    },
    {
      title: "Fair Play Award",
      level: "Regional",
      year: "2022",
      description: "Penghargaan tim paling sportif",
    },
  ]

  const schedule = [
    { day: "Senin", time: "16:00 - 18:00", activity: "Latihan Teknik Individual" },
    { day: "Rabu", time: "16:00 - 18:00", activity: "Latihan Taktik Tim" },
    { day: "Sabtu", time: "14:00 - 16:00", activity: "Scrimmage & Pertandingan" },
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

          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="text-6xl">⚽</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Ekstrakurikuler Futsal</h1>
                <p className="text-green-100 text-lg">Olahraga Sepak Bola dalam Ruangan</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    32 Anggota
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
                  Tentang Ekstrakurikuler Futsal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Ekstrakurikuler Futsal mengembangkan kemampuan bermain sepak bola dalam ruangan dengan fokus pada
                  teknik, strategi, dan kerjasama tim. Kami berlatih secara rutin dan mengikuti berbagai kompetisi untuk
                  mengasah kemampuan dan sportivitas siswa.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">32</div>
                    <div className="text-sm text-muted-foreground">Anggota</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-muted-foreground">Pertandingan</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-muted-foreground">Kemenangan</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <div className="text-sm text-muted-foreground">Turnamen</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Tim Inti & Anggota
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
                          member.position === "Goalkeeper"
                            ? "default"
                            : member.position === "Defender"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {member.position}
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
                <p className="text-muted-foreground">Lapangan Futsal Sekolah</p>
                <p className="text-sm text-muted-foreground mt-2">Gedung Olahraga, Lantai 1</p>
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
                      className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border"
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
                <CardTitle>Kontak Pelatih</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Pak Budi Olahraga</p>
                  <p className="text-sm text-muted-foreground">Guru Penjasorkes</p>
                  <p className="text-sm text-muted-foreground">📞 0813-4567-8901</p>
                  <p className="text-sm text-muted-foreground">✉️ budi.sport@sman1.sch.id</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
