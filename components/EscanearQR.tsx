'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { db } from '@/firebase/config';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LectorQR({ tipo }: { tipo: 'entrada' | 'salida' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [resultado, setResultado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();
  const codeReader = useRef(new BrowserQRCodeReader()).current; // ✅ mantener instancia estable
  const yaEscaneado = useRef(false); // ✅ evita múltiples registros

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const iniciar = async () => {
      try {
        const devices = await BrowserQRCodeReader.listVideoInputDevices();
        const camara = devices[0]?.deviceId;

        if (camara && videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: camara },
          });

          streamRef.current = stream;
          videoRef.current.srcObject = stream;

          await codeReader.decodeFromVideoDevice(
  camara,
  videoRef.current,
  async (result, err) => {
    if (result && !yaEscaneado.current) {
      yaEscaneado.current = true; // ⛔ Evita múltiples escaneos

      const qrLeido = result.getText();
      setResultado(qrLeido);

      const qrDocRef = doc(db, 'qrs', 'activo');
      const qrSnap = await getDoc(qrDocRef);

      if (qrSnap.exists()) {
        const { token, estado, timestamp } = qrSnap.data();
        const ahora = new Date();
        const fechaToken = new Date(timestamp);
        const segundosPasados = (ahora.getTime() - fechaToken.getTime()) / 1000;

        if (qrLeido === token && estado === 'activo' && segundosPasados < 15) {
          await addDoc(collection(db, 'registros'), {
            usuario: user?.email ?? 'invitado',
            hora: ahora.toISOString(),
            tipo,
            metodo: 'QR',
          });

          await updateDoc(qrDocRef, { estado: 'usado' });
          setMensaje('✅ Acceso registrado correctamente');

          setTimeout(() => router.push('/'), 1500);
        } else {
          setMensaje('❌ Código QR inválido o expirado');
          yaEscaneado.current = false; // Permitir reintento
        }
      }
    }
  }
);

        }
      } catch (err) {
        console.error('Error al iniciar cámara', err);
        setMensaje('⚠️ Error al iniciar la cámara');
      }
    };

    iniciar();

    return () => {
  streamRef.current?.getTracks().forEach((track) => track.stop()); // ✅ Detiene la cámara
  // ❌ No uses codeReader.reset() porque no existe
};

  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h2 className="text-lg font-bold mb-4">Escanea el código QR</h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-sm border-2 border-green-500 rounded"
      />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">Resultado:</p>
        <p className="text-md font-bold break-all">{resultado}</p>
        <p className="text-sm mt-2 text-blue-500">{mensaje}</p>
      </div>
    </div>
  );
}
