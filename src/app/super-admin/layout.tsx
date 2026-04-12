// Layout for Super Admin
import { ReactNode } from 'react';
import { Flex, Box, Text, Avatar } from '@radix-ui/themes';
import { LayoutDashboard, CreditCard, Bell, ClipboardList, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from '@/lib/auth';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <Flex minHeight="100vh">
      {/* Sidebar */}
      <Box width="260px" className="bg-slate-900 border-r border-slate-800" p="4">
        <Flex direction="column" gap="4" height="100%">
          <Flex align="center" gap="3" mb="6" className="text-white">
            <Avatar fallback="SA" color="violet" size="3" radius="full" />
            <Box>
              <Text size="3" weight="bold" as="div">Super Admin</Text>
              <Text size="1" className="text-slate-400" as="div">Panel SaaS</Text>
            </Box>
          </Flex>

          <Flex direction="column" gap="2" style={{ flexGrow: 1 }}>
            <Link href="/super-admin/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 text-slate-200 transition-colors">
              <LayoutDashboard size={18} />
              <Text size="2" weight="medium">Salones (Tenants)</Text>
            </Link>
            <Link href="/super-admin/pagos" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 text-slate-200 transition-colors">
              <CreditCard size={18} />
              <Text size="2" weight="medium">Pagos</Text>
            </Link>
            <Link href="/super-admin/notificaciones" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 text-slate-200 transition-colors">
              <Bell size={18} />
              <Text size="2" weight="medium">Notificaciones</Text>
            </Link>
            <Link href="/super-admin/logs" className="flex items-center gap-2 p-2 rounded hover:bg-slate-800 text-slate-200 transition-colors">
              <ClipboardList size={18} />
              <Text size="2" weight="medium">Auditoría (Logs)</Text>
            </Link>
          </Flex>

          <Box mt="auto">
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-2 p-2 w-full rounded hover:bg-slate-800 text-red-400 transition-colors">
                <LogOut size={18} />
                <Text size="2" weight="medium">Cerrar Sesión</Text>
              </button>
            </form>
          </Box>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box style={{ flexGrow: 1 }} className="bg-slate-50" p="6">
        {children}
      </Box>
    </Flex>
  );
}
