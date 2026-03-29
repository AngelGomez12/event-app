"use client";

import Link from 'next/link';
import { LayoutDashboard, Calendar, Users, LogOut } from 'lucide-react';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--gray-2)' }}>
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col" style={{ background: 'var(--violet-12)', color: 'white' }}>
        <Box px="5" pt="6" pb="4">
          <Heading size="5" style={{ color: 'var(--violet-1)' }}>Admin Salón</Heading>
          <Text size="1" style={{ color: 'var(--violet-4)' }}>Panel de gestión</Text>
        </Box>

        <Box px="3" style={{ flex: 1 }}>
          <Flex direction="column" gap="1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--violet-3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-11)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <LayoutDashboard size={18} />
              <Text size="2" weight="medium">Dashboard</Text>
            </Link>
            <Link href="/eventos" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--violet-3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-11)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Users size={18} />
              <Text size="2" weight="medium">Eventos</Text>
            </Link>
            <Link href="/calendario" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--violet-3)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--violet-11)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Calendar size={18} />
              <Text size="2" weight="medium">Calendario</Text>
            </Link>
          </Flex>
        </Box>

        <Box px="5" pb="6">
          <button
            className="flex items-center gap-2 transition-colors"
            style={{ color: 'var(--violet-5)', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--violet-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--violet-5)')}
          >
            <LogOut size={16} />
            <Text size="2">Cerrar Sesión</Text>
          </button>
        </Box>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}