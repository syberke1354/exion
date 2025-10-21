"use client"

import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FooterProps {
  onNavigate: (section: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Beranda", section: "home" },
    { name: "Ekstrakurikuler", section: "extracurriculars" },
    { name: "Prestasi", section: "achievements" },
    { name: "Dokumentasi", section: "documentation" },
    { name: "Tentang Kami", section: "about" },
    { name: "Kontak", section: "contact" },
  ]

  const externalLinks = [
    { name: "Website Utama", href: "https://smktibazma.sch.id" },
    { name: "BEST Platform", href: "https://best.smktibazma.com" },
  ]

  const ekstrakurikuler = [
    { name: "Robotik", section: "robotik" },
    { name: "Futsal", section: "futsal" },
    { name: "Musik", section: "musik" },
    { name: "Pencak Silat", section: "silat" },
    { name: "Hadroh", section: "hadroh" },
    { name: "Qori", section: "qori" },
    { name: "Pramuka", section: "pramuka" },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/smktibazma/", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "https://www.youtube.com/@smktibazma2025", label: "YouTube" },
  ]

  return (
    <footer className="bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 clean-pattern opacity-5"></div>

      <div className="relative container-responsive py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <div>
              <h3 className="font-heading font-bold text-2xl mb-4 text-white">SMK TI BAZMA</h3>
              <p className="text-white leading-relaxed mb-6">
                Mengembangkan potensi siswa melalui berbagai kegiatan ekstrakurikuler yang berkualitas dan berprestasi.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Alamat Sekolah</p>
                  <p className="text-white text-sm">Jl. Raya Cikampak Cicadas, RT.1/RW.1, Cicadas, Kec. Ciampea, Kabupaten Bogor, Jawa Barat 16620</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Telepon</p>
                  <p className="text-white text-sm">+62 811-1144-339</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Email</p>
                  <p className="text-white text-sm">info@bazma.sch.id</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Navigasi Cepat</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => onNavigate(link.section)}
                    className="text-white hover:text-black hover:translate-x-2 transition-all duration-300 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Ekstrakurikuler</h4>
            <ul className="space-y-3">
              {ekstrakurikuler.map((ekskul) => (
                <li key={ekskul.section}>
                  <button
                    onClick={() => onNavigate(ekskul.section)}
                    className="text-white hover:text-black hover:translate-x-2 transition-all duration-300 text-left"
                  >
                    {ekskul.name}
                  </button>
                </li>
              ))}
            </ul>

            <h4 className="font-heading font-semibold text-lg mb-4 mt-6 text-white">Portal Lainnya</h4>
            <ul className="space-y-3">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-black hover:translate-x-2 transition-all duration-300 inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ArrowUp className="h-3 w-3 rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 text-white">Ikuti Kami</h4>

            <div className="flex gap-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 hover:bg-cyan-500 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>

            <Card className="bg-gray-50 border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h5 className="font-semibold text-white mb-2">Newsletter</h5>
                <p className="text-gray-600 text-sm mb-3">Dapatkan update terbaru tentang kegiatan ekstrakurikuler</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-white text-sm">
                © {currentYear}Team Developer Mirza bakti s.kom, S.Kom - Qiageng Berke Jaisyurrohman - Danish Athaya Natasurendra - Ahmad Fairuz Ghaly Faisol
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-4 text-xs text-white">
                <button className="hover:text-black transition-colors">Kebijakan Privasi</button>
                <button className="hover:text-black transition-colors">Syarat & Ketentuan</button>
                <button className="hover:text-black transition-colors">Sitemap</button>
              </div>

              <Button onClick={scrollToTop} size="sm" className="bg-blue-400 hover:bg-gray-200  text-black">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
