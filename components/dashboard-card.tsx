import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface DashboardCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info"
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  children?: ReactNode
}

export default function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  trend,
  children,
}: DashboardCardProps) {
  const variantStyles = {
    default: {
      border: "border-l-4 border-l-primary",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-foreground",
    },
    primary: {
      border: "border-l-4 border-l-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    success: {
      border: "border-l-4 border-l-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      valueColor: "text-green-600 dark:text-green-400",
    },
    warning: {
      border: "border-l-4 border-l-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      valueColor: "text-amber-600 dark:text-amber-400",
    },
    danger: {
      border: "border-l-4 border-l-red-500",
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      valueColor: "text-red-600 dark:text-red-400",
    },
    info: {
      border: "border-l-4 border-l-cyan-500",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      valueColor: "text-cyan-600 dark:text-cyan-400",
    },
  }

  const styles = variantStyles[variant]

  return (
    <Card className={`hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${styles.border}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${styles.iconBg}`}>
          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold font-heading ${styles.valueColor}`}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1 text-xs mt-2">
            <span className={trend.isPositive !== false ? "text-green-500" : "text-red-500"}>
              {trend.isPositive !== false ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
