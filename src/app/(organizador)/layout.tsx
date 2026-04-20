'use client';

import Link from 'next/link';
import { Home, Users, Utensils, CreditCard, LogOut } from 'lucide-react';
import { Flex, Text } from '@radix-ui/themes';
import { authService } from '@/services/auth.service';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--gray-2)' }}>
      <header className="sticky top-0 z-10 shadow-sm" style={{ background: 'white', borderBottom: '1px solid var(--violet-4)' }}>
        <Flex justify="between" align="center" px="5" py="3">
          <Text size="5" weight="bold" style={{ color: 'var(--violet-11)' }}>Mi Evento</Text>

          <Flex gap="5" align="center">
            <Link href="/mi-evento" style={{ color: 'var(--gray-11)', textDecoration: 'none' }}
              className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors">
              <Home size={17} />
              <span className="hidden sm:inline">Resumen</span>
            </Link>
            <Link href="/invitados" style={{ color: 'var(--gray-11)', textDecoration: 'none' }}
              className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors">
              <Users size={17} />
              <span className="hidden sm:inline">Invitados</span>
            </Link>
            <Link href="/mesas" style={{ color: 'var(--gray-11)', textDecoration: 'none' }}
              className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors">
              <Utensils size={17} />
              <span className="hidden sm:inline">Mesas</span>
            </Link>
            <Link href="/pagos" style={{ color: 'var(--gray-11)', textDecoration: 'none' }}
              className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition-colors">
              <CreditCard size={17} />
              <span className="hidden sm:inline">Pagos</span>
            </Link>
          </Flex>

          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-9)' }}
            className="hover:text-red-500 transition-colors"
            onClick={() => authService.logout()}
          >
            <LogOut size={18} />
          </button>
        </Flex>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
