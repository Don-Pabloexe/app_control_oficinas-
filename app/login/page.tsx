'use client';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setError(""); // Limpia errores anteriores

    try {
      // 1. Iniciar sesión con Autenticación de Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, clave);
      const user = userCredential.user;

      // 2. Buscar el documento del usuario en Firestore para obtener su rol
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // 3. Redirigir basado en el rol del usuario
      if (userDocSnap.exists() && userDocSnap.data().role === 'admin') {
        // Si el documento existe y el rol es 'admin', va al panel de admin
        router.push("/registros");
      } else {
        // Para cualquier otro caso (rol de 'user' o si no tiene rol definido)
        router.push("/");
      }

    } catch (err: any) {
      // Manejo de errores de autenticación
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error inesperado.");
        console.error("Error de inicio de sesión:", err);
      }
    }
  };

  // Función para permitir el inicio de sesión presionando "Enter"
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      login();
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Control de Accesos</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-3 border border-gray-400 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="p-3 border border-gray-400 text-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={login}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </main>
  );
}