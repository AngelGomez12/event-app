'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Flex, Card, Button, DropdownMenu, Box } from '@radix-ui/themes';
import { MoreHorizontal, ExternalLink, History } from 'lucide-react';
import { useTenantStore } from '@/store/useTenantStore';
import { ViewPaymentHistoryModal } from './ViewPaymentHistoryModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTable } from '@/components/DataTable';
import { Tenant } from '@/lib/api';

export default function SuperAdminPagosPage() {
  const { tenants, pagination, fetchTenants, updateTenantStatus, isLoading } = useTenantStore();
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTenants(1, pagination.limit, search);
  }, [fetchTenants, search]);

  const handlePageChange = (page: number) => {
    fetchTenants(page, pagination.limit, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActingOn(id);
    await updateTenantStatus(id, newStatus);
    setActingOn(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No definida';
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
    } catch {
      return 'Fecha inválida';
    }
  };

  const columns = [
    {
        header: 'Salón',
        accessor: (tenant: Tenant) => (
            <Box>
                <Text weight="bold" size="2">{tenant.name}</Text>
                <Text as="div" size="1" color="gray">
                    {tenant.contactEmail || 'Sin email'}
                </Text>
            </Box>
        )
    },
    {
        header: 'Plan',
        accessor: (tenant: Tenant) => <Badge color="blue">{tenant.subscriptionPlan}</Badge>
    },
    {
        header: 'Estado',
        accessor: (tenant: Tenant) => (
            <Badge color={tenant.status === 'ACTIVE' ? "green" : tenant.status === 'PENDING_PAYMENT' ? "orange" : "red"}>
                {tenant.status}
            </Badge>
        )
    },
    {
        header: 'Vencimiento',
        accessor: (tenant: Tenant) => (
            <Text size="2" color={tenant.status === 'SUSPENDED' ? 'red' : 'gray'}>
                {formatDate((tenant as any).subscriptionEndDate)}
            </Text>
        )
    },
    {
        header: 'Último Pago',
        accessor: (tenant: Tenant) => (tenant as any).lastPaymentId ? (
            <Flex align="center" gap="1">
                <Text size="2" color="gray">#{(tenant as any).lastPaymentId}</Text>
                <ExternalLink size={12} className="text-gray-400" />
            </Flex>
        ) : (
            <Text size="2" color="gray">-</Text>
        )
    },
    {
        header: 'Acciones',
        accessor: (tenant: Tenant) => (
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Button variant="ghost" color="gray" size="2" disabled={actingOn === tenant.id}>
                        <MoreHorizontal size={16} />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <ViewPaymentHistoryModal 
                        tenantId={tenant.id} 
                        tenantName={tenant.name}
                        trigger={
                            <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                                <Flex align="center" gap="2">
                                    <History size={14} /> Ver Historial
                                </Flex>
                            </DropdownMenu.Item>
                        }
                    />
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item 
                        onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                        disabled={tenant.status === 'ACTIVE'}
                    >
                        Activar Acceso
                    </DropdownMenu.Item>
                    <DropdownMenu.Item 
                        color="red"
                        onClick={() => handleStatusChange(tenant.id, 'SUSPENDED')}
                        disabled={tenant.status === 'SUSPENDED'}
                    >
                        Suspender (Impago)
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        ),
        align: 'center' as const
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="7" mb="1">
            Gestión de Pagos y Suscripciones
          </Heading>
          <Text color="gray" size="3">
            Monitorea el estado de facturación de todos los salones.
          </Text>
        </div>
      </Flex>

      <Card size="3" className="p-0 overflow-hidden">
        <DataTable
            columns={columns}
            data={tenants}
            isLoading={isLoading}
            emptyMessage="No se encontraron registros de pagos."
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            onSearchChange={handleSearch}
            searchPlaceholder="Buscar por nombre de salón..."
        />
      </Card>
    </div>
  );
}
