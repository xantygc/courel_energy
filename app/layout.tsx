import type { Metadata } from 'next';
import './globals.css';
import Provider from '@/app/Provider';

export const metadata: Metadata = {
  title: 'CourelEnergy — Simulador de Facturas',
  description: 'Simulador de facturas de luz y comparador de tarifas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
