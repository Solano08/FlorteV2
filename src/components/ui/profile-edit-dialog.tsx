import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FlorteButton } from '@/components/ui/florte-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { UpdateProfileData, UserProfile } from '@/hooks/useProfile';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onSave: (data: UpdateProfileData) => Promise<boolean>;
  isUpdating: boolean;
}

export const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  isUpdating,
}) => {
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: profile?.name || '',
    phone: profile?.phone || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    aboutMe: profile?.aboutMe || '',
  });

  const [errors, setErrors] = useState<Partial<UpdateProfileData>>({});

  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        aboutMe: profile.aboutMe,
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateProfileData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (formData.githubUrl && !formData.githubUrl.startsWith('https://github.com/')) {
      newErrors.githubUrl = 'Debe ser una URL válida de GitHub';
    }

    if (formData.linkedinUrl && !formData.linkedinUrl.startsWith('https://linkedin.com/')) {
      newErrors.linkedinUrl = 'Debe ser una URL válida de LinkedIn';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const success = await onSave(formData);
    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] florte-card-elevated animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-primary mr-3 flex items-center justify-center">
              <Save className="w-4 h-4 text-white" />
            </div>
            Editar Perfil
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Actualiza tu información personal. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-edit-field">
            <Label htmlFor="name" className="profile-edit-label">
              Nombre completo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="profile-edit-input"
              placeholder="Ingresa tu nombre completo"
              disabled={isUpdating}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div className="profile-edit-field">
            <Label htmlFor="phone" className="profile-edit-label">
              Teléfono *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="profile-edit-input"
              placeholder="+57 300 123 4567"
              disabled={isUpdating}
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="profile-edit-field">
            <Label htmlFor="githubUrl" className="profile-edit-label">
              URL de GitHub
            </Label>
            <Input
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
              className="profile-edit-input"
              placeholder="https://github.com/tu-usuario"
              disabled={isUpdating}
            />
            {errors.githubUrl && (
              <p className="text-sm text-destructive mt-1">{errors.githubUrl}</p>
            )}
          </div>

          <div className="profile-edit-field">
            <Label htmlFor="linkedinUrl" className="profile-edit-label">
              URL de LinkedIn
            </Label>
            <Input
              id="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className="profile-edit-input"
              placeholder="https://linkedin.com/in/tu-perfil"
              disabled={isUpdating}
            />
            {errors.linkedinUrl && (
              <p className="text-sm text-destructive mt-1">{errors.linkedinUrl}</p>
            )}
          </div>

          <div className="profile-edit-field">
            <Label htmlFor="aboutMe" className="profile-edit-label">
              Acerca de mí
            </Label>
            <Textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => handleInputChange('aboutMe', e.target.value)}
              className="profile-edit-textarea"
              placeholder="Cuéntanos sobre ti, tus intereses y objetivos profesionales..."
              disabled={isUpdating}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <FlorteButton
              type="button"
              variant="florte-outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </FlorteButton>
            <FlorteButton
              type="submit"
              variant="florte"
              disabled={isUpdating}
              className="shadow-green"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </FlorteButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};