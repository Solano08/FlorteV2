import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Layout/Navbar";
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import TrendingSidebar from "../components/Widgets/TrendingSidebar";
import CreatePost from "../components/Feed/CreatePost";
import PostCard from "../components/Feed/PostCard";
import { Card } from "../components/ui/card";
import bannerImage from "../assets/florte-banner.jpg";
import { endpoints, handleResponse } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";

type DashboardStats = {
  projects: number;
  connections: number;
  courses: number;
};

type DashboardResponse = {
  stats: DashboardStats;
  trends: Array<{ tag: string; posts: number }>;
  suggestions: Array<{ id: number; name: string; role: string }>;
  mutualConnections: Array<{ id: number; name: string; role: string; isOnline: boolean }>;
};

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardResponse>({
    queryKey: ["dashboard", user?.id],
    enabled: Boolean(user?.id),
    retry: 1,
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("Usuario no disponible.");
      }
      const response = await fetch(endpoints.dashboard(user.id));
      return handleResponse(response) as Promise<DashboardResponse>;
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar la informacion del inicio.";
      toast({
        variant: "destructive",
        title: "Error al cargar inicio",
        description: message,
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3">
            <ProfileSidebar stats={dashboardData?.stats} isLoading={dashboardLoading} />
          </aside>

          <main className="lg:col-span-6 space-y-4">
            <Card className="overflow-hidden shadow-hover-effect relative h-[200px]">
              <img
                src={bannerImage}
                alt="Banner FLORTE"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-white mb-2">Bienvenido a FLORTE!</h2>
                <p className="text-white/90 text-lg">
                  Conecta, comparte y haz crecer tu red profesional
                </p>
              </div>
            </Card>

            <CreatePost />

            <PostCard
              author="Ana Garcia Rodriguez"
              initials="AG"
              date="15 de noviembre de 2023"
              content="Acabamos de finalizar nuestro proyecto de gestion de inventarios! Fue increible trabajar con React y Node.js. Aprendi mucho sobre APIs RESTful y manejo de estados."
              hasImage
            />
          </main>

          <aside className="lg:col-span-3">
            <TrendingSidebar
              trends={dashboardData?.trends}
              suggestions={dashboardData?.suggestions}
              mutualConnections={dashboardData?.mutualConnections}
              isLoading={dashboardLoading}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
