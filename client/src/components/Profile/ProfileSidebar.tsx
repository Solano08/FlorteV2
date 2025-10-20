import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Folder, Users, BookOpen, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

type ProfileStats = {
  projects: number;
  connections: number;
  courses: number;
};

type ProjectSummary = {
  id: number;
  title: string;
  status?: string;
  createdAt?: string;
};

interface ProfileSidebarProps {
  stats?: ProfileStats | null;
  projects?: ProjectSummary[];
  isLoading?: boolean;
}

const ProfileSidebar = ({ stats, projects = [], isLoading }: ProfileSidebarProps) => {
  const renderSkeletonLines = (count: number) =>
    Array.from({ length: count }).map((_, index) => (
      <Skeleton key={`project-skeleton-${index}`} className="h-4 w-full" />
    ));

  const projectCount = stats?.projects ?? 0;
  const connectionCount = stats?.connections ?? 0;
  const courseCount = stats?.courses ?? 0;

  return (
    <div className="space-y-4">
      <Card className="p-6 shadow-hover-effect">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Folder className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Proyectos</p>
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <p className="text-3xl font-bold">{projectCount}</p>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link to="/proyectos/crear">
              <Plus className="h-3 w-3 mr-2" />
              Nuevo
            </Link>
          </Button>
        </div>

        <div className="space-y-2">
          {isLoading
            ? renderSkeletonLines(3)
            : projects.length > 0
              ? projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/proyectos/${project.id}`}
                    className="block rounded-md border border-border/60 px-3 py-2 hover:border-primary hover:text-primary transition-colors text-sm"
                  >
                    <p className="font-medium leading-tight">{project.title}</p>
                    {project.status && (
                      <span className="text-xs text-muted-foreground capitalize">
                        {project.status}
                      </span>
                    )}
                  </Link>
                ))
              : (
                  <p className="text-xs text-muted-foreground">
                    Aun no tienes proyectos asociados.
                  </p>
                )}
        </div>
      </Card>

      <Card className="p-6 text-center shadow-hover-effect">
        <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
        {isLoading ? (
          <Skeleton className="h-8 w-16 mx-auto" />
        ) : (
          <p className="text-3xl font-bold">{connectionCount}</p>
        )}
        <p className="text-sm text-muted-foreground">Conexiones</p>
      </Card>

      <Card className="p-6 text-center shadow-hover-effect">
        <BookOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
        {isLoading ? (
          <Skeleton className="h-8 w-16 mx-auto" />
        ) : (
          <p className="text-3xl font-bold">{courseCount}</p>
        )}
        <p className="text-sm text-muted-foreground">Cursos</p>
      </Card>

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
