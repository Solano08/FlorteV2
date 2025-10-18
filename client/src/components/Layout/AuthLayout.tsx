// src/components/AuthLayout.tsx
import { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-center text-green-700 mb-6">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
