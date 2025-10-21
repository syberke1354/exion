"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Users, Calendar, Award, Camera, Clock, MapPin, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMembers, getDocumentation, getAchievements, getSchedules } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement, Schedule } from "@/types"

const getDateFromFirestore = (date: any): Date => {
  if (!date) return new Date()


  if (date instanceof Date) return date


  if (date && typeof date.toDate === "function") {
    try {
      return date.toDate()
    } catch (error) {
      console.error("Error converting Firestore timestamp:", error)
      return new Date()
    }
  }


  try {
    return new Date(date)
  } catch (error) {
    console.error("Error parsing date:", error)
    return new Date()
  }
}

export default function RobotikPage({ onNavigate }) 
 {
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
          getMembers("robotik"),
          getDocumentation("robotik"),
          getAchievements("robotik"),
          getSchedules("robotik"),
        ])

        setMembers(membersData)
        setActivities(activitiesData)
        setAchievements(achievementsData)
        setSchedule(scheduleData)
      } catch (error) {
        console.error("Error loading robotik data:", error)
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
          <span className="text-muted-foreground">Memuat data robotik...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
         <Button
  variant="ghost"
  className="mb-4"
  onClick={() => onNavigate("extracurriculars")}
>
  <ArrowLeft className="w-4 h-4 mr-2" />
  Kembali
</Button>


          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="text-6xl">🤖</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Ekstrakurikuler Robotik
                </h1>
                <p className="text-blue-100 text-lg">
                  Programming, Elektronik, dan Artificial Intelligence
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tentang Ekstrakurikuler Robotik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Ekstrakurikuler Robotik adalah wadah bagi siswa untuk
                  mempelajari teknologi robotika, pemrograman, dan elektronik.
                  Kami fokus pada pengembangan keterampilan STEM melalui
                  proyek-proyek praktis dan kompetisi robotika tingkat regional
                  hingga nasional.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
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
                    <div className="text-2xl font-bold text-purple-600">
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

            {/* Members Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Pengurus & Anggota
                </CardTitle>
              </CardHeader>
              <CardContent>
                {members.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-4 bg-muted rounded-lg"
                      >
                        <img
                          src={
                            member.photoUrl ||
                            "/placeholder.svg?height=40&width=40&query=student avatar"
                          }
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {member.class} -
                            {member.role}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {member.status === "active" ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Belum ada anggota terdaftar
                    </p>
                  </div>
                )}
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
                {activities.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-muted rounded-lg overflow-hidden"
                      >
                        <img
                          src={
                            activity.image ||
                            "/placeholder.svg?height=200&width=300&query=robotics activity"
                          }
                          alt={activity.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {getDateFromFirestore(
                                  activity.date
                                ).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{activity.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Belum ada dokumentasi kegiatan
                    </p>
                  </div>
                )}
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
                  Jadwal Kegiatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schedule.length > 0 ? (
                  <div className="space-y-3">
                    {schedule.map((item) => (
                      <div key={item.id} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {getDateFromFirestore(item.date).toLocaleDateString(
                            "id-ID",
                            { weekday: "long" }
                          )}
                          , {(item as any).time || "15:30-17:30"}
                        </div>

                        {item.location && (
                          <div className="text-xs text-muted-foreground">
                            📍 {item.location}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Selasa & Kamis, 15:30-17:30
                    </p>
                  </div>
                )}
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
                <p className="text-muted-foreground">
                  Lab Komputer & Lab Robotik
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Lantai 2, Gedung Utama
                </p>
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
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border"
                      >
                        <div className="font-semibold text-sm">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{achievement.level}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {getDateFromFirestore(
                              achievement.date
                            ).getFullYear()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Award className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Belum ada prestasi
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Pembina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">Pak Ahmad Teknologi</p>
                  <p className="text-sm text-muted-foreground">
                    Guru Informatika
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📞 0812-3456-7890
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✉️ ahmad.tech@sman1.sch.id
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
