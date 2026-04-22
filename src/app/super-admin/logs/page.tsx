'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Flex, Card, Box, Code, ScrollArea } from '@radix-ui/themes';
import { User } from 'lucide-react';
import { useAuditLogStore } from '@/store/useAuditLogStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTable } from '@/components/DataTable';
import { AuditLog } from '@/services/audit-log.service';

export default function AuditLogsPage() {
  const { logs, meta, fetchLogs, isLoading } = useAuditLogStore();
  const [search, setSearch] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchLogs(1, pageSize, search);
  }, [fetchLogs, search, pageSize]);

  const handlePageChange = (page: number) => {
    fetchLogs(page, pageSize, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'POST': return 'green';
      case 'PATCH':
      case 'PUT': return 'blue';
      case 'DELETE': return 'red';
      default: return 'gray';
    }
  };

  const columns = [
    {
        header: 'Fecha',
        accessor: (log: AuditLog) => (
            <Text size="2">{format(new Date(log.createdAt), 'dd/MM/yy HH:mm', { locale: es })}</Text>
        )
    },
    {
        header: 'Usuario',
        accessor: (log: AuditLog) => (
            <Flex align="center" gap="2">
                <User size={14} className="text-gray-400" />
                <Box>
                    <Text size="2" weight="bold" as="div">{log.userEmail || 'Sistema'}</Text>
                    <Text size="1" color="gray" as="div">ID: {log.userId?.slice(0, 8) || '-'}</Text>
                </Box>
            </Flex>
        )
    },
    {
        header: 'Acción',
        accessor: (log: AuditLog) => <Badge color={getActionBadgeColor(log.action)}>{log.action}</Badge>
    },
    {
        header: 'Entidad',
        accessor: (log: AuditLog) => (
            <Box>
                <Text size="2" weight="medium" as="div">{log.entity}</Text>
                <Text size="1" color="gray" as="div">{log.entityId ? `ID: ${log.entityId.slice(0, 8)}` : '-'}</Text>
            </Box>
        )
    },
    {
        header: 'Detalles',
        accessor: (log: AuditLog) => log.payload ? (
            <Box style={{ maxWidth: 300 }}>
                <ScrollArea scrollbars="vertical" style={{ maxHeight: 60 }}>
                    <Code size="1" color="gray" variant="ghost">
                        {JSON.stringify(log.payload)}
                    </Code>
                </ScrollArea>
            </Box>
        ) : (
            <Text size="1" color="gray">Sin datos</Text>
        )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-6">
      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="7" mb="1">Logs de Auditoría</Heading>
          <Text color="gray" size="3">Historial de todas las acciones realizadas en el sistema.</Text>
        </div>
      </Flex>

      <Card size="3" className="p-0 overflow-hidden">
        <DataTable
            columns={columns}
            data={logs}
            isLoading={isLoading}
            emptyMessage="No se han registrado acciones aún."
            currentPage={meta?.page || 1}
            totalPages={meta?.totalPages || 1}
            onPageChange={handlePageChange}
            onSearchChange={handleSearch}
            searchPlaceholder="Buscar por email o entidad..."
        />
      </Card>
    </div>
  );
}
