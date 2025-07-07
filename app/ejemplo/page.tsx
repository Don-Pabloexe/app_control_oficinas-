'use client';

import { useEffect, useRef } from 'react';

export default function TestVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Usa "user" si estás probando en laptop
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
      }
    };

    iniciarCamara();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Vista previa de la cámara</h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="300"
        height="300"
        className="border border-white rounded"
      />
    </div>
  );
}
