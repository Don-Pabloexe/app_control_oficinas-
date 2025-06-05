'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

type Registro = {
  nombre: string;
  tipo: string;
  hora: string;
  metodo: string;
};

export default function RegistrosPage() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    const fetchRegistros = async () => {
      const snapshot = await getDocs(collection(db, 'registros'));
      const datos = snapshot.docs.map(doc => doc.data() as Registro);
      setRegistros(datos);
    };
    fetchRegistros();
  }, []);

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Registros de Ingreso/Salida</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Hora</th>
            <th className="p-2 border">Método</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r, index) => (
            <tr key={index} className="text-center">
              <td className="p-2 border">{r.nombre}</td>
              <td className="p-2 border">{r.tipo}</td>
              <td className="p-2 border">{new Date(r.hora).toLocaleString()}</td>
              <td className="p-2 border">{r.metodo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
