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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] florte-card-elevated animate-scale-in">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isUpdating}
            />
          </div>

          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={isUpdating}
            />
          </div>

          <div>
            <Label htmlFor="githubUrl">URL de GitHub</Label>
            <Input
              id="githubUrl"
              value={formData.githubUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
              disabled={isUpdating}
            />
          </div>

          <div>
            <Label htmlFor="aboutMe">Acerca de mí</Label>
            <Textarea
              id="aboutMe"
              value={formData.aboutMe}
              onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
              disabled={isUpdating}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <FlorteButton type="button" variant="florte-outline" onClick={onClose}>
              Cancelar
            </FlorteButton>
            <FlorteButton type="submit" variant="florte" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar'}
            </FlorteButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};