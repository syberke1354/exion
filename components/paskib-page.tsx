"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Users, Calendar, Award, Camera, Clock, MapPin, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMembers, getDocumentation, getAchievements, getSchedules } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement, Schedule } from "@/types"

export default function PaskibPage({ onNavigate }) {
  const [members, setMembers] = useState<Member[]>([])
  const [activities, setActivities] = useState<Documentation[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [schedule, setSchedule] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [membersData, activitiesData, achievementsData, scheduleData] = await Promise.all([
          getMembers("paskib"),
          getDocumentation("paskib"),
          getAchievements("paskib"),
          getSchedules("paskib"),
        ])

        setMembers(membersData)
        setActivities(activitiesData)
        setAchievements(achievementsData)
        setSchedule(scheduleData)
      } catch (error) {
        console.error("Error loading paskib data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat data paskib...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => onNavigate("extracurriculars")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="bg-gradient-to-r from-red-600 to-rose-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="text-6xl">🎖️</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Ekstrakurikuler Paskibra
                </h1>
                <p className="text-red-100 text-lg">
                  Pasukan Pengibar Bendera Pusaka
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    {members.length} Anggota
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Award className="w-4 h-4 mr-1" />
                    {achievements.length} Prestasi
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tentang Ekstrakurikuler Paskibra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Pasukan Pengibar Bendera Pusaka (Paskibra) adalah kelompok siswa
                  terpilih yang bertugas mengibarkan bendera merah putih pada upacara
                  bendera. Kegiatan ini melatih disiplin, kekompakan, ketangkasan,
                  dan rasa nasionalisme melalui latihan baris-berbaris dan prosedur
                  pengibaran bendera yang khidmat.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {members.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Anggota</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {activities.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Kegiatan
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {achievements.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Prestasi
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {schedule.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Jadwal</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Anggota Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.position || "Anggota"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada data anggota
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Dokumentasi Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          {activity.image ? (
                            <img
                              src={activity.image}
                              alt={activity.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Camera className="w-12 h-12 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {activity.description}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(activity.date).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada dokumentasi kegiatan
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Prestasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{achievement.level}</span>
                            <span>•</span>
                            <span>
                              {new Date(achievement.date).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada prestasi tercatat
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Jadwal Latihan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schedule.length > 0 ? (
                  <div className="space-y-4">
                    {schedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg bg-muted space-y-2"
                      >
                        <div className="font-semibold">{item.title}</div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {item.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {item.location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Belum ada jadwal tersedia
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-semibold mb-1">Pembina</div>
                  <div className="text-sm text-muted-foreground">
                    Hubungi admin untuk informasi lebih lanjut
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Jadwal</div>
                  <div className="text-sm text-muted-foreground">
                    Senin & Kamis, 15:00 - 17:00
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Lokasi</div>
                  <div className="text-sm text-muted-foreground">
                    Lapangan Upacara
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
