import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Folder, Users, BookOpen, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileSidebar = () => {
  return (
    <div className="space-y-4">
      <Card className="p-6 text-center shadow-hover-effect">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarFallback className="text-2xl bg-muted">AG</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">Ana García Rodríguez</h3>
        <p className="text-sm text-muted-foreground">Desarrolladora Full Stack Junior</p>
        
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
          <Button variant="outline" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Unirse a Grupo
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
