import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Layout/Navbar";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Feed/PostCard";
import { endpoints, handleResponse } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";
import type { FeedPost } from "../types/feed";
import { Skeleton } from "../components/ui/skeleton";
import { getInitials } from "../lib/utils";

interface ProjectMember {
  id: number;
  nombre_completo: string;
  avatar_url: string | null;
  rol: string | null;
}

interface ProjectDetailResponse {
  project: {
    id: number;
    titulo: string;
    descripcion: string | null;
    estado: string;
    fecha_creacion: string;
    posts_count: number;
    members: ProjectMember[];
    membership: string | null;
  };
}

const ProyectoDetalle = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const numericProjectId = Number(projectId);

  const {
    data: projectData,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery<ProjectDetailResponse>({
    queryKey: ["project", numericProjectId, user?.id],
    enabled: Number.isInteger(numericProjectId),
    queryFn: async () => {
      if (!Number.isInteger(numericProjectId)) {
        throw new Error("Proyecto no valido.");
      }
      const response = await fetch(
        endpoints.projectDetail(numericProjectId, user?.id)
      );
      return handleResponse(response) as Promise<ProjectDetailResponse>;
    },
  });

  const {
    data: feedData,
    isLoading: feedLoading,
    error: feedError,
  } = useQuery<{ posts: FeedPost[] }>({
    queryKey: ["feed", user?.id, numericProjectId],
    enabled: Boolean(user?.id && Number.isInteger(numericProjectId)),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.id) params.set("userId", String(user.id));
      if (Number.isInteger(numericProjectId)) {
        params.set("projectId", String(numericProjectId));
      }
      const response = await fetch(endpoints.feed(params.toString()));
      return handleResponse(response) as Promise<{ posts: FeedPost[] }>;
    },
  });

  if (projectError instanceof Error) {
    toast({
      variant: "destructive",
      title: "Error al cargar proyecto",
      description: projectError.message,
    });
  }

  if (feedError instanceof Error) {
    toast({
      variant: "destructive",
      title: "Error al cargar publicaciones",
      description: feedError.message,
    });
  }

  const project = projectData?.project;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <Card className="p-6 shadow-hover-effect">
          {projectLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : project ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{project.titulo}</h1>
                  <p className="text-sm text-muted-foreground">
                    Creado el {new Date(project.fecha_creacion).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="capitalize">{project.estado}</Badge>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {project.descripcion || "Este proyecto aun no tiene una descripcion detallada."}
              </p>
              <div className="rounded-lg border border-dashed border-border/60 p-4">
                <p className="text-sm font-semibold mb-2">Participantes</p>
                <div className="flex flex-wrap gap-4">
                  {project.members.map((member) => {
                    const memberInitials = getInitials(member.nombre_completo);
                    return (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {member.avatar_url ? (
                            <AvatarImage src={member.avatar_url} alt={member.nombre_completo} />
                          ) : (
                            <AvatarFallback className="bg-muted text-xs">
                              {memberInitials || "FL"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.nombre_completo}</p>
                          {member.rol && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {member.rol}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Proyecto no disponible.</p>
          )}
        </Card>

        {project && (
          <CreatePost
            projects={[{ id: project.id, title: project.titulo }]}
            defaultProjectId={project.id}
            lockProject
          />
        )}

        <div className="space-y-4">
          {feedLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={`project-feed-skeleton-${index}`} className="p-6 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-48 w-full" />
                </Card>
              ))}
            </div>
          ) : feedData?.posts.length ? (
            feedData.posts.map((feedPost) => <PostCard key={feedPost.id} post={feedPost} />)
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              Este proyecto aun no tiene publicaciones.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProyectoDetalle;
