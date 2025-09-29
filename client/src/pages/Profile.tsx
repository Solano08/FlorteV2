import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlorteButton } from "@/components/ui/florte-button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import UserAvatar from "@/components/ui/user-avatar";
import { ProfileEditDialog } from "@/components/ui/profile-edit-dialog";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FolderOpen, 
  Users, 
  BookOpen, 
  Share, 
  Edit,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Award,
  Github,
  Linkedin,
  ExternalLink
} from "lucide-react";

const Profile = () => {
  const { profile, loading, updating, updateProfile } = useProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const skills = [
    "JavaScript", "React", "Node.js", "TypeScript", "MySQL", "Git", "CSS", "HTML"
  ];

  const achievements = [
    {
      title: "Primer Proyecto",
      description: "Completa tu primer proyecto exitosamente",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Colaborador Activo", 
      description: "Participa en más de 5 proyectos colaborativos",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Mentor Junior",
      description: "Ayuda a otros aprendices con sus proyectos", 
      icon: Star,
      color: "text-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Card className="florte-card overflow-hidden">
            <div className="h-48 bg-gradient-primary"></div>
            <CardContent className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-12">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-56" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-muted-foreground">No se pudo cargar el perfil</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="relative">
            <Card className="florte-card overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-primary"></div>
              
              {/* Profile Info */}
              <CardContent className="relative px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-12">
                  <UserAvatar
                    src="/placeholder-avatar.jpg"
                    alt={profile.name}
                    fallback={profile.name.split(' ').map(n => n[0]).join('')}
                    size="xl"
                    className="border-4 border-background shadow-large"
                    online
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div>
                        <h1 className="text-2xl font-bold text-card-foreground">{profile.name}</h1>
                        <p className="text-lg text-muted-foreground">{profile.role}</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <div className="flex items-center gap-4 mt-2">
                          {profile.githubUrl && (
                            <a
                              href={profile.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-items-center text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Github className="w-4 h-4 mr-1 inline" />
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                          {profile.linkedinUrl && (
                            <a
                              href={profile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Linkedin className="w-4 h-4 mr-1 inline" />
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <FlorteButton variant="florte-outline">
                          <Share className="w-4 h-4 mr-2" />
                          Compartir Perfil
                        </FlorteButton>
                        
                        <FlorteButton 
                          variant="florte"
                          onClick={() => setIsEditDialogOpen(true)}
                          className="shadow-green"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </FlorteButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={FolderOpen} title="Proyectos" value="12" />
            <StatsCard icon={Users} title="Amigos" value="89" />
            <StatsCard icon={BookOpen} title="Cursos" value="6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Stories */}
              <Card className="florte-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    Historias
                  </CardTitle>
                  <FlorteButton variant="florte-ghost" size="sm">
                    + Agregar
                  </FlorteButton>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No hay historias para mostrar
                  </p>
                </CardContent>
              </Card>

              {/* About Me */}
              <Card className="florte-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-primary" />
                    Acerca de mí
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-card-foreground leading-relaxed">
                    {profile.aboutMe}
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="florte-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-primary" />
                    Habilidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Information */}
              <Card className="florte-card">
                <CardHeader>
                  <CardTitle>Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
                    <span>Aprendiz SENA</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-3" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Se unió en {profile.joinDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="florte-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-primary" />
                    Logros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <Icon className={`w-6 h-6 ${achievement.color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <h4 className="font-medium text-card-foreground">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ProfileEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        profile={profile}
        onSave={updateProfile}
        isUpdating={updating}
      />
    </>
  );
};

export default Profile;