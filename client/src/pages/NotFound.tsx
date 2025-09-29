import { Link } from "react-router-dom";
import { FlorteButton } from "./../components/ui/florte-button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Página no encontrada</h2>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <FlorteButton variant="florte" asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Link>
          </FlorteButton>
          <FlorteButton variant="florte-outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver Atrás
          </FlorteButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;