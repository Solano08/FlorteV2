import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { endpoints, handleResponse } from "../../lib/api";

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
  avatar_url: string | null;
  deleted_at?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perfil: PerfilData;
  setPerfil: (perfil: PerfilData) => void;
}

const EditProfileDialog = ({ open, onOpenChange, perfil, setPerfil }: Props) => {
  const [formData, setFormData] = useState<PerfilData>({ ...perfil });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ ...perfil });
    }
  }, [perfil, open]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { id, fecha_union, deleted_at, ...dataToSend } = formData;

      const response = await fetch(endpoints.profile(perfil.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const updatedPerfil = await handleResponse(response);
      setPerfil(updatedPerfil);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Hubo un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            name="nombre_completo"
            value={formData.nombre_completo}
            onChange={handleChange}
            placeholder="Nombre completo"
          />
          <Input
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Correo"
          />
          <Input
            name="ocupacion"
            value={formData.ocupacion ?? ""}
            onChange={handleChange}
            placeholder="Ocupación"
          />
          <Input
            name="ubicacion"
            value={formData.ubicacion ?? ""}
            onChange={handleChange}
            placeholder="Ubicación"
          />
          <Textarea
            name="bio"
            value={formData.bio ?? ""}
            onChange={handleChange}
            placeholder="Biografía"
          />
          <Input
            name="github_url"
            value={formData.github_url ?? ""}
            onChange={handleChange}
            placeholder="GitHub URL"
          />
          <Input
            name="linkedin_url"
            value={formData.linkedin_url ?? ""}
            onChange={handleChange}
            placeholder="LinkedIn URL"
          />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
