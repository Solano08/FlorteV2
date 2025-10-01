import { useEffect, useState } from "react";
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
} from "lucide-react";
import EditProfileDialog from "../components/Profile/EditProfileDialog";

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
}

const Perfil = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const achievements = [
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
  ];

  const skills = [
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
  ];

  useEffect(() => {
    const userId = 1;
    const url = `http://localhost:5000/api/profile/${userId}`;

    console.log("🔍 Haciendo fetch a:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Datos recibidos del backend:", data);
        setUsuario(data);
      })
      .catch((err) => {
        console.error("❌ Error cargando usuario:", err);
        setError(err.message);
      });
  }, []);

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
        <p>Cargando perfil...</p>
      </div>
    );
  }

  // ⚡ Generar iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Banner y perfil principal */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-primary to-primary/80"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-16 mb-4">
                {/* 🔹 Avatar reemplazado por iniciales */}
                <div className="h-32 w-32 border-4 border-card rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-primary">
                  {getInitials(usuario.nombre_completo)}
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
                <h1 className="text-3xl font-bold mb-1">
                  {usuario.nombre_completo}
                </h1>
                <p className="text-muted-foreground mb-2">{usuario.ocupacion}</p>
                <p className="text-sm text-muted-foreground">{usuario.correo}</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  {usuario.ubicacion && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {usuario.ubicacion}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Se unió en{" "}
                    {new Date(usuario.fecha_union).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6 text-center shadow-hover-effect">
              <Folder className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Proyectos</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">89</p>
              <p className="text-sm text-muted-foreground">Amigos</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Cursos</p>
            </Card>
          </div>

          {/* Acerca de mí */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Acerca de mí
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {usuario.bio || "Este usuario aún no ha escrito una biografía."}
            </p>
          </Card>

          {/* Habilidades */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-brand-light text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Logros */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Logros
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-brand-light rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        perfil={usuario}
        setPerfil={setUsuario}
      />
    </div>
  );
};

export default Perfil;
