import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useToast } from "../../components/ui/use-toast";
import { endpoints, handleResponse } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Las contraseñas no coinciden",
        description: "Verifica e inténtalo nuevamente.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoints.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await handleResponse(response);
      login(data.user);

      toast({
        title: "Registro completado",
        description: "Tu cuenta fue creada con éxito.",
      });

      navigate("/", { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "No se pudo completar el registro",
        description: error instanceof Error ? error.message : "Intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Únete a la red social de aprendices SENA."
      footer={
        <>
          ¿Ya tienes una cuenta? {" "}
          <Link to="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            placeholder="Ana García Rodríguez"
          />
        </div>

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

        <div className="space-y-2 text-left">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
