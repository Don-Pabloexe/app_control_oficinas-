'use client';

import { useSearchParams } from 'next/navigation';
import EscanearQR from '@/components/EscanearQR';

export default function EscanearPage() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo') as 'entrada' | 'salida' || 'entrada';

  return <EscanearQR tipo={tipo} />;
}
