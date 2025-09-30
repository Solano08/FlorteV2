import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const [formData, setFormData] = useState({
    nombre: "Ana García Rodríguez",
    email: "ana.garcia@sena.edu.co",
    telefono: "+57 300 123 4567",
    cargo: "Desarrolladora Full Stack Junior",
    ubicacion: "Colombia",
    acercaDeMi: "Apasionada por el desarrollo web y la tecnología. Estudiante de ADSO en el SENA, enfocada en React, Node.js y bases de datos. Siempre buscando aprender nuevas tecnologías y contribuir a proyectos innovadores.",
  });

  const [habilidades, setHabilidades] = useState<string[]>([
    "React", "Node.js", "JavaScript", "TypeScript", "Python", "SQL", "Git", "HTML", "CSS", "Tailwind"
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!habilidades.includes(newSkill.trim())) {
        setHabilidades([...habilidades, newSkill.trim()]);
        setNewSkill("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setHabilidades(habilidades.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Perfil actualizado correctamente");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-effect border-2 border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-lg pointer-events-none" />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-semibold">Nombre completo</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-semibold">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ubicacion" className="text-sm font-semibold">Ubicación</Label>
              <Input
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo" className="text-sm font-semibold">Cargo/Rol</Label>
            <Input
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acercaDeMi" className="text-sm font-semibold">Acerca de mí</Label>
            <Textarea
              id="acercaDeMi"
              name="acercaDeMi"
              value={formData.acercaDeMi}
              onChange={handleChange}
              rows={4}
              className="resize-none glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="habilidades" className="text-sm font-semibold">Habilidades</Label>
            <Input
              id="habilidades"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Escribe una habilidad y presiona Enter"
              className="glass-input"
            />
            <div className="flex flex-wrap gap-2 mt-3 p-3 rounded-lg bg-muted/30 backdrop-blur-sm min-h-[60px]">
              {habilidades.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-primary/90 to-primary/80 text-primary-foreground text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {habilidades.length === 0 && (
                <span className="text-muted-foreground text-sm">No hay habilidades agregadas</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="glass-button"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
