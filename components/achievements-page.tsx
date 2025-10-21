"use client"

import { useState, useEffect } from "react"
import { Trophy, Medal, Award, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAchievements } from "@/lib/firebase-service"
import type { Achievement } from "@/types"

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true)
        const data = await getAchievements()
        setAchievements(data)
      } catch (error) {
        console.error("Error loading achievements:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAchievements()
  }, [])

  const stats = [
    { icon: Trophy, label: "Total Prestasi", value: achievements.length.toString(), color: "text-yellow-600" },
    {
      icon: Medal,
      label: "Medali Emas",
      value: achievements.filter((a) => a.level === "Nasional").length.toString(),
      color: "text-yellow-500",
    },
    {
      icon: Award,
      label: "Penghargaan",
      value: achievements.filter((a) => a.ekskulType).length.toString(), 
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      label: "Tahun Aktif",
      value:
        new Set(
          achievements
            .map((a) => {
              const date = new Date(a.date)
              return date.getFullYear()
            })
            .filter((year) => !isNaN(year)),
        ).size.toString() + "+",
      color: "text-green-600",
    },
  ]

  const levelColors = {
    Nasional: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Provinsi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Sekolah: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Internasional: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  }

  const getEkskulColor = (ekskulType: string) => {
    switch (ekskulType) {
      case "robotik":
        return "from-yellow-400 to-orange-500"
      case "silat":
        return "from-red-500 to-orange-500"
      case "futsal":
        return "from-green-500 to-emerald-500"
      case "band":
        return "from-purple-500 to-pink-500"
      case "hadroh":
        return "from-emerald-500 to-teal-500"
      case "qori":
        return "from-indigo-500 to-purple-500"
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat prestasi...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
            Prestasi <span className="text-blue-600">SMK TI Bazma</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kebanggaan kami atas pencapaian luar biasa siswa-siswi dalam berbagai kompetisi dan kejuaraan tingkat daerah
            hingga nasional.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={achievement.image || achievement.photoUrl || "/placeholder.svg?height=200&width=300"}
                    alt={achievement.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div
                    className={`absolute top-4 left-4 bg-gradient-to-r ${getEkskulColor(
                      achievement.ekskulType,
                    )} px-4 py-1.5 rounded-full shadow-lg`}
                  >
                    <span className="text-white font-semibold text-sm capitalize">{achievement.ekskulType}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${levelColors[achievement.level as keyof typeof levelColors] || levelColors.Sekolah} shadow-lg`}
                    >
                      {achievement.level}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <h3 className="font-bold text-lg leading-tight flex-grow group-hover:text-primary transition-colors">
                      {achievement.title}
                    </h3>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {(() => {
                        try {
                          const date = new Date(achievement.date)
                          return date.getFullYear()
                        } catch {
                          return "N/A"
                        }
                      })()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {(() => {
                          try {
                            const date = new Date(achievement.date)
                            return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" })
                          } catch {
                            return "N/A"
                          }
                        })()}
                      </span>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {achievement.ekskulType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Prestasi</h3>
            <p className="text-muted-foreground">Prestasi akan ditampilkan di sini setelah ditambahkan oleh admin</p>
          </div>
        )}

        {/* Achievement Timeline */}
        {achievements.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading font-bold text-3xl text-center mb-12">Timeline Prestasi</h2>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                {achievements.slice(0, 4).map((achievement) => (
                  <div key={achievement.id} className="relative flex items-start mb-8">
                    <div className="absolute left-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-background"></div>
                    <div className="ml-12">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {(() => {
                            try {
                              const date = new Date(achievement.date)
                              return date.getFullYear()
                            } catch {
                              return "N/A"
                            }
                          })()}
                        </Badge>
                        <Badge
                          className={levelColors[achievement.level as keyof typeof levelColors] || levelColors.Sekolah}
                        >
                          {achievement.level}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
