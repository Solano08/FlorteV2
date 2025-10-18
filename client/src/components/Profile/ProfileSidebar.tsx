import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Folder, Users, BookOpen, Plus, UserPlus, Pencil } from "lucide-react";
import EditProfileDialog from "./EditProfileDialog";

interface PerfilData {
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

const ProfileSidebar = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  // ⚡ Cargar datos del perfil desde el backend
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // 👇 Cambia el id por el del usuario logueado (por ahora fijo 1)
        const res = await fetch("http://localhost:5000/api/profile/1");
        if (!res.ok) throw new Error("Error al obtener perfil");

        const data = await res.json();
        setPerfil(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPerfil();
  }, []);

  if (!perfil) {
    return (
      <div className="text-center text-muted-foreground mt-6">
        Cargando perfil...
      </div>
    );
  }

  const iniciales = perfil.nombre_completo
    ? perfil.nombre_completo
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "US";

  return (
    <div className="space-y-4">
      {/* 🧑 Card principal del perfil */}
      <Card className="p-6 text-center shadow-hover-effect">
        <Avatar className="h-20 w-20 mx-auto mb-4">
          <AvatarFallback className="text-2xl bg-muted">
            {iniciales}
          </AvatarFallback>
        </Avatar>

        <h3 className="font-semibold text-lg">{perfil.nombre_completo}</h3>
        <p className="text-sm text-muted-foreground">
          {perfil.ocupacion || "Sin ocupación"}
        </p>
        {perfil.ubicacion && (
          <p className="text-xs text-muted-foreground mt-1">
            📍 {perfil.ubicacion}
          </p>
        )}

        {perfil.bio && (
          <p className="text-sm text-muted-foreground mt-3 italic">
            “{perfil.bio}”
          </p>
        )}

        {/* 🔧 Botón para abrir modal de edición */}
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenEdit(true)}
            className="flex items-center mx-auto"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Editar perfil
          </Button>
        </div>

        <div className="flex justify-center gap-8 mt-5">
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

      {/* 📁 Proyectos */}
      <Card className="p-6 text-center shadow-hover-effect">
        <Folder className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">12</p>
        <p className="text-sm text-muted-foreground">Proyectos Activos</p>
      </Card>

      {/* 👥 Conexiones */}
      <Card className="p-6 text-center shadow-hover-effect">
        <Users className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">89</p>
        <p className="text-sm text-muted-foreground">Conexiones</p>
      </Card>

      {/* 📚 Cursos */}
      <Card className="p-6 text-center shadow-hover-effect">
        <BookOpen className="h-12 w-12 mx-auto mb-2 text-primary" />
        <p className="text-3xl font-bold">6</p>
        <p className="text-sm text-muted-foreground">Cursos</p>
      </Card>

      {/* ⚡ Acciones rápidas */}
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

      {/* 🧩 Modal para editar perfil */}
      <EditProfileDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        perfil={perfil}
        setPerfil={setPerfil}
      />
    </div>
  );
};

export default ProfileSidebar;
