'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Registro = {
  usuario: string;
  tipo: 'entrada' | 'salida';
  hora: string;
  metodo: string;
};

export default function MisRegistros() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.email) {
  setUsuario(user.email);
  const q = query(
    collection(db, 'registros'),
    where('usuario', '==', user.email),
    orderBy('hora', 'desc')
  );
  const snapshot = await getDocs(q);
  const datos = snapshot.docs.map(doc => doc.data() as Registro);
  setRegistros(datos);
}
 else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="p-10 min-h-screen bg-white text-gray-800">
      {/* 🔙 Botón de regreso */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ← Volver al registro
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Mis Registros</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded shadow">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Tipo</th>
              <th className="py-2 px-4 border">Hora</th>
              <th className="py-2 px-4 border">Método</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, index) => (
              <tr key={index} className="text-center border-b hover:bg-gray-50">
                <td className={`py-2 px-4 border font-semibold ${
                  r.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {r.tipo === 'entrada' ? '🔓 Entrada' : '🔒 Salida'}
                </td>
                <td className="py-2 px-4 border">{new Date(r.hora).toLocaleString()}</td>
                <td className="py-2 px-4 border">{r.metodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
