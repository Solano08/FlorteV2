import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { endpoints, handleResponse } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type CreateProjectPayload = {
  titulo: string;
  descripcion: string;
  estado: string;
  rol: string;
  usuarioId: number;
};

const initialState: CreateProjectPayload = {
  titulo: "",
  descripcion: "",
  estado: "activo",
  rol: "Lider",
  usuarioId: 0,
};

const CrearProyecto = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<CreateProjectPayload>({
    ...initialState,
    usuarioId: user?.id ?? 0,
  });

  const mutation = useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const response = await fetch(endpoints.projects, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return handleResponse(response);
    },
    onSuccess: (data: { project: { id: number } }) => {
      toast({
        title: "Proyecto creado",
        description: "Tu proyecto fue creado correctamente.",
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard", user?.id] });
      navigate(`/proyectos/${data.project.id}`);
    },
    onError: (error) => {
      const description =
        error instanceof Error ? error.message : "No se pudo crear el proyecto.";
      toast({
        variant: "destructive",
        title: "Error al crear proyecto",
        description,
      });
    },
  });

  const handleChange = (field: keyof CreateProjectPayload, value: string) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Sesion no valida",
        description: "Vuelve a iniciar sesion para crear proyectos.",
      });
      return;
    }

    if (!formState.titulo.trim()) {
      toast({
        variant: "destructive",
        title: "Titulo requerido",
        description: "Ingresa un nombre para tu proyecto.",
      });
      return;
    }

    mutation.mutate({
      ...formState,
      titulo: formState.titulo.trim(),
      descripcion: formState.descripcion.trim(),
      usuarioId: user.id,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card className="p-6 space-y-6 shadow-hover-effect">
          <div>
            <h1 className="text-3xl font-bold">Crear un nuevo proyecto</h1>
            <p className="text-sm text-muted-foreground">
              Describe tu idea y comparte los objetivos con tu equipo.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="titulo">Titulo del proyecto</Label>
              <Input
                id="titulo"
                value={formState.titulo}
                onChange={(event) => handleChange("titulo", event.target.value)}
                placeholder="Ejemplo: Plataforma de gestion academica"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripcion</Label>
              <Textarea
                id="descripcion"
                value={formState.descripcion}
                onChange={(event) => handleChange("descripcion", event.target.value)}
                placeholder="Cuenta los objetivos, alcance y necesidades del proyecto."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formState.estado}
                  onValueChange={(value) => handleChange("estado", value)}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="archivado">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rol">Rol en el proyecto</Label>
                <Input
                  id="rol"
                  value={formState.rol}
                  onChange={(event) => handleChange("rol", event.target.value)}
                  placeholder="Ejemplo: Lider tecnico"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Creando..." : "Crear proyecto"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CrearProyecto;
