"use client";

import { useGuestStore, Invitado } from "@/store/useGuestStore";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  Dialog,
  TextField,
  Flex,
  Box,
  Separator,
} from "@radix-ui/themes";
import { Plus, Link as LinkIcon, Check, X, ArrowLeft, QrCode, Eye } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default function SalonInvitadosPage() {
  const params = useParams();
  const id = params.id as string;

  // Si necesitas ver detalles del evento podrías hacer fetchEventoById(id)
  // const { fetchEventoById } = useEventStore();

  const {
    invitados,
    fetchInvitados,
    addInvitado,
    updateEstadoInvitado,
    isLoading,
    pagination,
  } = useGuestStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [restriccion, setRestriccion] = useState("");

  useEffect(() => {
    if (id) {
      fetchInvitados(id, 1, pagination.limit, search);
    }
  }, [id, fetchInvitados, search]);

  const handlePageChange = (page: number) => {
    if (id) {
      fetchInvitados(id, page, pagination.limit, search);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    await addInvitado(id, {
      nombre,
      telefono,
      restriccionAlimentaria: restriccion,
      estado: "pendiente",
    });
    setIsModalOpen(false);
    setNombre("");
    setTelefono("");
    setRestriccion("");
    // Refrescar al guardar
    fetchInvitados(id, 1, pagination.limit, search);
  };

  const copyLink = (invId: string) => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://mievento.com";
    const link = `${baseUrl}/rsvp/${invId}`;
    navigator.clipboard.writeText(link);
    alert("Link copiado: " + link);
  };

  const sendQR = (inv: Invitado) => {
    if (!inv.telefono && !inv.nombre) {
      alert("El invitado no tiene datos.");
      return;
    }
    // Aquí se llamaría al servicio de envío de QR
    alert(`QR enviado a ${inv.nombre || inv.telefono} con éxito.`);
  };

const estadoColor = (estado: string): "green" | "red" | "amber" => {
    if (estado === "confirmado") return "green";
    if (estado === "rechazado") return "red";
    return "amber";
  };

  const columns = [
    {
      header: "Nombre",
      accessor: (inv: Invitado) => (
        <Text size="2" weight="medium">
          {inv.nombre}
        </Text>
      ),
    },
    {
      header: "Teléfono",
      accessor: (inv: Invitado) => (
        <Text size="2" color="gray">
          {inv.telefono || "-"}
        </Text>
      ),
    },
    {
      header: "Restricción",
      accessor: (inv: Invitado) => (
        <Text size="2" color="gray">
          {inv.restriccionAlimentaria || "-"}
        </Text>
      ),
    },
    {
      header: "Estado",
      accessor: (inv: Invitado) => (
        <Badge
          color={estadoColor(inv.estado)}
          variant="soft"
          radius="full"
        >
          {inv.estado.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Acciones",
      accessor: (inv: Invitado) => {
        const isConfirmed = inv.estado?.toLowerCase() === 'confirmado' || inv.estado?.toLowerCase() === 'confirmed';

        return (
          <Flex gap="2">
            {isConfirmed && (
              <Button
                  variant="soft"
                  size="1"
                  color="violet"
                  onClick={() => sendQR(inv)}
                  title="Enviar QR de Acceso"
                  className="cursor-pointer"
              >
                  <Flex align="center" gap="1" px="1">
                      <QrCode size={14} />
                      <Text size="1" weight="bold">QR</Text>
                  </Flex>
              </Button>
            )}
            <Button
              variant="ghost"
              size="1"
              color="blue"
              asChild
              title="Ver Invitación"
            >
              <Link href={`/invitacion/${inv.id}`} target="_blank">
                  <Eye size={14} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="1"
              color="green"
              onClick={() => updateEstadoInvitado(inv.id, "confirmado")}
            >
              <Check size={14} />
            </Button>
            <Button
              variant="ghost"
              size="1"
              color="red"
              onClick={() => updateEstadoInvitado(inv.id, "rechazado")}
            >
              <X size={14} />
            </Button>
            <Button
              variant="ghost"
              size="1"
              color="blue"
              onClick={() => copyLink(inv.id)}
            >
              <LinkIcon size={14} />
            </Button>
          </Flex>
        );
      },
      align: "right" as const,
    },
  ];

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Button
            variant="ghost"
            color="gray"
            size="2"
            asChild
            className="w-fit mb-2"
          >
            <Link href={`/eventos/${id}`}>
              <ArrowLeft size={16} className="mr-2" />
              Volver al Evento
            </Link>
          </Button>
          <Heading size="7" weight="bold">
            Lista de Invitados del Evento
          </Heading>
          <Text size="2" color="gray">
            Gestión de invitados desde el Salón
          </Text>
        </Flex>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger>
            <Button size="3" color="violet">
              <Plus size={16} /> Agregar Invitado
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size="4" style={{ maxWidth: 440 }}>
            <Dialog.Title>Nuevo Invitado</Dialog.Title>
            <Dialog.Description size="2" color="gray" mb="4">
              Completá los datos del invitado.
            </Dialog.Description>
            <Separator size="4" mb="4" />
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Nombre Completo
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    placeholder="Ej: Juan Perez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Teléfono (WhatsApp)
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    placeholder="+54 9 11..."
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text as="label" size="2" weight="medium">
                    Restricción Alimentaria
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    placeholder="Ej: Vegetariano, Celiaquía"
                    value={restriccion}
                    onChange={(e) => setRestriccion(e.target.value)}
                  />
                </Box>
                <Separator size="4" />
                <Flex gap="3" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray" type="button" size="3">
                      Cancelar
                    </Button>
                  </Dialog.Close>
                  <Button type="submit" color="violet" size="3">
                    Guardar
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Card size="3" className="p-0 overflow-hidden">
        <Box p="4">
          <Heading size="4">Gestionar Asistencia</Heading>
        </Box>
        <DataTable
          columns={columns}
          data={invitados}
          isLoading={isLoading}
          emptyMessage="No hay invitados aún. ¡Agregá el primero!"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          searchPlaceholder="Buscar por nombre..."
        />
      </Card>
    </Flex>
  );
}
