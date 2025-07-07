'use client';

import { Suspense } from 'react';
import EscanearWrapper from './_components/EscanearWrapper';

export default function EscanearPage() {
  return (
    <Suspense fallback={<div>Cargando escáner...</div>}>
      <EscanearWrapper />
    </Suspense>
  );
}
