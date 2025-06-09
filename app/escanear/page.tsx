import { Suspense } from 'react';
import EscanearQRWrapper from '@/components/EscanearQRWrapper';

export default function EscanearPage() {
  return (
    <Suspense fallback={<div>Cargando escáner...</div>}>
      <EscanearQRWrapper />
    </Suspense>
  );
}
