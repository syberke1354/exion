"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { type LucideIcon, LogOut, X } from "lucide-react"

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
}

interface DashboardSidebarProps {
  title: string
  subtitle: string
  icon: LucideIcon
  navigationItems: NavigationItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
  variant?: "default" | "robotik" | "silat" | "futsal" | "band" | "hadroh" | "qori"
}

export default function DashboardSidebar({
  title,
  subtitle,
  icon: MainIcon,
  navigationItems,
  activeTab,
  onTabChange,
  onLogout,
  isOpen,
  onClose,
  variant = "default",
}: DashboardSidebarProps) {
  const variantStyles = {
    default: {
      border: "border-r",
      headerBorder: "border-b",
      footerBorder: "border-t",
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      subtitleColor: "text-primary",
      activeButton: "bg-primary text-primary-foreground shadow-md",
      hoverButton: "hover:text-foreground hover:bg-muted",
    },
    robotik: {
      border: "border-r border-amber-200 dark:border-amber-800",
      headerBorder: "border-b border-amber-200 dark:border-amber-800",
      footerBorder: "border-t border-amber-200 dark:border-amber-800",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-500",
      subtitleColor: "text-amber-600",
      activeButton: "bg-amber-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-amber-50 dark:hover:bg-amber-900/20",
    },
    silat: {
      border: "border-r border-red-200 dark:border-red-800",
      headerBorder: "border-b border-red-200 dark:border-red-800",
      footerBorder: "border-t border-red-200 dark:border-red-800",
      iconColor: "text-red-600",
      iconBg: "bg-red-500",
      subtitleColor: "text-red-600",
      activeButton: "bg-red-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-red-50 dark:hover:bg-red-900/20",
    },
    futsal: {
      border: "border-r border-orange-200 dark:border-orange-800",
      headerBorder: "border-b border-orange-200 dark:border-orange-800",
      footerBorder: "border-t border-orange-200 dark:border-orange-800",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-500",
      subtitleColor: "text-orange-600",
      activeButton: "bg-orange-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20",
    },
    band: {
      border: "border-r border-purple-200 dark:border-purple-800",
      headerBorder: "border-b border-purple-200 dark:border-purple-800",
      footerBorder: "border-t border-purple-200 dark:border-purple-800",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-500",
      subtitleColor: "text-purple-600",
      activeButton: "bg-purple-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-purple-50 dark:hover:bg-purple-900/20",
    },
    hadroh: {
      border: "border-r border-emerald-200 dark:border-emerald-800",
      headerBorder: "border-b border-emerald-200 dark:border-emerald-800",
      footerBorder: "border-t border-emerald-200 dark:border-emerald-800",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500",
      subtitleColor: "text-emerald-600",
      activeButton: "bg-emerald-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
    },
    qori: {
      border: "border-r border-indigo-200 dark:border-indigo-800",
      headerBorder: "border-b border-indigo-200 dark:border-indigo-800",
      footerBorder: "border-t border-indigo-200 dark:border-indigo-800",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-500",
      subtitleColor: "text-indigo-600",
      activeButton: "bg-indigo-600 text-white shadow-md",
      hoverButton: "hover:text-foreground hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
    },
  }

  const styles = variantStyles[variant]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-card ${styles.border} transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className={`flex items-center justify-between p-6 ${styles.headerBorder}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MainIcon className={`h-8 w-8 ${styles.iconColor}`} />
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${styles.iconBg} rounded-full animate-pulse`}></div>
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-foreground">{title}</h1>
            <p className={`text-xs ${styles.subtitleColor} font-medium`}>{subtitle}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                onClose()
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 ${
                activeTab === item.id ? styles.activeButton : `text-muted-foreground ${styles.hoverButton}`
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className={`p-4 ${styles.footerBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
