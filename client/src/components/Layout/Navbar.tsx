import { Home, Users, UserPlus, MessageCircle, BookOpen, Sun, Moon, Bell } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/grupos", label: "Grupos", icon: Users },
    { path: "/amigos", label: "Amigos", icon: UserPlus },
    { path: "/chats", label: "Chats Privados", icon: MessageCircle },
    { path: "/biblioteca", label: "Biblioteca", icon: BookOpen },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = getInitials(user?.nombre_completo ?? user?.correo ?? "");

  return (
    <nav className="bg-primary border-b border-primary/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to={user ? "/" : "/login"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground flex items-center justify-center">
              <span className="text-primary font-bold">F</span>
            </div>
            <span className="text-primary-foreground font-bold text-lg">FLORTE</span>
          </Link>

          {user && (
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 ${
                        isActive(item.path) ? "bg-primary-foreground/20" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-primary-foreground hover:bg-primary-foreground/10"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <Avatar className="h-7 w-7">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.nombre_completo} />
                        ) : (
                          <AvatarFallback className="bg-primary-foreground text-primary text-xs">
                            {initials || "FL"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="max-w-[140px] truncate">{user.nombre_completo}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-semibold leading-tight">{user.nombre_completo}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{user.correo}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link to="/perfil">
                      <DropdownMenuItem>Mi Perfil</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem disabled>Configuración</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={(event) => {
                        event.preventDefault();
                        handleLogout();
                      }}
                    >
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Button variant="secondary" onClick={() => navigate("/login")}>Iniciar sesión</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
