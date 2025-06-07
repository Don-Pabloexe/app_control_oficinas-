'use client';

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [horaActual, setHoraActual] = useState<string>("");
  const [codigoQR, setCodigoQR] = useState<string>("");  // Nuevo estado
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
    const metodo = codigoQR.trim() !== "" ? `QR:${codigoQR}` : "QR";
    await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: usuario,
        tipo,
        hora,
        metodo
      })
    });
    alert(`Registro de ${tipo} exitoso con código: ${codigoQR || "N/A"}`);
    setCodigoQR("");  // Limpia el campo
  };

  const cerrarSesion = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white rounded-2xl shadow-lg px-6 py-10 sm:px-10 sm:py-12 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Bienvenido</h1>
        <p className="text-blue-700 font-semibold break-words mb-4">{usuario}</p>

        <p className="text-lg font-mono text-gray-600 mb-6">Hora actual: {horaActual}</p>

        {/* 🆕 Campo para código QR simulado */}
        <input
          type="text"
          placeholder="Simular código QR"
          className="w-full mb-4 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={codigoQR}
          onChange={(e) => setCodigoQR(e.target.value)}
        />

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => registrar("entrada")}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          >
            Registrar Entrada
          </button>
          <button
            onClick={() => registrar("salida")}
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
