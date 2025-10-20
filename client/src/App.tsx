import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AuthRedirect from "./components/Auth/AuthRedirect";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/grupos"
                element={
                  <ProtectedRoute>
                    <Grupos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proyectos/crear"
                element={
                  <ProtectedRoute>
                    <CrearProyecto />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/proyectos/:projectId"
                element={
                  <ProtectedRoute>
                    <ProyectoDetalle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/amigos"
                element={
                  <ProtectedRoute>
                    <Amigos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <ChatsPrivados />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/biblioteca"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRedirect>
                    <Register />
                  </AuthRedirect>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthRedirect>
                    <ForgotPassword />
                  </AuthRedirect>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
