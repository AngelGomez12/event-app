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
  Select,
  DropdownMenu,
  IconButton,
} from "@radix-ui/themes";
import { Plus, Link as LinkIcon, Check, X, Eye, QrCode, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import Link from "next/link";

export default function InvitadosPage() {
  const { myEvent, fetchMyEvent } = useEventStore();
  const {
    invitados,
    fetchInvitados,
    addInvitado,
    updateInvitado,
    removeInvitado,
    updateEstadoInvitado,
    isLoading,
    pagination,
  } = useGuestStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvitado, setEditingInvitado] = useState<Invitado | null>(null);
  const [search, setSearch] = useState("");

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [restriccion, setRestriccion] = useState("ninguna");

  useEffect(() => {
    fetchMyEvent();
  }, [fetchMyEvent]);

  useEffect(() => {
    if (myEvent) {
      fetchInvitados(myEvent.id, 1, pagination.limit, search);
    }
  }, [myEvent, fetchInvitados, search]);

  const handleOpenModal = (inv?: Invitado) => {
    if (inv) {
      setEditingInvitado(inv);
      setNombre(inv.nombre);
      setEmail(inv.email || "");
      setTelefono(inv.telefono || "");
      setRestriccion(inv.restriccionAlimentaria || "ninguna");
    } else {
      setEditingInvitado(null);
      setNombre("");
      setEmail("");
      setTelefono("");
      setRestriccion("ninguna");
    }
    setIsModalOpen(true);
  };

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

    if (editingInvitado) {
      await updateInvitado(myEvent.id, editingInvitado.id, {
        nombre,
        email,
        telefono,
        restriccionAlimentaria: restriccion,
      });
    } else {
      await addInvitado(myEvent.id, {
        nombre,
        email,
        telefono,
        restriccionAlimentaria: restriccion,
        estado: "pendiente",
      });
    }

    setIsModalOpen(false);
    setNombre("");
    setEmail("");
    setTelefono("");
    setRestriccion("ninguna");
    setEditingInvitado(null);
    // Refresh list
    fetchInvitados(myEvent.id, pagination.page, pagination.limit, search);
  };

  const handleDelete = async (id: string) => {
    if (!myEvent) return;
    if (confirm("¿Estás seguro de que querés eliminar a este invitado?")) {
      await removeInvitado(myEvent.id, id);
    }
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

  const sendQR = async (inv: Invitado) => {
    if (!inv.email) {
      alert("El invitado no tiene mail registrado.");
      return;
    }
    if (!myEvent) {
      alert("No se ha cargado el evento actual.");
      return;
    }

    try {
      await useGuestStore.getState().sendTicket(myEvent.id, inv.id);
      alert(`QR enviado a ${inv.email} con éxito.`);
    } catch (error: any) {
      alert(error.message || "Error al enviar el QR.");
    }
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
        <Flex direction="column" gap="1">
          <Badge
            color={estadoColor(inv.estado)}
            variant="soft"
            className="font-bold"
          >
            {inv.estado?.toUpperCase()}
          </Badge>
          {inv.restriccionAlimentaria && inv.restriccionAlimentaria !== "ninguna" && (
            <Badge variant="outline" color="orange" size="1">
              {inv.restriccionAlimentaria.toUpperCase()}
            </Badge>
          )}
        </Flex>
      ),
    },
    {
      header: "Acciones",
      accessor: (inv: Invitado) => {
        const isConfirmed =
          inv.estado?.toLowerCase() === "confirmado" ||
          inv.estado?.toLowerCase() === "confirmed";

        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant="ghost" color="gray" size="2" className="cursor-pointer">
                <MoreHorizontal size={18} />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="2" variant="soft" style={{ minWidth: 160 }}>
              <DropdownMenu.Item 
                onClick={() => copyLink(inv.id)}
                className="cursor-pointer"
              >
                <Flex align="center" gap="2" className="w-full">
                  <LinkIcon size={14} />
                  <Text size="2" weight="medium">Copiar Link</Text>
                </Flex>
              </DropdownMenu.Item>
              
              <Link href={`/invitacion/${inv.id}`} target="_blank" className="no-underline">
                <DropdownMenu.Item className="cursor-pointer">
                  <Flex align="center" gap="2" className="w-full">
                    <Eye size={14} />
                    <Text size="2" weight="medium">Ver Invitación</Text>
                  </Flex>
                </DropdownMenu.Item>
              </Link>

              {isConfirmed && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item 
                    onClick={() => sendQR(inv)}
                    className="cursor-pointer"
                    color="violet"
                  >
                    <Flex align="center" gap="2" className="w-full">
                      <QrCode size={14} />
                      <Text size="2" weight="bold">Enviar QR Acceso</Text>
                    </Flex>
                  </DropdownMenu.Item>
                </>
              )}

              <DropdownMenu.Separator />
              
              <DropdownMenu.Item 
                onClick={() => handleOpenModal(inv)}
                className="cursor-pointer"
              >
                <Flex align="center" gap="2" className="w-full">
                  <Pencil size={14} />
                  <Text size="2" weight="medium">Editar Datos</Text>
                </Flex>
              </DropdownMenu.Item>

              <DropdownMenu.Item 
                onClick={() => handleDelete(inv.id)}
                color="red"
                className="cursor-pointer"
              >
                <Flex align="center" gap="2" className="w-full">
                  <Trash2 size={14} />
                  <Text size="2" weight="bold">Eliminar</Text>
                </Flex>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
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
              onClick={() => handleOpenModal()}
            >
              <Plus size={16} /> Agregar Invitado
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size="3" style={{ maxWidth: 440 }}>
            <Dialog.Title className="tracking-tight">
              {editingInvitado ? "Editar Invitado" : "Nuevo Invitado"}
            </Dialog.Title>
            <Dialog.Description size="2" color="gray" mb="5">
              {editingInvitado
                ? "Modificá los datos del invitado seleccionado."
                : "Completa los datos del invitado para generar su invitación."}
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
                    <Select.Root
                      value={restriccion}
                      onValueChange={setRestriccion}
                    >
                      <Select.Trigger mt="1" size="3" className="w-full" />
                      <Select.Content>
                        <Select.Item value="ninguna">Ninguna</Select.Item>
                        <Select.Item value="vegetariano">
                          Vegetariano
                        </Select.Item>
                        <Select.Item value="vegano">Vegano</Select.Item>
                        <Select.Item value="celiaco">Celíaco</Select.Item>
                        <Select.Item value="otro">Otro</Select.Item>
                      </Select.Content>
                    </Select.Root>
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
                    {editingInvitado ? "Actualizar" : "Guardar"}
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
