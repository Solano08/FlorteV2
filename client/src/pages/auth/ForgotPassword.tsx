import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import AuthLayout from "../../components/Auth/AuthLayout";
import { useToast } from "../../components/ui/use-toast";
import { endpoints, handleResponse } from "../../lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Las contraseñas no coinciden",
        description: "Verifica e inténtalo nuevamente.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoints.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      await handleResponse(response);

      toast({
        title: "Contraseña actualizada",
        description: "Ya puedes iniciar sesión con tu nueva contraseña.",
      });

      navigate("/login", { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "No se pudo actualizar la contraseña",
        description: error instanceof Error ? error.message : "Intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recupera tu cuenta"
      description="Ingresa tu correo para restablecer la contraseña."
      footer={
        <>
          <Link to="/login" className="text-primary hover:underline">
            Volver al inicio de sesión
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
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
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
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
