import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  children: JSX.Element;
}

const AuthRedirect = ({ children }: Props) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (user) {
    const state = location.state as { from?: { pathname?: string } } | null;
    const redirectPath = state?.from?.pathname ?? "/";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthRedirect;
