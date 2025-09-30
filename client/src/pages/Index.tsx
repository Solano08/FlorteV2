import Navbar from "../components/Layout/Navbar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import TrendingSidebar from "../components/Widgets/TrendingSidebar";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Feed/PostCard";
import { Card } from "../components/ui/card";
import bannerImage from "../assets/florte-banner.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <ProfileSidebar />
          </aside>

          <main className="lg:col-span-6 space-y-4">
            <Card className="overflow-hidden shadow-hover-effect relative h-[200px]">
              <img 
                src={bannerImage} 
                alt="Banner FLORTE" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-white mb-2">¡Bienvenido a FLORTE!</h2>
                <p className="text-white/90 text-lg">
                  Conecta, comparte y haz crecer tu red profesional
                </p>
              </div>
            </Card>

            <CreatePost />

            <PostCard
              author="Ana García Rodríguez"
              initials="AG"
              date="15 de noviembre de 2023"
              content="¡Acabamos de finalizar nuestro proyecto de gestión de inventarios! 🚀 Fue increíble trabajar con React y Node.js. Aprendí mucho sobre APIs RESTful y manejo de estados."
              hasImage
            />
          </main>

          <aside className="lg:col-span-3">
            <TrendingSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
