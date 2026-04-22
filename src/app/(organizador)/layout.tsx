'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Utensils, CreditCard, LogOut } from 'lucide-react';
import { Flex, Text, Box, Button } from '@radix-ui/themes';
import { authService } from '@/services/auth.service';
import { cn } from '@/lib/utils';

export default function OrganizerLayout({
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
          "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-150",
          isActive 
            ? "bg-violet-50 text-violet-900" 
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
      >
        <Icon size={17} className={cn("transition-colors", isActive ? "text-violet-600" : "text-slate-400")} />
        <span className="hidden sm:inline text-sm font-semibold tracking-tight">{children}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Inspired by Radix Top Nav */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <Box className="max-w-6xl mx-auto w-full">
          <Flex justify="between" align="center" px="6" py="3">
            <Flex align="center" gap="3">
              <div className="w-5 h-5 bg-violet-600 rounded-sm" />
              <Text size="3" weight="bold" className="tracking-tight text-slate-900">
                Mi Evento
              </Text>
            </Flex>

            <nav className="bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Flex gap="1" align="center">
                <NavLink href="/mi-evento" icon={Home}>Resumen</NavLink>
                <NavLink href="/invitados" icon={Users}>Invitados</NavLink>
                <NavLink href="/mesas" icon={Utensils}>Mesas</NavLink>
                <NavLink href="/pagos" icon={CreditCard}>Pagos</NavLink>
              </Flex>
            </nav>

            <Button 
              variant="ghost" 
              color="slate" 
              className="hover:text-red-600 p-1"
              onClick={() => authService.logout()}
            >
              <LogOut size={18} />
            </Button>
          </Flex>
        </Box>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 md:p-12">
        {children}
      </main>
    </div>
  );
}
