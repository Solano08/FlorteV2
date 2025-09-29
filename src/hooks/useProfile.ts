import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  aboutMe: string;
  role: string;
  location: string;
  joinDate: string;
}

export interface UpdateProfileData {
  name: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  aboutMe: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/profile`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      } else {
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setUpdating(true);
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        toast({
          title: "¡Perfil actualizado!",
          description: "Los cambios se han guardado correctamente",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: result.message || "No se pudo actualizar el perfil",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refetch: fetchProfile,
  };
};