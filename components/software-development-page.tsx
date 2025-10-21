"use client"

import { useState, useEffect } from "react"
import { Code, Users, Trophy, BookOpen, Calendar, ArrowRight, Github, Laptop, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getMembers, getDocumentation, getAchievements } from "@/lib/firebase-service"
import type { Member, Documentation, Achievement } from "@/types"
import LoadingSpinner from "./loading-spinner"

export default function SoftwareDevelopmentPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [documentation, setDocumentation] = useState<Documentation[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersData, docsData, achievementsData] = await Promise.all([
          getMembers("software_dev"),
          getDocumentation("software_dev"),
          getAchievements("software_dev"),
        ])

        setMembers(membersData)
        setDocumentation(docsData)
        setAchievements(achievementsData)
      } catch (error) {
        console.error("Error loading software development data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30">
              <Code className="w-3 h-3 mr-1" />
              Ekstrakurikuler Teknologi
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Software Development
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Belajar membuat aplikasi web dan mobile dengan teknologi terkini. Dari pemula hingga mahir dalam coding,
              desain UI/UX, dan pengembangan proyek nyata.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Daftar Sekarang
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Github className="mr-2 w-4 h-4" />
                Lihat Proyek
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-blue-500/20 hover:border-blue-500/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Web Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Belajar HTML, CSS, JavaScript, React, Next.js, dan teknologi web modern lainnya.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4">
                  <Laptop className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Mobile Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Membuat aplikasi Android dan iOS dengan React Native dan Flutter.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-500/20 hover:border-teal-500/40 transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Backend & Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menguasai Node.js, Express, Firebase, dan sistem database modern.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Apa yang Akan Dipelajari
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kurikulum lengkap dari dasar hingga mahir dalam pengembangan software
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Pemrograman Dasar</h3>
                    <p className="text-sm text-muted-foreground">
                      Logika pemrograman, algoritma, dan struktur data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Frontend Development</h3>
                    <p className="text-sm text-muted-foreground">
                      HTML, CSS, JavaScript, React, dan UI/UX Design
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-600 dark:text-teal-400 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Backend Development</h3>
                    <p className="text-sm text-muted-foreground">
                      Node.js, API, Database, dan Server Management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Version Control</h3>
                    <p className="text-sm text-muted-foreground">
                      Git, GitHub, dan kolaborasi tim developer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-violet-600 dark:text-violet-400 font-bold">5</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Project Development</h3>
                    <p className="text-sm text-muted-foreground">
                      Membuat aplikasi nyata dari konsep hingga deployment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 dark:text-pink-400 font-bold">6</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Career Skills</h3>
                    <p className="text-sm text-muted-foreground">
                      Portfolio building, interview skills, dan networking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {achievements.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Prestasi & Pencapaian
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Karya dan penghargaan yang diraih siswa Software Development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <Badge variant="outline">{achievement.level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(achievement.date).toLocaleDateString("id-ID")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {documentation.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Dokumentasi Kegiatan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Momen berharga dari proses belajar dan berkarya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {documentation.map((doc) => (
                <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-all">
                  {doc.imageUrl && (
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      <img
                        src={doc.imageUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(doc.date).toLocaleDateString("id-ID")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {members.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Developer Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Siswa berbakat yang sedang belajar dan berkarya
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {members.map((member) => (
                <Card key={member.id} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.class}</p>
                    {member.position && (
                      <Badge variant="outline" className="mt-2">
                        {member.position}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Siap Menjadi Developer Handal?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Bergabunglah dengan komunitas developer muda yang bersemangat belajar dan berkarya.
              Mulai perjalananmu menguasai teknologi masa depan.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Daftar Sekarang
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
