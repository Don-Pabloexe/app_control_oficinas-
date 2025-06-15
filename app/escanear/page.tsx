'use client';

import { Suspense } from 'react';
import EscanearQRWrapper from '@/components/EscanearQRWrapper';

export default function EscanearPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-white p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 border border-green-200">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-4">Lector de Código QR</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Escanea el código QR para registrar tu entrada o salida.
        </p>
        <Suspense fallback={<div className="text-center text-gray-600">Cargando escáner...</div>}>
          <EscanearQRWrapper />
        </Suspense>
      </div>
    </div>
  );
}
