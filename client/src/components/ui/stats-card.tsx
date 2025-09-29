import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./../../components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, subtitle, className = "" }) => {
  return (
    <Card className={`florte-card hover:shadow-medium florte-transition ${className}`}>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Icon className="w-8 h-8 text-primary" />
          <div className="space-y-1">
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground/70">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;