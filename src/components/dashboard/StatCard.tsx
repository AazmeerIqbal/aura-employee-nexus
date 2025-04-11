
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

const StatCard = ({ title, value, icon: Icon, trend, color = "primary" }: StatCardProps) => {
  const colorStyles = {
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      iconBg: "bg-primary",
    },
    success: {
      bg: "bg-green-500/10",
      text: "text-green-600",
      iconBg: "bg-green-500",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      iconBg: "bg-amber-500",
    },
    danger: {
      bg: "bg-red-500/10",
      text: "text-red-600",
      iconBg: "bg-red-500",
    },
    info: {
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      iconBg: "bg-blue-500",
    },
  };

  const styles = colorStyles[color];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span
                  className={`text-xs font-medium flex items-center ${
                    trend.positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${styles.bg}`}>
            <Icon className={styles.text} size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
