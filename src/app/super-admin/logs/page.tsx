'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Table, Card, Flex, Button, Box, Code, ScrollArea } from '@radix-ui/themes';
import { ClipboardList, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuditLogStore } from '@/store/useAuditLogStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AuditLogsPage() {
  const { logs, meta, fetchLogs, isLoading } = useAuditLogStore();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'POST': return 'green';
      case 'PATCH':
      case 'PUT': return 'blue';
      case 'DELETE': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="7" mb="1">Logs de Auditoría</Heading>
          <Text color="gray" size="3">Historial de todas las acciones realizadas en el sistema.</Text>
        </div>
      </Flex>

      <Card size="3">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Usuario</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Acción</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Entidad</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Detalles</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {Array.isArray(logs) && logs.map((log) => (
              <Table.Row key={log.id} align="center">
                <Table.Cell>
                  <Text size="2">{format(new Date(log.createdAt), 'dd/MM/yy HH:mm', { locale: es })}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <User size={14} className="text-gray-400" />
                    <Box>
                      <Text size="2" weight="bold" as="div">{log.userEmail || 'Sistema'}</Text>
                      <Text size="1" color="gray" as="div">ID: {log.userId?.slice(0, 8) || '-'}</Text>
                    </Box>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={getActionBadgeColor(log.action)}>{log.action}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2" weight="medium" as="div">{log.entity}</Text>
                  <Text size="1" color="gray" as="div">{log.entityId ? `ID: ${log.entityId.slice(0, 8)}` : '-'}</Text>
                </Table.Cell>
                <Table.Cell>
                  {log.payload ? (
                    <Box style={{ maxWidth: 300 }}>
                      <ScrollArea scrollbars="vertical" style={{ maxHeight: 60 }}>
                        <Code size="1" color="gray" variant="ghost">
                          {JSON.stringify(log.payload)}
                        </Code>
                      </ScrollArea>
                    </Box>
                  ) : (
                    <Text size="1" color="gray">Sin datos</Text>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}

            {(!Array.isArray(logs) || logs.length === 0) && !isLoading && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-10">
                  <Text color="gray">No se han registrado acciones aún.</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Flex justify="center" gap="3" mt="4">
            <Button 
              variant="soft" 
              color="gray" 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft size={16} /> Anterior
            </Button>
            <Flex align="center" px="2">
              <Text size="2">Página {page} de {meta.totalPages}</Text>
            </Flex>
            <Button 
              variant="soft" 
              color="gray" 
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Siguiente <ChevronRight size={16} />
            </Button>
          </Flex>
        )}
      </Card>
    </div>
  );
}
