'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Table, Flex, Card, Button, DropdownMenu } from '@radix-ui/themes';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import { useTenantStore } from '@/store/useTenantStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SuperAdminPagosPage() {
  const { tenants, fetchTenants, updateTenantStatus, isLoading } = useTenantStore();
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

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

      <Card size="3" variant="classic">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Salón</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Próximo Vencimiento</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Último Pago (MP)</Table.ColumnHeaderCell>
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
                      {tenant.contactEmail || 'Sin email'}
                    </Text>
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    <Badge color="blue">{tenant.subscriptionPlan}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={tenant.status === 'ACTIVE' ? "green" : tenant.status === 'PENDING_PAYMENT' ? "orange" : "red"}>
                      {tenant.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color={tenant.status === 'SUSPENDED' ? 'red' : 'gray'}>
                      {formatDate(tenant.subscriptionEndDate)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    {tenant.lastPaymentId ? (
                      <Flex align="center" gap="1">
                        <Text size="2" color="gray">#{tenant.lastPaymentId}</Text>
                        <ExternalLink size={12} className="text-gray-400" />
                      </Flex>
                    ) : (
                      <Text size="2" color="gray">-</Text>
                    )}
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
                  </Table.Cell>
                </Table.Row>
              ))}

            {(!Array.isArray(tenants) || tenants.length === 0) &&
              !isLoading && (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center py-8">
                    <Text color="gray">
                      No se encontraron registros de pagos.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              )}

            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center py-8">
                  <Text color="gray">Cargando pagos...</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  );
}
