// app/login/page.tsx
'use client';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, clave);
      router.push("/"); // redirige al home
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 mb-2 w-full"
        placeholder="Contraseña"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />
      <button
        onClick={login}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Ingresar
      </button>
    </main>
  );
}
