"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Settings, LogOut } from 'lucide-react';
import { Box, Flex, Text, Heading } from '@radix-ui/themes';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 group",
          isActive 
            ? "bg-violet-50 text-violet-900" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <Icon size={18} className={cn("transition-colors", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600")} />
        <Text size="2" weight={isActive ? "bold" : "medium"}>{children}</Text>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Inspired by Radix Docs */}
      <aside className="w-64 hidden md:flex flex-col bg-slate-50 border-r border-slate-200">
        <Box px="5" py="6">
          <Heading size="4" weight="bold" className="tracking-tight text-slate-900 flex align-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-md" />
            Admin Salon
          </Heading>
        </Box>

        <Box style={{ flex: 1 }} px="3">
          <Flex direction="column" gap="1">
            <NavLink href="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink href="/eventos" icon={Users}>Eventos</NavLink>
            <NavLink href="/calendario" icon={Calendar}>Calendario</NavLink>
            <NavLink href="/configuracion" icon={Settings}>Configuración</NavLink>
          </Flex>
        </Box>

        <Box px="5" pb="6">
          <button
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors cursor-pointer border-none bg-transparent p-1"
            onClick={() => authService.logout()}
          >
            <LogOut size={16} />
            <Text size="2" weight="medium">Cerrar Sesión</Text>
          </button>
        </Box>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
