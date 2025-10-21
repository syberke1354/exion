  "use client"
  import {
    ArrowRight,
    Users,
    Trophy,
    Calendar,
    Star,
    Camera,
    MapPin,
    BookOpen,
    ChevronRight,
    Target,
    Zap,
    Shield,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent } from "@/components/ui/card"
  import { useEffect, useState } from "react"
  import { ScrollRevealText, ParallaxSection, AnimatedCard } from "./advanced-animations"
  import { Documentation, Member } from "@/types"


  interface HomePageProps {
    onNavigate: (section: string) => void
    dokumentasi?: Documentation[]
    members?: Member[]
  }

  export default function HomePage({ onNavigate, dokumentasi = [], members = [] }: HomePageProps) {
    const [activeEkskul, setActiveEkskul] = useState<string | null>(null)
    const [scrollY, setScrollY] = useState(0)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY)
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])
const headerImages = [
  { 
    src: "/IoT.webp", 
    alt: "Siswa Robotik", 
    title: "Program Robotik", 
    description: "Mengembangkan teknologi masa depan dengan kreativitas dan inovasi." 
  },
  { 
    src: "/silat.webp", 
    alt: "Pencak Silat", 
    title: "Pencak Silat", 
    description: "Melestarikan budaya Indonesia sekaligus melatih disiplin dan ketangkasan." 
  },
  { 
    src: "/futsal.webp", 
    alt: "Futsal", 
    title: "Futsal", 
    description: "Membangun kerja sama tim dan sportivitas di lapangan." 
  },
  { 
    src: "/musik.jpeg", 
    alt: "Musik", 
    title: "Musik", 
    description: "Mengekspresikan kreativitas dan jiwa seni melalui nada dan irama." 
  },
  { 
    src: "/hadroh.jpeg", 
    alt: "Hadroh", 
    title: "Hadroh", 
    description: "Menguatkan spiritualitas melalui seni musik islami." 
  },
  { 
    src: "/pramuka.webp", 
    alt: "Pramuka", 
    title: "Pramuka", 
    description: "Melatih kemandirian, kepemimpinan, dan kebersamaan dalam kegiatan kepramukaan." 
  },
  { 
    src: "/paskib.jpeg", 
    alt: "Paskibra", 
    title: "Paskibra", 
    description: "Menanamkan jiwa nasionalisme dan kedisiplinan melalui baris-berbaris." 
  },
  { 
    src: "/pramuka.webp", 
    alt: "Coding", 
    title: "Coding Club", 
    description: "Mengasah kemampuan logika dan pemrograman untuk menghadapi era digital." 
  },
  { 
    src: "/pramuka.webp", 
    alt: "Qori", 
    title: "Qori", 
    description: "Meningkatkan keindahan tilawah Al-Qur'an dengan suara merdu." 
  },
]

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % headerImages.length) 
  }, 5000)
  return () => clearInterval(interval)
}, [headerImages.length])


    const featuredExtracurriculars = [
      {
        id: "robotik",
        name: "Robotik",
        description: "Build and innovate—where creativity meets technology",
        image: "/IoT.webp",
        members: members.filter((m) => m.ekskulType === "robotik").length || 24,
        achievements: 12,
        category: "STEM",
        level: "Advanced",
        icon: "🤖",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
      },
      {
        id: "futsal",
        name: "Futsal",
        description: "Teamwork and agility—score your goals together",
        image: "/futsal.webp",
        members: members.filter((m) => m.ekskulType === "futsal").length || 32,
        achievements: 8,
        category: "Olahraga",
        level: "Competitive",
        icon: "⚽",
        color: "text-orange-400",
        bgColor: "bg-orange-400/10",
      },
      {
        id: "musik",
        name: "Musik",
        description: "Express yourself—let the rhythm guide you",
        image: "/musik.jpeg",
        members: members.filter((m) => m.ekskulType === "musik").length || 20,
        achievements: 15,
        category: "Seni",
        level: "Creative",
        icon: "🎵",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
      },
      {
        id: "silat",
        name: "Pencak Silat",
        description: "Discipline and strength—master your mind and body",
        image: "/silat.webp",
        members: members.filter((m) => m.ekskulType === "silat").length || 18,
        achievements: 10,
        category: "Budaya",
        level: "Traditional",
        icon: "🥋",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
      },
      {
        id: "hadroh",
        name: "Hadroh",
        description: "Harmony and spirituality—express faith through music",
        image: "hadroh.jpeg",
        members: members.filter((m) => m.ekskulType === "hadroh").length || 22,
        achievements: 8,
        category: "Seni Islami",
        level: "Spiritual",
        icon: "🎵",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400/10",
      },
      {
        id: "qori",
        name: "Qori",
        description: "Beauty and devotion—perfect your Quran recitation",
        image: "https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg",
        members: members.filter((m) => m.ekskulType === "qori").length || 16,
        achievements: 6,
        category: "Tilawah",
        level: "Sacred",
        icon: "📖",
        color: "text-indigo-400",
        bgColor: "bg-indigo-400/10",
      },
    ]

    const stats = [
      {
        label: "Ekstrakurikuler Aktif",
        value: "12+",
        icon: Star,
        description: "Program unggulan",
        color: "text-primary",
      },
      {
        label: "Siswa Berpartisipasi",
        value: `${members.length || 200}+`,
        icon: Users,
        description: "Anggota aktif",
        color: "text-accent",
      },
      { label: "Prestasi Diraih", value: "50+", icon: Trophy, description: "Penghargaan", color: "text-yellow-400" },
      { label: "Kegiatan per Bulan", value: "25+", icon: Calendar, description: "Event rutin", color: "text-purple-400" },
    ]

    const achievements = [
      { title: "Juara 1 Robotik Nasional", year: "2024", category: "STEM", color: "bg-yellow-400/20 text-yellow-400" },
      {
        title: "Best Performance Futsal Regional",
        year: "2024",
        category: "Olahraga",
        color: "bg-orange-400/20 text-orange-400",
      },
      { title: "Gold Medal Pencak Silat", year: "2023", category: "Budaya", color: "bg-red-400/20 text-red-400" },
      { title: "Outstanding Music Festival", year: "2024", category: "Seni", color: "bg-purple-400/20 text-purple-400" },
    ]

    const features = [
      {
        icon: Target,
        title: "Manajemen Terpadu",
        description: "Sistem manajemen ekstrakurikuler yang terintegrasi dan mudah digunakan",
        color: "text-primary",
        bgColor: "bg-primary/10",
      },
      {
        icon: Zap,
        title: "Real-time Updates",
        description: "Informasi terkini tentang kegiatan, prestasi, dan pengumuman penting",
        color: "text-accent",
        bgColor: "bg-accent/10",
      },
      {
        icon: Shield,
        title: "Keamanan Data",
        description: "Perlindungan data siswa dan informasi sekolah dengan standar keamanan tinggi",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
      },
    ]

    const recentDokumentasi = dokumentasi.slice(0, 6)

    return (
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden">
          <div className="relative h-[600px] lg:h-[700px]">
            {headerImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image.src || "/placeholder.svg?height=700&width=1200&query=school activities"}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/70"></div>
              </div>
            ))}

            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div className="container-responsive px-4">
                <h1 className="font-bold text-4xl lg:text-6xl mb-6 leading-tight">
                  {headerImages[currentImageIndex].title}
                </h1>
                <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                  {headerImages[currentImageIndex].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4"
                    onClick={() => onNavigate("extracurriculars")}
                  >
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-4 bg-transparent"
                    onClick={() => onNavigate("about")}
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {headerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <h2 className="font-bold text-3xl lg:text-4xl mb-4 text-gray-900">Pencapaian Kami</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Angka-angka yang menunjukkan komitmen kami terhadap keunggulan
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                    <div className="text-gray-600">{stat.description}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container-responsive">
            <div className="text-center mb-16">
              <h2 className="font-bold text-3xl lg:text-4xl mb-4 text-gray-900">Program Ekstrakurikuler</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Program yang dirancang untuk mengembangkan bakat dan karakter siswa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredExtracurriculars.map((ekskul) => (
                <Card
                  key={ekskul.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white border-gray-200"
                  onClick={() => onNavigate(ekskul.id)}
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={ekskul.image || "/placeholder.svg"}
                      alt={ekskul.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{ekskul.name}</h3>
                    <p className="text-gray-600 mb-4">{ekskul.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{ekskul.members} anggota</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{ekskul.achievements} prestasi</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-32">
          <div className="container-responsive">
            <ParallaxSection className="text-center mb-20">
              <ScrollRevealText className="font-heading font-black text-4xl lg:text-5xl mb-8">
                Prestasi Terbaru
              </ScrollRevealText>
              <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
                Pencapaian membanggakan dari berbagai kompetisi dan event
              </p>
            </ParallaxSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <AnimatedCard key={index} className="gsap-hover bg-card gsap-card-shadow border-border h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div
                        className={`inline-flex items-center gap-2 ${achievement.color} rounded-full px-3 py-1 mb-4 text-sm font-medium w-fit`}
                      >
                        <span>{achievement.category}</span>
                      </div>
                      <h3 className="font-bold text-lg leading-tight mb-4 flex-grow">{achievement.title}</h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-black text-primary">{achievement.year}</span>
                        <Trophy className="h-6 w-6 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {recentDokumentasi.length > 0 && (
          <section className="py-20 lg:py-32">
            <div className="container-responsive">
              <ParallaxSection className="text-center mb-20">
                <ScrollRevealText className="font-heading font-black text-4xl lg:text-5xl mb-8">
                  Kegiatan Terbaru
                </ScrollRevealText>
                <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
                  Dokumentasi kegiatan dan momen berharga ekstrakurikuler
                </p>
              </ParallaxSection>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentDokumentasi.map((doc) => (
                  <AnimatedCard
                    key={doc.id}
                    className="overflow-hidden gsap-hover gsap-card-shadow bg-card border-border"
                  >
                    <Card>
                      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                        {doc.image ? (
                          <img
                            src={doc.image || "/placeholder.svg"}
                            alt={doc.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <Camera className="w-16 h-16 text-muted-foreground" />
                        )}
                      </div>
                      <CardContent className="p-8">
                        <h3 className="font-heading font-bold text-2xl mb-4">{doc.title}</h3>
                        <p className="text-muted-foregroundleading-relaxed text-lg line-clamp-2">
                          {doc.description}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 lg:py-32 gsap-hero-gradient text-foreground relative overflow-hidden">
          <div className="absolute inset-0 gsap-pattern opacity-30"></div>
          <div className="relative container-responsive text-center">
            <ParallaxSection>
              <div className="inline-flex items-center gap-3 gsap-glass rounded-full px-6 py-3 mb-8">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="font-bold text-primary">Bergabung Sekarang</span>
              </div>
              <ScrollRevealText className="font-heading font-black text-4xl lg:text-6xl mb-8">
                Siap Bergabung dengan Kami?
              </ScrollRevealText>
              <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
                Bergabunglah dengan komunitas siswa berprestasi dan kembangkan potensi terbaik Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gsap-hover text-xl px-12 py-6 rounded-2xl"
                  onClick={() => onNavigate("contact")}
                >
                  Hubungi Kami
                  <ArrowRight className="ml-3 h-8 w-8" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-border text-foreground hover:bg-muted bg-transparent font-bold gsap-glass text-xl px-12 py-6 rounded-2xl"
                  onClick={() => onNavigate("about")}
                >
                  <BookOpen className="mr-3 h-8 w-8" />
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </ParallaxSection>
          </div>
        </section>
      </div>
    )
  }
