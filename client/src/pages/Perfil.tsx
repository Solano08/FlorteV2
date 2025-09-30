import { useState } from "react";
import Navbar from "../components/Layout/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Share2, Edit, MapPin, Calendar, Folder, Users, BookOpen, Award, Target, Star } from "lucide-react";
import EditProfileDialog from "../components/Profile/EditProfileDialog";

const Perfil = () => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const achievements = [
    { icon: Award, title: "Primer Proyecto", description: "Completa tu primer proyecto exitosamente" },
    { icon: Target, title: "Colaborador Activo", description: "Participa en más de 5 proyectos colaborativos" },
    { icon: Star, title: "Mentor Junior", description: "Ayuda a otros aprendices con sus proyectos" },
  ];

  const skills = ["React", "Node.js", "JavaScript", "TypeScript", "Python", "SQL", "Git", "HTML", "CSS", "Tailwind"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Banner y perfil principal */}
          <Card className="overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-primary to-primary/80"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-16 mb-4">
                <Avatar className="h-32 w-32 border-4 border-card">
                  <AvatarFallback className="text-4xl bg-muted">AGR</AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mb-2">
                  <Button 
                    variant="outline" 
                    className="shadow-md bg-card hover:bg-accent border-2"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir Perfil
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 shadow-md border-2 border-primary"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-1">Ana García Rodríguez</h1>
                <p className="text-muted-foreground mb-2">Desarrolladora Full Stack Junior</p>
                <p className="text-sm text-muted-foreground">ana.garcia@sena.edu.co</p>
                <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Colombia
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Se unió en Septiembre 2023
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-6 text-center shadow-hover-effect">
              <Folder className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Proyectos</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">89</p>
              <p className="text-sm text-muted-foreground">Amigos</p>
            </Card>
            <Card className="p-6 text-center shadow-hover-effect">
              <BookOpen className="h-10 w-10 mx-auto mb-2 text-primary" />
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Cursos</p>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Historias */}
            <Card className="p-6 shadow-hover-effect">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Historias
                </h2>
                <Button variant="link" size="sm" className="text-primary">+ Agregar</Button>
              </div>
              <p className="text-center text-muted-foreground py-8">No hay historias para mostrar</p>
            </Card>

            {/* Información */}
            <Card className="p-6 shadow-hover-effect">
              <h2 className="text-xl font-semibold mb-4">Información</h2>
              <div className="space-y-3 text-sm">
                <p>Aprendiz SENA</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Colombia
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Se unió en Septiembre 2023
                </div>
              </div>
            </Card>
          </div>

          {/* Acerca de mí */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Acerca de mí
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Apasionada por el desarrollo web y la tecnología. Estudiante de ADSO en el SENA, 
              enfocada en React, Node.js y bases de datos. Siempre buscando aprender nuevas 
              tecnologías y contribuir a proyectos innovadores.
            </p>
          </Card>

          {/* Habilidades */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Habilidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-brand-light text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          {/* Logros */}
          <Card className="p-6 shadow-hover-effect">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Logros
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-brand-light rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  );
};

export default Perfil;
