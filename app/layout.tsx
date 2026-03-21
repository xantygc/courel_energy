import type { Metadata, Viewport } from 'next';
import './globals.css';
import Provider from '@/app/Provider';

export const metadata: Metadata = {
  title: 'CourelEnergy — Simulador de Facturas',
  description: 'Simulador de facturas de luz y comparador de tarifas.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 5.0,
};

import { NextStep } from 'nextstepjs';
import { steps } from '@/lib/tutorial-steps';
import { CustomTourCard } from '@/components/CustomTourCard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Provider>
          <NextStep 
            steps={steps} 
            cardComponent={CustomTourCard}
            shadowRgb="0,0,0"
            shadowOpacity="0.7"
          >
            {children}
          </NextStep>
        </Provider>
      </body>
    </html>
  );
}
