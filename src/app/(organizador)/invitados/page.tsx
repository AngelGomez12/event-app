"use client";

import { useEventStore } from "@/store/useEventStore";
import { useGuestStore, Invitado } from "@/store/useGuestStore";
import { useEffect, useState } from "react";
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
import { Plus, Link as LinkIcon, Check, X, Eye, QrCode } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default function InvitadosPage() {
  const { myEvent, fetchMyEvent } = useEventStore();
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
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [restriccion, setRestriccion] = useState("");

  useEffect(() => {
    fetchMyEvent();
  }, [fetchMyEvent]);

  useEffect(() => {
    if (myEvent) {
      fetchInvitados(myEvent.id, 1, pagination.limit, search);
    }
  }, [myEvent, fetchInvitados, search]);

  const handlePageChange = (page: number) => {
    if (myEvent) {
      fetchInvitados(myEvent.id, page, pagination.limit, search);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myEvent) return;
    await addInvitado(myEvent.id, {
      nombre,
      email,
      telefono,
      restriccionAlimentaria: restriccion,
      estado: "pendiente",
    });
    setIsModalOpen(false);
    setNombre("");
    setEmail("");
    setTelefono("");
    setRestriccion("");
    // Refresh first page after adding
    fetchInvitados(myEvent.id, 1, pagination.limit, search);
  };

  const copyLink = (id: string) => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://mievento.com";
    const link = `${baseUrl}/rsvp/${id}`;
    navigator.clipboard.writeText(link);
    alert("Link copiado: " + link);
  };

  const sendQR = (inv: Invitado) => {
    if (!inv.email) {
      alert("El invitado no tiene mail registrado.");
      return;
    }
    // Aquí se llamaría al servicio de envío de QR
    alert(`QR enviado a ${inv.email} con éxito.`);
  };

  const estadoColor = (estado: string): "green" | "red" | "amber" => {
    const s = estado?.toLowerCase();
    if (s === "confirmado" || s === "confirmed") return "green";
    if (s === "rechazado" || s === "declined" || s === "rejected") return "red";
    return "amber";
  };

  const columns = [
    {
      header: "Nombre",
      accessor: (inv: Invitado) => (
        <Box>
          <Text size="2" weight="bold" className="text-slate-900">
            {inv.nombre}
          </Text>
          <Text size="1" color="gray" className="block font-medium">
            {inv.email || "Sin email"}
          </Text>
        </Box>
      ),
    },
    {
      header: "Teléfono",
      accessor: (inv: Invitado) => (
        <Text size="2" color="gray" className="font-medium">
          {inv.telefono || "-"}
        </Text>
      ),
    },
    {
      header: "Mesa",
      accessor: (inv: Invitado) => {
        const mesa = useGuestStore
          .getState()
          .mesas.find((m) => m.id === inv.mesaId);
        return (
          <Badge variant="surface" color="gray" className="font-bold">
            {mesa ? mesa.nombre : "Sin asignar"}
          </Badge>
        );
      },
    },
    {
      header: "Estado",
      accessor: (inv: Invitado) => (
        <Badge
          color={estadoColor(inv.estado)}
          variant="soft"
          className="font-bold"
        >
          {inv.estado?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Acciones",
      accessor: (inv: Invitado) => {
        const isConfirmed =
          inv.estado?.toLowerCase() === "confirmado" ||
          inv.estado?.toLowerCase() === "confirmed";

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
                  <Text size="1" weight="bold">
                    QR
                  </Text>
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
      align: "end" as const,
    },
  ];

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Heading
            size="8"
            weight="bold"
            className="tracking-tight text-slate-900"
          >
            Lista de Invitados
          </Heading>
          <Text size="2" color="gray" className="font-medium">
            Gestioná la asistencia de tus invitados
          </Text>
        </Flex>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger>
            <Button
              size="3"
              color="violet"
              className="cursor-pointer font-bold px-5"
            >
              <Plus size={16} /> Agregar Invitado
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size="3" style={{ maxWidth: 440 }}>
            <Dialog.Title className="tracking-tight">
              Nuevo Invitado
            </Dialog.Title>
            <Dialog.Description size="2" color="gray" mb="5">
              Completa los datos del invitado para generar su invitación.
            </Dialog.Description>
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box>
                  <Text
                    as="label"
                    size="2"
                    weight="bold"
                    className="text-slate-900 ml-1"
                  >
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
                  <Text
                    as="label"
                    size="2"
                    weight="bold"
                    className="text-slate-900 ml-1"
                  >
                    Correo Electrónico
                  </Text>
                  <TextField.Root
                    mt="1"
                    size="3"
                    type="email"
                    placeholder="juan@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Flex gap="4">
                  <Box className="flex-1">
                    <Text
                      as="label"
                      size="2"
                      weight="bold"
                      className="text-slate-900 ml-1"
                    >
                      Teléfono
                    </Text>
                    <TextField.Root
                      mt="1"
                      size="3"
                      placeholder="+54..."
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </Box>
                  <Box className="flex-1">
                    <Text
                      as="label"
                      size="2"
                      weight="bold"
                      className="text-slate-900 ml-1"
                    >
                      Restricción
                    </Text>
                    <TextField.Root
                      mt="1"
                      size="3"
                      placeholder="Celiaquía..."
                      value={restriccion}
                      onChange={(e) => setRestriccion(e.target.value)}
                    />
                  </Box>
                </Flex>
                <Flex gap="3" justify="end" mt="2">
                  <Dialog.Close>
                    <Button variant="soft" color="gray" type="button" size="3">
                      Cancelar
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    color="violet"
                    size="3"
                    className="font-bold px-6"
                  >
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
