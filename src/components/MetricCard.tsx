import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ElementType
  trend?: string
  trendValue?: string
  className?: string
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-card text-card-foreground", className)}>
      <CardHeader className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <div data-slot="card-title" className="text-sm font-medium text-muted-foreground">
          {title}
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent className="px-6">
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-2 mt-2">
            <div
              className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {trendValue}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

