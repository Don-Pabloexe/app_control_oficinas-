'use client';

import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user.email); // o user.displayName si lo configuras
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const registrar = async () => {
    const hora = new Date().toISOString();

    await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: usuario,
        tipo: "entrada",
        hora,
        metodo: "QR"
      })
    });

    alert("Acceso registrado");
  };

  return (
    <main className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-bold">Bienvenido {usuario}</h1>
      <button
        onClick={registrar}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Registrar Ingreso
      </button>
    </main>
  );
}
