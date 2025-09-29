import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./../../components/ui/avatar";
import { cn } from "./../../lib/utils";

interface UserAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  online?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt, 
  fallback, 
  size = "md", 
  className = "", 
  online = false 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl"
  };

  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
          {fallback}
        </AvatarFallback>
      </Avatar>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-background"></div>
      )}
    </div>
  );
};

export default UserAvatar;