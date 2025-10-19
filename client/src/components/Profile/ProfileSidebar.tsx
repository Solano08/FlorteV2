import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Folder, Users, BookOpen, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";

const ProfileSidebar = () => {
  const { user } = useAuth();

  const initials = getInitials(user?.nombre_completo ?? user?.correo ?? "");

  return (
    <div className="space-y-4">
      <Card className="p-6 text-center shadow-hover-effect">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          {user?.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.nombre_completo} />
          ) : (
            <AvatarFallback className="text-2xl bg-muted">{initials || "FL"}</AvatarFallback>
          )}
        </Avatar>
        <h3 className="font-semibold text-lg">
          {user?.nombre_completo ?? "Aprendiz FLORTE"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {user?.ocupacion ?? "Actualiza tu perfil para compartir tu rol."}
        </p>

        <div className="flex justify-center gap-8 mt-4">
          <div>
            <p className="text-2xl font-bold text-primary">156</p>
            <p className="text-xs text-muted-foreground">Siguiendo</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">245</p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 text-center shadow-hover-effect">
        <Folder className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">12</p>
        <p className="text-sm text-muted-foreground">Proyectos Activos</p>
      </Card>

      <Card className="p-6 text-center shadow-hover-effect">
        <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">89</p>
        <p className="text-sm text-muted-foreground">Conexiones</p>
      </Card>

      <Card className="p-6 text-center shadow-hover-effect">
        <BookOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">6</p>
        <p className="text-sm text-muted-foreground">Cursos</p>
      </Card>

      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Acciones Rápidas</h3>
        <div className="space-y-2">
          <Button className="w-full bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Crear Proyecto
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/grupos">
              <UserPlus className="h-4 w-4 mr-2" />
              Unirse a Grupo
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
