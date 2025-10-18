// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Correo para recuperar:", correo);
    // Aquí se integrará con backend (enviar correo)
  };

  return (
    <AuthLayout title="Recuperar Contraseña">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Enviar enlace
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        <Link to="/login" className="text-green-600 hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
