import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlorteButton } from "@/components/ui/florte-button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import UserAvatar from "@/components/ui/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FolderOpen, 
  Users, 
  BookOpen, 
  Share, 
  ChevronDown,
  Edit,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Award
} from "lucide-react";

const Profile = () => {
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

  return (
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
                  alt="Ana García Rodríguez"
                  fallback="AG"
                  size="xl"
                  className="border-4 border-background shadow-large"
                  online
                />
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <h1 className="text-2xl font-bold text-card-foreground">Ana García Rodríguez</h1>
                      <p className="text-lg text-muted-foreground">Desarrolladora Full Stack Junior</p>
                      <p className="text-sm text-muted-foreground">ana.garcia@sena.edu.co</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <FlorteButton variant="florte-outline">
                        <Share className="w-4 h-4 mr-2" />
                        Compartir Perfil
                      </FlorteButton>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FlorteButton variant="florte">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Perfil
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </FlorteButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar nombre</DropdownMenuItem>
                          <DropdownMenuItem>Editar teléfono</DropdownMenuItem>
                          <DropdownMenuItem>Editar URL GitHub</DropdownMenuItem>
                          <DropdownMenuItem>Editar URL LinkedIn</DropdownMenuItem>
                          <DropdownMenuItem>Editar "Acerca de mí"</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                  Apasionada por el desarrollo web y la tecnología. Estudiante de ADSO 
                  en el SENA, enfocada en React, Node.js y bases de datos. Siempre 
                  buscando aprender nuevas tecnologías y contribuir a proyectos 
                  innovadores.
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
                  <span>Colombia</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Se unió en Septiembre 2023</span>
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
  );
};

export default Profile;