// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import AuthLayout from "../components/Layout/AuthLayout";

export default function Login(): JSX.Element {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(correo, password);

      // guardar token y datos del usuario
      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // feedback y redirección
      // usa un método menos intrusivo en producción (no alert)
      alert("✅ Inicio de sesión exitoso");
      navigate("/biblioteca");
    } catch (err) {
      console.error("Error login:", err);

      // Manejo seguro del 'catch' (err es unknown)
      let message = "Error al iniciar sesión, revisa tus datos.";

      if (typeof err === "object" && err !== null) {
        // Si viene de Axios: err.response.data.message
        // usamos comprobaciones defensivas
        const typedErr = err as { response?: { data?: { message?: unknown } }; message?: unknown };
        if (typedErr.response && typedErr.response.data) {
          const respMsg = typedErr.response.data.message;
          if (typeof respMsg === "string" && respMsg.length > 0) {
            message = respMsg;
          }
        } else if (typeof typedErr.message === "string" && typedErr.message.length > 0) {
          // Error estándar con .message
          message = typedErr.message;
        }
      }

      setError(message);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-600"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-green-600"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Ingresar
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm text-center mt-3" role="alert">
          {error}
        </p>
      )}
    </AuthLayout>
  );
}
