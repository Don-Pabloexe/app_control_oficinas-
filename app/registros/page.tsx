'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useRouter } from 'next/navigation'; // ¡NUEVO! Importa el router

type Registro = {
  usuario: string;
  tipo: 'entrada' | 'salida';
  hora: string;
  metodo: string;
};

export default function RegistrosPage() {
  const router = useRouter(); // ¡NUEVO! Inicializa el router

  // --- State Hooks ---
  const [allRegistros, setAllRegistros] = useState<Registro[]>([]);
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([]);
  const [uniqueUsers, setUniqueUsers] = useState<string[]>([]);

  // --- Filter State Hooks ---
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'entrada' | 'salida'>('todos');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');

  // --- Effect para obtener los datos y los usuarios únicos ---
  useEffect(() => {
    const fetchRegistros = async () => {
      const q = query(collection(db, 'registros'), orderBy('hora', 'desc'));
      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map(doc => doc.data() as Registro);
      
      setAllRegistros(datos);
      setFilteredRegistros(datos);

      const usuariosUnicos = [...new Set(datos.map(registro => registro.usuario))];
      setUniqueUsers(usuariosUnicos.sort());
    };
    fetchRegistros();
  }, []);

  // --- Effect para aplicar los filtros cuando cambian ---
  useEffect(() => {
    let registrosActualizados = [...allRegistros];

    if (filtroUsuario) {
      registrosActualizados = registrosActualizados.filter(r => r.usuario === filtroUsuario);
    }
    if (filtroTipo !== 'todos') {
      registrosActualizados = registrosActualizados.filter(r => r.tipo === filtroTipo);
    }
    if (filtroFechaInicio) {
      const fechaInicio = new Date(filtroFechaInicio);
      registrosActualizados = registrosActualizados.filter(r => new Date(r.hora) >= fechaInicio);
    }
    if (filtroFechaFin) {
      const fechaFin = new Date(filtroFechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      registrosActualizados = registrosActualizados.filter(r => new Date(r.hora) <= fechaFin);
    }

    setFilteredRegistros(registrosActualizados);
  }, [filtroUsuario, filtroTipo, filtroFechaInicio, filtroFechaFin, allRegistros]);


  return (
    <main className="p-10 min-h-screen bg-white text-gray-800">
      
      {/* --- ¡NUEVO! Encabezado con el botón de acceso a QR --- */}
      <div className="relative flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-center text-blue-700">
          Historial de Registros
        </h1>
        <button
          onClick={() => router.push('/qr-acceso')}
          className="absolute right-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          Acceso por QR →
        </button>
      </div>

      {/* --- Sección de Filtros --- */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 border rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filtro-usuario" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por usuario
          </label>
          <select
            id="filtro-usuario"
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los usuarios</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="filtro-tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de registro
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
              <th className="py-2 px-4 border border-gray-300">Usuario</th>
              <th className="py-2 px-4 border border-gray-300">Tipo</th>
              <th className="py-2 px-4 border border-gray-300">Hora</th>
              <th className="py-2 px-4 border border-gray-300">Método</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistros.map((r, index) => (
              <tr key={index} className="text-center border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">{r.usuario}</td>
                <td className={`py-2 px-4 border border-gray-300 font-semibold ${
                  r.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {r.tipo === 'entrada' ? '🔓 Entrada' : '🔒 Salida'}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {new Date(r.hora).toLocaleString()}
                </td>
                <td className="py-2 px-4 border border-gray-300">{r.metodo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
