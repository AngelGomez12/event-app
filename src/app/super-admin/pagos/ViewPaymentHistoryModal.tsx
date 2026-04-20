'use client';

import { useState, useEffect } from 'react';
import { Button, Dialog, Flex, Text, Badge, Table, Spinner, Separator, Box } from '@radix-ui/themes';
import { History, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { tenantService } from '@/services/tenant.service';

interface Props {
  tenantId: string;
  tenantName: string;
  trigger?: React.ReactNode;
}

export function ViewPaymentHistoryModal({ tenantId, tenantName, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && tenantId) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const data = await tenantService.getTenantPayments(tenantId);
          setPayments(data);
        } catch (error) {
          console.error('Error fetching payment history:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [open, tenantId]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger || (
          <Button variant="ghost" color="gray" size="2">
            <Flex align="center" gap="2">
              <History size={14} /> Historial de Pagos
            </Flex>
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 700 }}>
        <Dialog.Title>Historial de Pagos: {tenantName}</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Lista cronológica de todas las suscripciones procesadas.
        </Dialog.Description>

        <Separator size="4" mb="4" />

        {loading ? (
          <Flex justify="center" align="center" py="8">
            <Spinner size="3" />
          </Flex>
        ) : payments.length > 0 ? (
          <div className="max-h-[400px] overflow-auto">
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Monto</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Referencia MP</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {payments.map((pay) => (
                  <Table.Row key={pay.id} align="center">
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Calendar size={12} color="gray" />
                        <Text size="2">
                          {format(new Date(pay.paymentDate), "d 'de' MMM, yyyy", { locale: es })}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="blue" variant="soft">{pay.plan}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" weight="bold" color="green">
                        {pay.currency} {Number(pay.amount).toLocaleString()}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex align="center" gap="1">
                        <Text size="1" color="gray">#{pay.externalPaymentId}</Text>
                        <ExternalLink size={10} color="gray" />
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>
        ) : (
          <Flex direction="column" align="center" py="8" gap="2">
            <DollarSign size={32} color="gray" style={{ opacity: 0.3 }} />
            <Text color="gray" size="2">No se encontraron pagos registrados para este salón.</Text>
          </Flex>
        )}

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">Cerrar</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
