import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useToast } from "../../components/ui/use-toast";
import { endpoints, handleResponse } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(endpoints.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await handleResponse(response);
      login(data.user);

      toast({
        title: "Inicio de sesión exitoso",
        description: `¡Bienvenido de nuevo, ${data.user.nombre_completo}!`,
      });

      const state = location.state as { from?: { pathname?: string } } | null;
      const redirectPath = state?.from?.pathname ?? "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "No se pudo iniciar sesión",
        description: error instanceof Error ? error.message : "Intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Inicia sesión"
      description="Accede a tu cuenta para continuar aprendiendo y compartiendo."
      footer={
        <>
          ¿Aún no tienes cuenta? {" "}
          <Link to="/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
          <br />
          <Link to="/forgot-password" className="text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <Label htmlFor="email">Correo institucional</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="tu.correo@sena.edu.co"
          />
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
