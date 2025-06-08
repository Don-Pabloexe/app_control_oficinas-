'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QRCode } from 'react-qrcode-logo';
import { db } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function QRAcceso() {
  const [codigoQR, setCodigoQR] = useState('');

  useEffect(() => {
    const generarQR = async () => {
      const nuevoCodigo = uuidv4();
      setCodigoQR(nuevoCodigo);

      await setDoc(doc(db, 'qrs', 'activo'), {
        token: nuevoCodigo,
        timestamp: new Date().toISOString(),
        estado: 'activo',
        generadoPor: 'TabletEntrada1' // Cambia el nombre si tienes varias tablets
      });
    };

    generarQR(); // Genera el primero
    const intervalo = setInterval(generarQR, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-4">Escanea para ingresar</h1>
      <QRCode value={codigoQR} size={256} />
      <p className="mt-4 font-mono text-sm break-all">{codigoQR}</p>
    </main>
  );
}
