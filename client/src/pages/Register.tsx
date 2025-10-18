// src/pages/Register.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/Layout/AuthLayout";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    usuario: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    // Aquí se conectará al backend con fetch()
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
          required
        />
        <input
          type="text"
          name="usuario"
          placeholder="Nombre de usuario"
          value={formData.usuario}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-green-600 outline-none"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Registrarme
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-green-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
