import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Navbar from "../components/Layout/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Share2,
  Edit,
  MapPin,
  Calendar,
  Folder,
  Users,
  BookOpen,
  Award,
  Target,
  Star,
  Paintbrush,
  Loader2,
} from "lucide-react";
import EditProfileDialog from "../components/Profile/EditProfileDialog";
import { endpoints, handleResponse } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../lib/utils";
import { useToast } from "../components/ui/use-toast";

interface UsuarioData {
  id: number;
  nombre_completo: string;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  ubicacion: string | null;
  ocupacion: string | null;
  correo: string;
  fecha_union: string;
  avatar_url: string | null;
  portada_url: string | null;
  rol?: string | null;
  stats?: {
    projects: number;
    connections: number;
    courses: number;
  };
  deleted_at?: string | null;
}

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioData | null>(user);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUsuario(user);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const controller = new AbortController();
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(endpoints.profile(user.id), {
          signal: controller.signal,
        });
        const data = await handleResponse(response);
        setUsuario(data);
        updateUser(data);
        setError(null);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Error al cargar el perfil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      controller.abort();
    };
  }, [user?.id, updateUser]);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(endpoints.profileAvatar(usuario.id), {
        method: "POST",
        body: formData,
      });

      const data = await handleResponse(response) as { avatar_url: string; profile: UsuarioData };
      setUsuario(data.profile);
      updateUser({ avatar_url: data.avatar_url });
      toast({
        title: "Foto de perfil actualizada",
        description: "Tu avatar se actualizo correctamente.",
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "No se pudo actualizar la foto de perfil.";
      toast({
        variant: "destructive",
        title: "Error al subir imagen",
        description,
      });
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !usuario) return;

    setIsUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("cover", file);

      const response = await fetch(endpoints.profileCover(usuario.id), {
        method: "POST",
        body: formData,
      });

      const data = await handleResponse(response) as { portada_url: string; profile: UsuarioData };
      setUsuario(data.profile);
      updateUser({ portada_url: data.portada_url });
      toast({
        title: "Portada actualizada",
        description: "La imagen de portada se actualizo correctamente.",
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "No se pudo actualizar la portada.";
      toast({
        variant: "destructive",
        title: "Error al subir portada",
        description,
      });
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  };

  const achievements = useMemo(
    () => [
      {
        icon: Award,
        title: "Primer Proyecto",
        description: "Completa tu primer proyecto exitosamente",
      },
      {
        icon: Target,
        title: "Colaborador Activo",
        description: "Participa en más de 5 proyectos colaborativos",
      },
      {
        icon: Star,
        title: "Mentor Junior",
        description: "Ayuda a otros aprendices con sus proyectos",
      },
    ],
    []
  );

  const skills = useMemo(
    () => [
      "React",
      "Node.js",
      "JavaScript",
      "TypeScript",
      "Python",
      "SQL",
      "Git",
      "HTML",
      "CSS",
      "Tailwind",
    ],
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{isLoading ? "Cargando perfil..." : "Perfil no disponible"}</p>
      </div>
    );
  }

  const handleProfileUpdated = (perfilActualizado: UsuarioData) => {
    setUsuario(perfilActualizado);
    updateUser(perfilActualizado);
  };

  const initials = getInitials(usuario.nombre_completo);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-48">
              {usuario.portada_url ? (
                <img
                  src={usuario.portada_url}
                  alt="Portada del perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-r from-primary to-primary/80" />
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 text-foreground hover:bg-white"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
              >
                {isUploadingCover ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Paintbrush className="h-4 w-4" />
                )}
                Cambiar portada
              </Button>
            </div>
            <div className="px-6 pb-6">
              <div className="flex flex-wrap items-end justify-between gap-4 -mt-16 mb-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden text-4xl font-bold text-primary">
                    {usuario.avatar_url ? (
                      <img
                        src={usuario.avatar_url}
                        alt={usuario.nombre_completo}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-2 right-2 rounded-full bg-white/90 text-foreground hover:bg-white"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paintbrush className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 mb-2">
                  <Button
                    variant="outline"
                    className="shadow-md bg-card hover:bg-accent border-2"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir Perfil
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90 shadow-md border-2 border-primary"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-1">{usuario.nombre_completo}</h1>
                <p className="text-muted-foreground mb-2">
                  {usuario.ocupacion ?? "Agrega tu rol profesional"}
                </p>
                <p className="text-sm text-muted-foreground">{usuario.correo}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {usuario.ubicacion && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {usuario.ubicacion}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Se unio en {new Date(usuario.fecha_union).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center shadow-hover-effect">
              <Folder className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{usuario.stats?.projects ?? 0}</p>
              <p className="text-sm text-muted-foreground">Proyectos</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{usuario.stats?.connections ?? 0}</p>
              <p className="text-sm text-muted-foreground">Conexiones</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">{usuario.stats?.courses ?? 0}</p>
              <p className="text-sm text-muted-foreground">Cursos</p>
            </Card>
          </div>

          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Acerca de mí
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {usuario.bio || "Este usuario aún no ha escrito una biografía."}
            </p>
          </Card>

          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Logros
            </h2>
            <div className="space-y-4">
              {achievements.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        perfil={usuario}
        setPerfil={handleProfileUpdated}
      />
    </div>
  );
};

export default Perfil;
