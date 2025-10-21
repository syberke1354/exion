"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Plus, CreditCard as Edit, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { addSchedule, getSchedules } from "@/lib/firebase-service"
import type { Schedule } from "@/types"

export default function AdminScheduleManagement() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(0)

  const [newSchedule, setNewSchedule] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  })

  const getCurrentEkskulType = () => {
    if (!user) return null
    if (user.role === "super_admin") return null
    return user.role.replace("_admin", "") as "robotik" | "silat" | "futsal" | "musik"
  }

  useEffect(() => {
    const loadSchedules = async () => {
      if (!user) return
      try {
        const ekskulType = getCurrentEkskulType()
        const schedulesData = await getSchedules(ekskulType || undefined)
        setSchedules(schedulesData)
      } catch (error) {
        console.error("Error loading schedules:", error)
      }
    }

    loadSchedules()
  }, [user])

  const handleAddSchedule = async () => {
    if (!newSchedule.title || !newSchedule.date || !newSchedule.startTime || !user) return

    setLoading(true)
    try {
      const ekskulType = getCurrentEkskulType()
      if (!ekskulType && user.role !== "super_admin") {
        throw new Error("Invalid ekstrakurikuler type")
      }

      const scheduleData = {
        ...newSchedule,
        ekskulType: ekskulType || "umum",
        createdBy: user.id,
        date: new Date(newSchedule.date),
      }

      await addSchedule(scheduleData)

      // Reload schedules
      const updatedSchedules = await getSchedules(ekskulType || undefined)
      setSchedules(updatedSchedules)

      // Reset form
      setNewSchedule({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + weekOffset * 7))
    const dates = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date)
    }

    return dates
  }

  const weekDates = getWeekDates(selectedWeek)
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return schedules.filter((schedule) => schedule.date === dateString)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Manajemen Jadwal</h1>
          <p className="text-muted-foreground">Kelola jadwal kegiatan ekstrakurikuler</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Jadwal
        </Button>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Jadwal Mingguan</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek - 1)}>
                ← Minggu Lalu
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedWeek(0)} disabled={selectedWeek === 0}>
                Minggu Ini
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedWeek(selectedWeek + 1)}>
                Minggu Depan →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date, index) => {
              const daySchedules = getSchedulesForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${isToday ? "bg-primary/5 border-primary" : "bg-muted/30"}`}
                >
                  <div className="text-center mb-3">
                    <div className="text-sm font-medium">{dayNames[index]}</div>
                    <div className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{date.getDate()}</div>
                  </div>

                  <div className="space-y-2">
                    {daySchedules.map((schedule) => (
                      <div key={schedule.id} className="p-2 bg-card rounded border text-xs">
                        <div className="font-medium line-clamp-1">{schedule.title}</div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{(schedule as any).time || `${schedule.startTime}-${schedule.endTime}`}</span>
                        </div>
                        {schedule.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{schedule.location}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {daySchedules.length === 0 && (
                      <div className="text-xs text-muted-foreground text-center py-2">Tidak ada jadwal</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{schedule.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{schedule.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(schedule.date).toLocaleDateString("id-ID")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{(schedule as any).time || `${schedule.startTime}-${schedule.endTime}`}</span>
                    </div>
                    {schedule.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">Belum Ada Jadwal</h3>
                <p className="text-muted-foreground">Tambahkan jadwal kegiatan pertama Anda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Schedule Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tambah Jadwal Baru</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scheduleTitle">Judul Kegiatan</Label>
                <Input
                  id="scheduleTitle"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                  placeholder="Masukkan judul kegiatan"
                />
              </div>

              <div>
                <Label htmlFor="scheduleDescription">Deskripsi</Label>
                <Textarea
                  id="scheduleDescription"
                  value={newSchedule.description}
                  onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                  placeholder="Deskripsi kegiatan"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduleDate">Tanggal</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleStartTime">Waktu Mulai</Label>
                  <Input
                    id="scheduleStartTime"
                    type="time"
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduleEndTime">Waktu Selesai</Label>
                  <Input
                    id="scheduleEndTime"
                    type="time"
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduleLocation">Lokasi</Label>
                  <Input
                    id="scheduleLocation"
                    value={newSchedule.location}
                    onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                    placeholder="Lokasi kegiatan"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleAddSchedule} className="flex-1" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={loading}>
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
