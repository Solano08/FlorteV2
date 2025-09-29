import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/grupos" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Grupos - Próximamente</h1></div>} />
            <Route path="/amigos" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Amigos - Próximamente</h1></div>} />
            <Route path="/chat" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Chat - Próximamente</h1></div>} />
            <Route path="/biblioteca" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Biblioteca - Próximamente</h1></div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
