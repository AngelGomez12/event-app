"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  Dialog,
  TextField,
  Select,
  Flex,
  Box,
  Separator,
  Spinner,
} from "@radix-ui/themes";
import {
  Plus,
  Trash,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { useEventStore } from "@/store/useEventStore";
import { useEventMovementStore } from "@/store/useEventMovementStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DataTable } from "@/components/DataTable";
import { Movement } from "@/services/event-movement.service";

type TipoMovimiento = "INCOME" | "EXPENSE";

export default function PagosPage() {
  const { myEvent, fetchMyEvent } = useEventStore();
  const {
    movements,
    totalIncome,
    totalExpense,
    balance,
    fetchMovements,
    addMovement,
    deleteMovement,
    isLoading,
    pagination,
  } = useEventMovementStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState<TipoMovimiento>("EXPENSE");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMyEvent();
  }, [fetchMyEvent]);

  useEffect(() => {
    if (myEvent) {
      fetchMovements(myEvent.id, 1, pagination.limit, search);
    }
  }, [myEvent, fetchMovements, search]);

  const handlePageChange = (page: number) => {
    if (myEvent) {
      fetchMovements(myEvent.id, page, pagination.limit, search);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myEvent) return;

    try {
      await addMovement(myEvent.id, {
        concept: concepto,
        amount: Number(monto),
        type: tipo,
        date: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setConcepto("");
      setMonto("");
      fetchMovements(myEvent.id, 1, pagination.limit, search);
    } catch (error) {
      console.error("Error adding movement:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!myEvent) return;
    await deleteMovement(myEvent.id, id);
    fetchMovements(myEvent.id, pagination.page, pagination.limit, search);
  };

  const columns = [
    {
      header: "Fecha",
      accessor: (mov: Movement) => (
        <Text size="2" color="gray">
          {format(new Date(mov.date), "dd MMM yyyy", { locale: es })}
        </Text>
      ),
    },
    {
      header: "Concepto",
      accessor: (mov: Movement) => (
        <Text size="2" weight="medium">
          {mov.concept}
        </Text>
      ),
    },
    {
      header: "Tipo",
      accessor: (mov: Movement) => (
        <Badge
          color={mov.type === "INCOME" ? "green" : "red"}
          variant="soft"
          radius="full"
        >
          {mov.type === "INCOME" ? "INGRESO" : "EGRESO"}
        </Badge>
      ),
    },
    {
      header: "Monto",
      accessor: (mov: Movement) => (
        <Text
          size="2"
          weight="bold"
          style={{
            color: mov.type === "INCOME" ? "var(--green-11)" : "var(--red-11)",
          }}
        >
          {mov.type === "INCOME" ? "+" : "-"}$
          {Number(mov.amount).toLocaleString()}
        </Text>
      ),
      align: "end" as const,
    },
    {
      header: "Acciones",
      accessor: (mov: Movement) => (
        <Button
          variant="ghost"
          size="1"
          color="red"
          onClick={() => handleDelete(mov.id)}
          loading={isLoading}
        >
          <Trash size={14} />
        </Button>
      ),
      align: "end" as const,
    },
  ];

  if (!myEvent) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Heading size="7" weight="bold">
            Control de Gastos
          </Heading>
          <Text size="2" color="gray">
            Seguí tus ingresos y egresos del evento
          </Text>
        </Flex>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger>
            <Button size="3" color="violet">
              <Plus size={16} /> Registrar Movimiento
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size="4" style={{ maxWidth: 440 }}>
            <Dialog.Title>Registrar Movimiento</Dialog.Title>
            <Dialog.Description size="2" color="gray" mb="4">
              Completá los datos del movimiento.
            </Dialog.Description>
            <Separator size="4" mb="4" />
            <form onSubmit={handleAdd}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Concepto
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    placeholder="Ej: Fotógrafo, Catering..."
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Monto
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    type="number"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text as="div" size="2" weight="medium" mb="1">
                    Tipo
                  </Text>
                  <Select.Root
                    value={tipo}
                    onValueChange={(v: TipoMovimiento) => setTipo(v)}
                    size="3"
                  >
                    <Select.Trigger style={{ width: "100%" }} />
                    <Select.Content color="violet">
                      <Select.Item value="EXPENSE">
                        💸 Gasto (Egreso)
                      </Select.Item>
                      <Select.Item value="INCOME">
                        💰 Ingreso / Ahorro
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Box>
                <Separator size="4" />
                <Flex gap="3" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray" type="button" size="3">
                      Cancelar
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    color="violet"
                    size="3"
                    loading={isLoading}
                  >
                    Guardar
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          size="3"
          style={{
            border: "1px solid var(--green-5)",
            background: "var(--green-1)",
          }}
        >
          <Flex justify="between" align="start" mb="3">
            <Text size="2" weight="medium" style={{ color: "var(--green-11)" }}>
              Ingresos (Vista Actual)
            </Text>
            <TrendingUp size={18} style={{ color: "var(--green-9)" }} />
          </Flex>
          <Heading size="7" weight="bold" style={{ color: "var(--green-11)" }}>
            ${totalIncome.toLocaleString()}
          </Heading>
        </Card>

        <Card
          size="3"
          style={{
            border: "1px solid var(--red-5)",
            background: "var(--red-1)",
          }}
        >
          <Flex justify="between" align="start" mb="3">
            <Text size="2" weight="medium" style={{ color: "var(--red-11)" }}>
              Gastos (Vista Actual)
            </Text>
            <TrendingDown size={18} style={{ color: "var(--red-9)" }} />
          </Flex>
          <Heading size="7" weight="bold" style={{ color: "var(--red-11)" }}>
            ${totalExpense.toLocaleString()}
          </Heading>
        </Card>

        <Card
          size="3"
          style={{
            border:
              balance >= 0
                ? "1px solid var(--violet-5)"
                : "1px solid var(--orange-5)",
            background: balance >= 0 ? "var(--violet-1)" : "var(--orange-1)",
          }}
        >
          <Flex justify="between" align="start" mb="3">
            <Text
              size="2"
              weight="medium"
              style={{
                color: balance >= 0 ? "var(--violet-11)" : "var(--orange-11)",
              }}
            >
              Balance (Vista Actual)
            </Text>
            <DollarSign
              size={18}
              style={{
                color: balance >= 0 ? "var(--violet-9)" : "var(--orange-9)",
              }}
            />
          </Flex>
          <Heading
            size="7"
            weight="bold"
            style={{
              color: balance >= 0 ? "var(--violet-11)" : "var(--orange-11)",
            }}
          >
            ${balance.toLocaleString()}
          </Heading>
        </Card>
      </div>

      {/* Table */}
      <Card size="3" className="p-0 overflow-hidden">
        <Box p="4">
          <Heading size="4">Historial de Movimientos</Heading>
        </Box>
        <DataTable
          columns={columns}
          data={movements}
          isLoading={isLoading}
          emptyMessage="No hay movimientos registrados."
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          searchPlaceholder="Buscar por concepto..."
        />
      </Card>
    </Flex>
  );
}
