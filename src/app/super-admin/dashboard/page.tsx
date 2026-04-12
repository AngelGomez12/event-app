'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Table, Flex, Card, Button, DropdownMenu, Grid } from '@radix-ui/themes';
import { MoreHorizontal, Users, DollarSign, AlertCircle, Ban, Eye } from 'lucide-react';
import { CreateTenantModal } from './CreateTenantModal';
import { EditTenantLimitsModal } from './EditTenantLimitsModal';
import { useTenantStore } from '@/store/useTenantStore';
import { authService } from '@/services/auth.service';

export default function SuperAdminDashboard() {
  const { tenants, stats, fetchTenants, fetchStats, updateTenantStatus, isLoading } = useTenantStore();
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
    fetchStats();
  }, [fetchTenants, fetchStats]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActingOn(id);
    await updateTenantStatus(id, newStatus);
    fetchStats(); // Refresh stats after status change
    setActingOn(null);
  };

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
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Nombre del Salón</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Dominio</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">Acciones</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {Array.isArray(tenants) &&
              tenants.map((tenant) => (
                <Table.Row key={tenant.id} align="center">
                  <Table.RowHeaderCell>
                    <Text weight="bold">{tenant.name}</Text>
                    <Text as="div" size="1" color="gray">
                      {tenant.id}
                    </Text>
                  </Table.RowHeaderCell>
                  <Table.Cell>{tenant.customDomain || 'Standard'}</Table.Cell>
                  <Table.Cell>
                    <Badge color="blue">{tenant.subscriptionPlan}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={tenant.status === 'ACTIVE' ? "green" : tenant.status === 'PENDING_PAYMENT' ? "orange" : "red"}>
                      {tenant.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell justify="center">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button variant="ghost" color="gray" size="2" disabled={actingOn === tenant.id}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item 
                          onClick={() => authService.impersonate(tenant.id)}
                        >
                          <Flex align="center" gap="2">
                            <Eye size={14} /> Entrar como Salón
                          </Flex>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <EditTenantLimitsModal tenant={tenant} />
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item 
                          onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                          disabled={tenant.status === 'ACTIVE'}
                        >
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
                  </Table.Cell>
                </Table.Row>
              ))}

            {(!Array.isArray(tenants) || tenants.length === 0) &&
              !isLoading && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-8">
                    <Text color="gray">
                      No se encontraron salones registrados.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}

            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-8">
                  <Text color="gray">Cargando salones...</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  );
}
