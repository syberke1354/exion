"use client"

import { GraduationCap, Target, Users, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Visi",
      description:
        "Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, berprestasi, dan siap menghadapi tantangan global.",
    },
    {
      icon: GraduationCap,
      title: "Misi",
      description:
        "Menyelenggarakan Sekolah Menengah Kejuruan (SMK) yang berkualitas",
    },
    {
      icon: Users,
      title: "Nilai",
      description:
        "Melahirkan lulusan yang berkarakter unggul siap kerja",
    },
    {
      icon: Award,
      title: "Tujuan",
      description:
        "Mewujudkan generasi SDM yang berdaya saing global.",
    },
  ]

  const achievements = [
    "Juara 1 Kompetisi Robotik Nasional 2023",
    "Juara 2 Festival Musik Pelajar Provinsi",
    "Juara 3 Kejuaraan Futsal Antar SMA",
    "Penghargaan Sekolah Adiwiyata Nasional",
    "Akreditasi A untuk Semua Program",
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
            Tentang <span className="text-blue-600">SMK TI BAZMA</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sekolah yang berkomitmen mengembangkan potensi siswa melalui pendidikan berkualitas dan kegiatan
            ekstrakurikuler yang beragam dan berprestasi.
          </p>
        </div>

        {/* School Image */}
        <div className="mb-16">
          <img
            src="/banner.avif"
            alt="SMK TI BAZMA"
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="text-center h-full">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="font-heading font-bold text-3xl mb-6">Sejarah Singkat</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                SMK TI BAZMA didirikan pada tahun 1985 dengan visi menjadi institusi pendidikan yang unggul dalam
                mengembangkan potensi akademik dan non-akademik siswa.
              </p>
              <p>
                Selama lebih dari 35 tahun, sekolah kami telah menghasilkan ribuan lulusan yang sukses di berbagai
                bidang, mulai dari akademisi, profesional, hingga wirausahawan yang berkontribusi bagi bangsa.
              </p>
              <p>
                Program ekstrakurikuler kami dimulai sejak tahun 1990 dan terus berkembang menjadi salah satu keunggulan
                sekolah dalam membentuk karakter dan bakat siswa.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-3xl mb-6">Prestasi Terkini</h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 lg:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl mb-4">SMK TI BAZMA dalam Angka</h2>
            <p className="text-blue-100">Data statistik sekolah kami</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Siswa Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">85+</div>
              <div className="text-blue-100">Tenaga Pengajar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12+</div>
              <div className="text-blue-100">Ekstrakurikuler</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Tingkat Kelulusan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
