"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Flex,
  Text,
  Badge,
  Spinner,
  Separator,
  Box,
} from "@radix-ui/themes";
import { History, DollarSign, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { tenantService } from "@/services/tenant.service";
import { DataTable } from "@/components/DataTable";
import { PaginationMeta } from "@/lib/api";

interface Props {
  tenantId: string;
  tenantName: string;
  trigger?: React.ReactNode;
}

export function ViewPaymentHistoryModal({
  tenantId,
  tenantName,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });

  const fetchHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await tenantService.getTenantPayments(
        tenantId,
        page,
        pagination.limit,
      );
      setPayments(response.data);
      setPagination(response.meta);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && tenantId) {
      fetchHistory(1);
    }
  }, [open, tenantId]);

  const columns = [
    {
      header: "Fecha",
      accessor: (pay: any) => (
        <Flex align="center" gap="2">
          <Calendar size={12} color="gray" />
          <Text size="2">
            {format(new Date(pay.paymentDate), "d 'de' MMM, yyyy", {
              locale: es,
            })}
          </Text>
        </Flex>
      ),
    },
    {
      header: "Plan",
      accessor: (pay: any) => (
        <Badge color="blue" variant="soft">
          {pay.plan}
        </Badge>
      ),
    },
    {
      header: "Monto",
      accessor: (pay: any) => (
        <Text size="2" weight="bold" color="green">
          {pay.currency} {Number(pay.amount).toLocaleString()}
        </Text>
      ),
    },
    {
      header: "Referencia MP",
      accessor: (pay: any) => (
        <Flex align="center" gap="1">
          <Text size="1" color="gray">
            #{pay.externalPaymentId}
          </Text>
          <ExternalLink size={10} color="gray" />
        </Flex>
      ),
    },
  ];

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

        <Box className="min-h-[300px]">
          <DataTable
            columns={columns}
            data={payments}
            isLoading={loading}
            emptyMessage="No se encontraron pagos registrados para este salón."
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => fetchHistory(page)}
          />
        </Box>

        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cerrar
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
