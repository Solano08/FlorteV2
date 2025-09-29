import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Home, Users, MessageCircle, BookOpen, LogOut, Settings, User } from "lucide-react";
import { FlorteButton } from "./../../components/ui/florte-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./../../components/ui/avatar";
import { ThemeToggle } from "./../../components/ui/theme-toggle";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/grupos", label: "Grupos", icon: Users },
    { path: "/amigos", label: "Amigos", icon: Users },
    { path: "/chat", label: "Chats Privados", icon: MessageCircle },
    { path: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  ];

  return (
    <header className="w-full bg-gradient-primary border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">F</span>
            </div>
            <span className="text-white font-bold text-xl">FLORTE</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <FlorteButton variant="florte-ghost" size="icon" className="text-white hover:bg-white/10">
              <Bell className="w-5 h-5" />
            </FlorteButton>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Ana García" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      AG
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium hidden sm:inline">Ana</span>
                  <ChevronDown className="w-4 h-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border border-border/50 shadow-medium">
                <div className="px-3 py-2 border-b border-border/50">
                  <p className="font-medium text-card-foreground">Ana García Rodríguez</p>
                  <p className="text-sm text-muted-foreground">ana.garcia@sena.edu.co</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center">
                    <User className="w-4 h-4 mr-3" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-3" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;