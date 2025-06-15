'use client';

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [horaActual, setHoraActual] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user.email);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setHoraActual(now.toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const registrar = async (tipo: "entrada" | "salida") => {
    const hora = new Date().toISOString();
    await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: usuario,
        tipo,
        hora,
        metodo: "QR"
      })
    });
    alert(`Registro de ${tipo} exitoso`);
  };

  const cerrarSesion = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      {/* Botón flotante hacia escáner */}
      <button
        onClick={() => router.push("/qr-acceso")}
        className="absolute top-4 left-4 bg-white text-blue-700 border border-blue-300 px-3 py-1 rounded shadow hover:bg-blue-50 transition text-sm"
      >
        ← QR
      </button>

      <div className="bg-white rounded-2xl shadow-lg px-6 py-10 sm:px-10 sm:py-12 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Bienvenido</h1>
        <p className="text-blue-700 font-semibold break-words mb-4">{usuario}</p>

        <p className="text-lg font-mono text-gray-600 mb-6">Hora actual: {horaActual}</p>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push("/escanear?tipo=entrada")}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          >
            Registrar Entrada
          </button>
          <button
            onClick={() => router.push("/escanear?tipo=salida")}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
          >
            Registrar Salida
          </button>
          <button
            onClick={() => router.push("/mis-registros")}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
          >
            Ver mi historial
          </button>
        </div>

        <button
          onClick={cerrarSesion}
          className="mt-6 text-sm text-gray-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
