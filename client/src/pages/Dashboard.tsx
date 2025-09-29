import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { FlorteButton } from "./../components/ui/florte-button";
import StatsCard from "./../components/ui/stats-card";
import UserAvatar from "./../components/ui/user-avatar";
import { 
  FolderOpen, 
  Users, 
  BookOpen, 
  Plus, 
  UserPlus, 
  Search,
  Image,
  FileText,
  Heart,
  MessageCircle,
  Share
} from "lucide-react";
import { Input } from "./../components/ui/input";

const Dashboard = () => {
  const trendingTopics = [
    { tag: "#ReactJS", posts: 155 },
    { tag: "#SENA", posts: 89 },
    { tag: "#Desarrollo", posts: 67 },
    { tag: "#JavaScript", posts: 45 }
  ];

  const suggestions = [
    { name: "Carlos Mendoza", role: "Frontend Developer", avatar: "CM" },
    { name: "María López", role: "UX Designer", avatar: "ML" },
    { name: "Juan Pérez", role: "Backend Developer", avatar: "JP" }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* User Profile Card */}
          <Card className="florte-card">
            <CardContent className="p-6 text-center">
              <UserAvatar
                src="/placeholder-avatar.jpg"
                alt="Ana García Rodríguez"
                fallback="AG"
                size="xl"
                className="mx-auto mb-4"
                online
              />
              <h3 className="font-bold text-card-foreground">Ana García Rodríguez</h3>
              <p className="text-sm text-muted-foreground mb-4">Desarrolladora Full Stack Junior</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">156</p>
                  <p className="text-xs text-muted-foreground">Siguiendo</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">245</p>
                  <p className="text-xs text-muted-foreground">Seguidores</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            <StatsCard icon={FolderOpen} title="Proyectos Activos" value="12" />
            <StatsCard icon={Users} title="Conexiones" value="89" />
            <StatsCard icon={BookOpen} title="Cursos" value="6" />
          </div>

          {/* Quick Actions */}
          <Card className="florte-card">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FlorteButton variant="florte" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Crear Proyecto
              </FlorteButton>
              <FlorteButton variant="florte-outline" className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Unirse a Grupo
              </FlorteButton>
              <FlorteButton variant="florte-outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Explorar Cursos
              </FlorteButton>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6 space-y-6">
          {/* Welcome Banner */}
          <Card className="florte-card bg-gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-2">¡Bienvenido a FLORTE!</h1>
              <p className="text-white/90">Conecta, comparte y haz crecer tu red profesional</p>
            </CardContent>
          </Card>

          {/* Create Post */}
          <Card className="florte-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <UserAvatar src="/placeholder-avatar.jpg" alt="Ana García" fallback="AG" />
                <Input 
                  placeholder="¿Qué estás pensando?" 
                  className="flex-1 bg-muted border-0 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <Image className="w-4 h-4 mr-2" />
                    Foto/Video
                  </button>
                  <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <FileText className="w-4 h-4 mr-2" />
                    Artículo
                  </button>
                  <button className="flex items-center text-sm text-muted-foreground hover:text-primary">
                    <Heart className="w-4 h-4 mr-2" />
                    Sentimiento
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Post */}
          <Card className="florte-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <UserAvatar src="/placeholder-avatar.jpg" alt="Ana García" fallback="AG" online />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-card-foreground">Ana García Rodríguez</h4>
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">15 de noviembre de 2023</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground mb-4">
                ¡Acabamos de finalizar nuestro proyecto de gestión de inventarios! 🚀 
                Fue increíble trabajar con React y Node.js. Aprendí mucho sobre APIs 
                RESTful y manejo de estados.
              </p>
              <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                <Image className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Me gusta</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">Comentar</span>
                </button>
                <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary">
                  <Share className="w-5 h-5" />
                  <span className="text-sm">Compartir</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Trending Topics */}
          <Card className="florte-card">
            <CardHeader>
              <CardTitle className="text-lg">Tendencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-primary font-medium">{topic.tag}</span>
                  <span className="text-sm text-muted-foreground">{topic.posts} posts</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* People Suggestions */}
          <Card className="florte-card">
            <CardHeader>
              <CardTitle className="text-lg">Personas que podrías conocer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestions.map((person, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <UserAvatar src="" alt={person.name} fallback={person.avatar} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{person.name}</p>
                      <p className="text-xs text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                  <FlorteButton variant="florte-outline" size="sm">
                    Conectar
                  </FlorteButton>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;