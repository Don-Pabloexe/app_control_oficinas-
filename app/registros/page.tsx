'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Registro = {
  nombre: string;
  tipo: 'entrada' | 'salida';
  hora: string;
  metodo: string;
};

export default function RegistrosPage() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    const fetchRegistros = async () => {
      const q = query(collection(db, 'registros'), orderBy('hora', 'desc'));
      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map(doc => doc.data() as Registro);
      setRegistros(datos);
    };
    fetchRegistros();
  }, []);

  return (
    <main className="p-10 min-h-screen bg-white text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Historial de Registros</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 rounded shadow">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border border-gray-300">Nombre</th>
              <th className="py-2 px-4 border border-gray-300">Tipo</th>
              <th className="py-2 px-4 border border-gray-300">Hora</th>
              <th className="py-2 px-4 border border-gray-300">Método</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((r, index) => (
              <tr key={index} className="text-center border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">{r.nombre}</td>
                <td className={`py-2 px-4 border border-gray-300 font-semibold ${
                  r.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {r.tipo === 'entrada' ? '🔓 Entrada' : '🔒 Salida'}
                </td>
                <td className="py-2 px-4 border border-gray-300">{new Date(r.hora).toLocaleString()}</td>
                <td className="py-2 px-4 border border-gray-300">{r.metodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
