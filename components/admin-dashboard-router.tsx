"use client"

import { useAuth } from "@/hooks/use-auth"
import SuperAdminDashboard from "./super-admin-dashboard"
import RobotikAdminDashboard from "./robotik-admin-dashboard"
import SilatAdminDashboard from "./silat-admin-dashboard"
import FutsalAdminDashboard from "./futsal-admin-dashboard"
import BandAdminDashboard from "./band-admin-dashboard"
import HadrohAdminDashboard from "./hadroh-admin-dashboard"
import QoriAdminDashboard from "./qori-admin-dashboard"
import PramukaAdminDashboard from "./pramuka-admin-dashboard"
import PaskibAdminDashboard from "./paskib-admin-dashboard"
import AdminDashboard from "./admin-dashboard"
import AdminErrorBoundary from "./admin-error-boundary"
import LoadingSpinner from "./loading-spinner"

interface AdminDashboardRouterProps {
  onLogout: () => void
}

export default function AdminDashboardRouter({ onLogout }: AdminDashboardRouterProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Memuat dashboard..." />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Sesi Berakhir</h2>
          <p className="text-muted-foreground">Silakan login kembali</p>
        </div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "super_admin":
        return (
          <AdminErrorBoundary>
            <SuperAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "robotik_admin":
        return (
          <AdminErrorBoundary>
            <RobotikAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "silat_admin":
        return (
          <AdminErrorBoundary>
            <SilatAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "futsal_admin":
        return (
          <AdminErrorBoundary>
            <FutsalAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "band_admin":
        return (
          <AdminErrorBoundary>
            <BandAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "hadroh_admin":
        return (
          <AdminErrorBoundary>
            <HadrohAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "qori_admin":
        return (
          <AdminErrorBoundary>
            <QoriAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "pramuka_admin":
        return (
          <AdminErrorBoundary>
            <PramukaAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      case "paskib_admin":
        return (
          <AdminErrorBoundary>
            <PaskibAdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
      default:
        return (
          <AdminErrorBoundary>
            <AdminDashboard onLogout={onLogout} />
          </AdminErrorBoundary>
        )
    }
  }

  return renderDashboard()
}
