import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Folder, Users, BookOpen, Plus, UserPlus, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type ProfileStats = {
  projects: number;
  connections: number;
  courses: number;
};

interface ProfileSidebarProps {
  stats?: ProfileStats | null;
  isLoading?: boolean;
}

const metricDetails: Array<{ label: string; icon: LucideIcon; extractor: (stats?: ProfileStats | null) => number }> =
  [
    { label: "Proyectos", icon: Folder, extractor: (stats) => stats?.projects ?? 0 },
    { label: "Conexiones", icon: Users, extractor: (stats) => stats?.connections ?? 0 },
    { label: "Cursos", icon: BookOpen, extractor: (stats) => stats?.courses ?? 0 },
  ];

const ProfileSidebar = ({ stats, isLoading }: ProfileSidebarProps) => {
  return (
    <div className="space-y-4">
      {metricDetails.map(({ label, icon: Icon, extractor }) => (
        <Card key={label} className="p-6 text-center shadow-hover-effect">
          <Icon className="h-12 w-12 mx-auto mb-2 text-primary" />
          {isLoading ? (
            <Skeleton className="h-8 w-16 mx-auto" />
          ) : (
            <p className="text-3xl font-bold">{extractor(stats)}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </Card>
      ))}

      <Card className="p-4 shadow-hover-effect">
        <h3 className="font-semibold mb-3">Acciones rapidas</h3>
        <div className="space-y-2">
          <Button className="w-full bg-primary hover:bg-primary/90" asChild>
            <Link to="/proyectos/crear">
              <Plus className="h-4 w-4 mr-2" />
              Crear Proyecto
            </Link>
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
