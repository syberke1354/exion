import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  variant?: "default" | "primary" | "accent"
}

export default function LoadingSpinner({ size = "md", text, variant = "default" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent-foreground",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  )
}
