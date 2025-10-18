import { useState } from "react";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perfil: PerfilData;
  setPerfil: (perfil: PerfilData) => void;
}

const EditProfileDialog = ({ open, onOpenChange, perfil, setPerfil }: Props) => {
  const [formData, setFormData] = useState<PerfilData>(perfil);
  const [loading, setLoading] = useState(false);

  // ⚡ Manejar cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ⚡ Guardar cambios en API con token
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // 🔑 recuperar token del login

      if (!token) {
        alert("No se encontró el token. Por favor, inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      const { id, fecha_union, ...dataToSend } = formData;

      const res = await fetch(`http://localhost:5000/api/profile/${perfil.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ envío del token
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const updatedPerfil = await res.json();

      const normalizedPerfil: PerfilData = {
        id: updatedPerfil.id,
        nombre_completo: updatedPerfil.nombre_completo,
        bio: updatedPerfil.bio ?? null,
        github_url: updatedPerfil.github_url ?? null,
        linkedin_url: updatedPerfil.linkedin_url ?? null,
        ubicacion: updatedPerfil.ubicacion ?? null,
        ocupacion: updatedPerfil.ocupacion ?? null,
        correo: updatedPerfil.correo,
        fecha_union: updatedPerfil.fecha_union,
      };

      setPerfil(normalizedPerfil);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar los cambios.");
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
            name="ocupacion"
            value={formData.ocupacion || ""}
            onChange={handleChange}
            placeholder="Ocupación"
          />
          <Input
            name="ubicacion"
            value={formData.ubicacion || ""}
            onChange={handleChange}
            placeholder="Ubicación"
          />
          <Textarea
            name="bio"
            value={formData.bio || ""}
            onChange={handleChange}
            placeholder="Biografía"
          />
          <Input
            name="github_url"
            value={formData.github_url || ""}
            onChange={handleChange}
            placeholder="GitHub URL"
          />
          <Input
            name="linkedin_url"
            value={formData.linkedin_url || ""}
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
