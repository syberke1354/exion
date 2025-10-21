"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, CircleCheck as CheckCircle, Circle as XCircle, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { getMembers, getAttendance, addAttendance } from "@/lib/firebase-service"
import type { Member, Attendance } from "@/types"

export default function AdminAttendanceManagement() {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({})

  const getCurrentEkskulType = () => {
    if (!user) return null
    if (user.role === "super_admin") return null
    return user.role.replace("_admin", "") as "robotik" | "silat" | "futsal" | "musik" | "hadroh" | "qori"
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user) return
      try {
        const ekskulType = getCurrentEkskulType()
        const [membersData, attendanceData] = await Promise.all([
          getMembers(ekskulType || undefined),
          getAttendance(ekskulType || undefined),
        ])
        setMembers(membersData)
        setAttendance(attendanceData)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [user])

  const handleAttendanceChange = (memberId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [memberId]: status,
    }))
  }

  const handleSaveAttendance = async () => {
    if (!user) return

    setLoading(true)
    try {
      const ekskulType = getCurrentEkskulType()

      for (const [memberId, status] of Object.entries(attendanceData)) {
        if (status) {
          await addAttendance({
            memberId,
            date: selectedDate,
            status: status as "Hadir" | "Tidak Hadir" | "Izin" | "Sakit",
            ekskulType: ekskulType || "umum",
          })
        }
      }

      // Reload attendance data
      const updatedAttendance = await getAttendance(ekskulType || undefined)
      setAttendance(updatedAttendance)
      setAttendanceData({})

      alert("Absensi berhasil disimpan!")
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Gagal menyimpan absensi")
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceForDate = (memberId: string, date: string) => {
    return attendance.find((att) => att.memberId === memberId && att.date === date)
  }

  const getAttendanceStats = () => {
    const thisMonth = new Date().toISOString().slice(0, 7)
    const thisMonthAttendance = attendance.filter((att) => att.date.startsWith(thisMonth))

    const totalSessions = new Set(thisMonthAttendance.map((att) => att.date)).size
    const presentCount = thisMonthAttendance.filter((att) => att.status === "Hadir").length
    const absentCount = thisMonthAttendance.filter((att) => att.status === "Tidak Hadir").length
    const excusedCount = thisMonthAttendance.filter((att) => att.status === "Izin" || att.status === "Sakit").length

    return {
      totalSessions,
      presentCount,
      absentCount,
      excusedCount,
      attendanceRate:
        totalSessions > 0 ? Math.round((presentCount / (presentCount + absentCount + excusedCount)) * 100) : 0,
    }
  }

  const stats = getAttendanceStats()

  const exportAttendance = () => {
    const csvContent = [
      ["Nama", "Kelas", "Tanggal", "Status", "Keterangan"].join(","),
      ...attendance.map((att) => {
        const member = members.find((m) => m.id === att.memberId)
        return [member?.name || "", member?.class || "", att.date, att.status, att.notes || ""].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Manajemen Absensi</h1>
          <p className="text-muted-foreground">Kelola absensi anggota ekstrakurikuler</p>
        </div>
        <Button onClick={exportAttendance} variant="outline" className="hover-lift bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{members.length}</div>
            <div className="text-sm text-muted-foreground">Total Anggota</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Sesi Bulan Ini</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.presentCount}</div>
            <div className="text-sm text-muted-foreground">Total Hadir</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.absentCount}</div>
            <div className="text-sm text-muted-foreground">Total Tidak Hadir</div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Tingkat Kehadiran</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Input Absensi</CardTitle>
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="attendanceDate">Tanggal</Label>
                <Input
                  id="attendanceDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={handleSaveAttendance} disabled={loading || Object.keys(attendanceData).length === 0}>
                {loading ? "Menyimpan..." : "Simpan Absensi"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Nama</th>
                  <th className="text-left p-4 font-medium">Kelas</th>
                  <th className="text-left p-4 font-medium">Status Sebelumnya</th>
                  <th className="text-left p-4 font-medium">Status Hari Ini</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const previousAttendance = getAttendanceForDate(member.id, selectedDate)
                  const currentStatus = attendanceData[member.id] || ""

                  return (
                    <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {member.photo ? (
                              <img
                                src={member.photo || "/placeholder.svg"}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium">{member.name.charAt(0)}</span>
                            )}
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{member.class}</td>
                      <td className="p-4">
                        {previousAttendance ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              previousAttendance.status === "Hadir"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : previousAttendance.status === "Tidak Hadir"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {previousAttendance.status}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Belum ada data</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Select
                          value={currentStatus}
                          onValueChange={(value) => handleAttendanceChange(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hadir">Hadir</SelectItem>
                            <SelectItem value="Tidak Hadir">Tidak Hadir</SelectItem>
                            <SelectItem value="Izin">Izin</SelectItem>
                            <SelectItem value="Sakit">Sakit</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
