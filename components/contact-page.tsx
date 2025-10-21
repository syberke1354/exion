"use client"

import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat",
      content: "Jl. Raya Cikampak Cicadas, RT.1/RW.1, Cicadas, Kec. Ciampea, Kabupaten Bogor, Jawa Barat 16620",
      color: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "0811-1144-339",
      color: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@sman1.sch.id",
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      content: "Senin - Jumat: 07:00 - 16:00\nSabtu: 07:00 - 12:00",
      color: "text-orange-600",
    },
  ]

  const ekstrakurikulerContacts = [
    { name: "Robotik", contact: "Bu Parni Handayani - +62 899-4447-469" },
    { name: "Futsal", contact: "Pak Fajar Zulhijjah - +62 831-0651-7043" },
    { name: "Musik", contact: "Pak Candra - +62 896-6222-5833" },
    { name: "Software Development", contact: "Pak Mirza Bakti - +62 888-0280-4685" },
    { name: "Paskibra", contact: "Pak Rangga - +62 896-1618-8708" },
    { name: "Qori", contact: "Pak Dedi - 0815-6789-0123" },//belum ada nomor
    { name: "Hadroh", contact: "Pak Dedi - 0815-6789-0123" },//bellum ada nomor
    { name: "Pencak Silat", contact: "Pak Hardi - +62 838-9382-8409" },
    { name: "Pramuka", contact: "Pak Kamil & Iwan- +62 831-4574-4703" }
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading font-bold text-4xl lg:text-5xl mb-6">
            Hubungi <span className="text-blue-600">Kami</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami siap membantu Anda dengan informasi tentang ekstrakurikuler dan kegiatan sekolah. Jangan ragu untuk
            menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-heading font-bold text-2xl mb-8">Informasi Kontak</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-muted ${info.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{info.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Extracurricular Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Pembina Ekstrakurikuler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ekstrakurikulerContacts.map((ekskul, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="font-medium">{ekskul.name}</span>
                      <span className="text-muted-foreground">{ekskul.contact}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Masukkan email" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" placeholder="Masukkan nomor telepon" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Masukkan subjek pesan" />
                  </div>

                  <div>
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea id="message" placeholder="Tulis pesan Anda di sini..." rows={6} />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="font-heading font-bold text-2xl mb-8 text-center">Lokasi Sekolah</h2>
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7654321098765!2d106.68614299999999!3d-6.5742285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69db2b478d2725%3A0xa31558d4689b78c5!2sIslamic%20Boarding%20School%20SMK%20TI%20BAZMA!5e0!3m2!1sen!2sid!4v1640995200000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Islamic Boarding School SMK TI BAZMA"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Additional location info below the map */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              <strong>Islamic Boarding School SMK TI BAZMA</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik dan seret peta untuk menjelajahi area sekitar sekolah
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
