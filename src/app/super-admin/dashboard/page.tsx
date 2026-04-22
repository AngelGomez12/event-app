'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Flex, Card, Button, DropdownMenu, Grid } from '@radix-ui/themes';
import { MoreHorizontal, Users, DollarSign, AlertCircle, Ban, Eye } from 'lucide-react';
import { CreateTenantModal } from './CreateTenantModal';
import { EditTenantLimitsModal } from './EditTenantLimitsModal';
import { ViewTenantDetailsModal } from './ViewTenantDetailsModal';
import { useTenantStore } from '@/store/useTenantStore';
import { authService } from '@/services/auth.service';
import { DataTable } from '@/components/DataTable';
import { Tenant } from '@/lib/api';

export default function SuperAdminDashboard() {
  const { tenants, stats, fetchTenants, fetchStats, updateTenantStatus, isLoading, pagination } = useTenantStore();
  const [actingOn, setActingOn] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchTenants(1, pagination.limit, search);
  }, [fetchTenants, pagination.limit, search]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActingOn(id);
    await updateTenantStatus(id, newStatus);
    fetchStats(); // Refresh stats after status change
    fetchTenants(pagination.page, pagination.limit, search);
    setActingOn(null);
  };

  const handlePageChange = (page: number) => {
    fetchTenants(page, pagination.limit, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const columns = [
    {
      header: 'Nombre del Salón',
      accessor: (tenant: Tenant) => (
        <>
          <Text weight="bold">{tenant.name}</Text>
          <Text as="div" size="1" color="gray">
            {tenant.id}
          </Text>
        </>
      ),
    },
    {
      header: 'Dominio',
      accessor: (tenant: Tenant) => tenant.customDomain || 'Standard',
    },
    {
      header: 'Plan',
      accessor: (tenant: Tenant) => <Badge color="blue">{tenant.subscriptionPlan}</Badge>,
    },
    {
      header: 'Estado',
      accessor: (tenant: Tenant) => (
        <Badge color={tenant.status === 'ACTIVE' ? 'green' : tenant.status === 'PENDING_PAYMENT' ? 'orange' : 'red'}>
          {tenant.status}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      align: 'center' as const,
      accessor: (tenant: Tenant) => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="ghost" color="gray" size="2" disabled={actingOn === tenant.id}>
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <ViewTenantDetailsModal
              tenantId={tenant.id}
              trigger={
                <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
                  <Flex align="center" gap="2">
                    <Eye size={14} /> Ver Detalles
                  </Flex>
                </DropdownMenu.Item>
              }
            />
            <DropdownMenu.Item onClick={() => authService.impersonate(tenant.id)}>
              <Flex align="center" gap="2">
                <Eye size={14} /> Entrar como Salón
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <EditTenantLimitsModal tenant={tenant} />
            <DropdownMenu.Separator />
            <DropdownMenu.Item onClick={() => handleStatusChange(tenant.id, 'ACTIVE')} disabled={tenant.status === 'ACTIVE'}>
              Activar
            </DropdownMenu.Item>
            <DropdownMenu.Item
              color="red"
              onClick={() => handleStatusChange(tenant.id, 'SUSPENDED')}
              disabled={tenant.status === 'SUSPENDED'}
            >
              Suspender
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="7" mb="1">
            Gestión de Salones (SaaS)
          </Heading>
          <Text color="gray" size="3">
            Administra todos los inquilinos y sus dominios de tu aplicación.
          </Text>
        </div>
        <CreateTenantModal />
      </Flex>

      {stats && (
        <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="4" mb="6">
          <Card size="2">
            <Flex gap="3" align="center">
              <div className="p-2 bg-violet-100 text-violet-700 rounded-lg"><Users size={20} /></div>
              <div>
                <Text size="2" color="gray" as="div">Total Salones</Text>
                <Text size="5" weight="bold" as="div">{stats.totalTenants}</Text>
              </div>
            </Flex>
          </Card>
          <Card size="2">
            <Flex gap="3" align="center">
              <div className="p-2 bg-green-100 text-green-700 rounded-lg"><DollarSign size={20} /></div>
              <div>
                <Text size="2" color="gray" as="div">MRR (Mensual)</Text>
                <Text size="5" weight="bold" as="div">${stats.mrr.toLocaleString()}</Text>
              </div>
            </Flex>
          </Card>
          <Card size="2">
            <Flex gap="3" align="center">
              <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><AlertCircle size={20} /></div>
              <div>
                <Text size="2" color="gray" as="div">Pagos Pendientes</Text>
                <Text size="5" weight="bold" as="div">{stats.pendingTenants}</Text>
              </div>
            </Flex>
          </Card>
          <Card size="2">
            <Flex gap="3" align="center">
              <div className="p-2 bg-red-100 text-red-700 rounded-lg"><Ban size={20} /></div>
              <div>
                <Text size="2" color="gray" as="div">Suspendidos</Text>
                <Text size="5" weight="bold" as="div">{stats.suspendedTenants}</Text>
              </div>
            </Flex>
          </Card>
        </Grid>
      )}

      <Card size="3" variant="classic">
        <DataTable
          columns={columns}
          data={tenants}
          isLoading={isLoading}
          emptyMessage="No se encontraron salones registrados."
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          searchPlaceholder="Buscar por nombre o dominio..."
        />
      </Card>
    </div>
  );
}
