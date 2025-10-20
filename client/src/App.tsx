import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Grupos from "./pages/Grupos";
import Amigos from "./pages/Amigos";
import ChatsPrivados from "./pages/ChatsPrivados";
import CrearProyecto from "./pages/CrearProyecto";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    const redirectState = { from: location };

    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" replace state={redirectState} />} />
        <Route path="*" element={<Navigate to="/login" replace state={redirectState} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/" replace />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/grupos" element={<Grupos />} />
      <Route path="/proyectos/crear" element={<CrearProyecto />} />
      <Route path="/proyectos/:projectId" element={<ProyectoDetalle />} />
      <Route path="/amigos" element={<Amigos />} />
      <Route path="/chats" element={<ChatsPrivados />} />
      <Route path="/biblioteca" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
