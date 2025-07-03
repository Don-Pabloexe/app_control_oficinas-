'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type Registro = {
  usuario: string;
  tipo: 'entrada' | 'salida';
  hora: string; // Stored as ISO string
  metodo: string;
};

export default function MisRegistros() {
  // --- State Hooks ---
  // Store all records fetched from Firebase once
  const [allRegistros, setAllRegistros] = useState<Registro[]>([]);
  // Store the records that are actually displayed (after filtering)
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([]);
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  // --- Filter State Hooks ---
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'entrada' | 'salida'>('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');


  // --- Effect to Fetch Initial Data ---
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
        
        // Store the original full list and set the initial filtered list
        setAllRegistros(datos);
        setFilteredRegistros(datos);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);


  // --- Effect to Apply Filters ---
  useEffect(() => {
    let registrosActualizados = [...allRegistros];

    // 1. Filter by Type
    if (filtroTipo !== 'todos') {
      registrosActualizados = registrosActualizados.filter(r => r.tipo === filtroTipo);
    }

    // 2. Filter by Start Date
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      registrosActualizados = registrosActualizados.filter(r => new Date(r.hora) >= fechaInicio);
    }

    // 3. Filter by End Date
    if (filtroFechaFin) {
      // Set the time to the end of the day to include all records from that day
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      registrosActualizados = registrosActualizados.filter(r => new Date(r.hora) <= fechaFin);
    }

    setFilteredRegistros(registrosActualizados);
  }, [filtroTipo, filtroFechaInicio, filtroFechaFin, allRegistros]);

  return (
    <main className="p-10 min-h-screen bg-white text-gray-800">
      {/* 🔙 Botón de regreso */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          ← Volver al registro
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Mis Registros</h1>

      {/* --- Seccion de Filtros --- */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 border rounded-lg">
        {/* Filtro por Tipo */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="filtro-tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por tipo
          </label>
          <select
            id="filtro-tipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        {/* Filtro por Fecha de Inicio */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="filtro-inicio" className="block text-sm font-medium text-gray-700 mb-1">
            Desde
          </label>
          <input
            type="date"
            id="filtro-inicio"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro por Fecha de Fin */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="filtro-fin" className="block text-sm font-medium text-gray-700 mb-1">
            Hasta
          </label>
          <input
            type="date"
            id="filtro-fin"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>


      {/* --- Tabla de Registros --- */}
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
            {/* Usar 'filteredRegistros' para el renderizado */}
            {filteredRegistros.map((r, index) => (
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