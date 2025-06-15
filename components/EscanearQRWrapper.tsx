'use client';

import { useSearchParams } from 'next/navigation';
import LectorQR from './EscanearQR';

export default function EscanearQRWrapper() {
  const searchParams = useSearchParams();
  const tipo = (searchParams.get('tipo') as 'entrada' | 'salida') || 'entrada';

  return <LectorQR tipo={tipo} />;
}
