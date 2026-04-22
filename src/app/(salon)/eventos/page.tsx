"use client";

import { useEventStore } from "@/store/useEventStore";
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
} from "@radix-ui/themes";
import {
  Plus,
  CalendarDays,
  Hash,
  Users as UsersIcon,
  UserIcon,
  Search,
  ArrowRight,
  Mail,
} from "lucide-react";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { EventStatus, EventType, Role, User } from "@/lib/api";
import { userService } from "@/services/user.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { DataTable } from "@/components/DataTable";

export default function EventosPage() {
  const { eventos, fetchEventos, addEvento, isLoading, pagination } =
    useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [createMode, setCreateMode] = useState<"existing" | "new">("existing");
  const [search, setSearch] = useState("");

  const [honoreeName, setHonoreeName] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState<EventType>(EventType.SWEET_15);
  const [guestCount, setGuestCount] = useState(100);
  const [organizerId, setOrganizerId] = useState("");

  // Datos del Nuevo Usuario (si aplica)
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  useEffect(() => {
    fetchEventos(1, pagination.limit, search);
  }, [fetchEventos, search]);

  const handlePageChange = (page: number) => {
    fetchEventos(page, pagination.limit, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const columns = [
    {
      header: "Fecha",
      accessor: (item: any) => (
        <Box>
          <Text size="2" weight="bold" className="text-slate-900">
            {format(new Date(item.date), "dd/MM/yy", { locale: es })}
          </Text>
          <Text size="1" color="gray" className="block font-medium">
            {format(new Date(item.date), "HH:mm'hs'", { locale: es })}
          </Text>
        </Box>
      ),
      className: "pl-6",
    },
    {
      header: "Agasajado/s",
      accessor: (item: any) => (
        <Text size="2" weight="bold" className="text-slate-900 tracking-tight">
          {item.honoreeName}
        </Text>
      ),
    },
    {
      header: "Tipo",
      accessor: (item: any) => (
        <Badge variant="soft" color="gray" className="font-medium">
          {item.type === EventType.WEDDING
            ? "💍 Boda"
            : item.type === EventType.SWEET_15
              ? "🎉 15 Años"
              : item.type === EventType.CORPORATE
                ? "🏢 Corp"
                : "🌟 Otro"}
        </Badge>
      ),
    },
    {
      header: "Invitados",
      accessor: (item: any) => (
        <Text size="2" weight="bold" className="text-slate-900 tabular-nums">
          {item.approximateGuestCount}
        </Text>
      ),
      align: "center" as const,
    },
    {
      header: "Estado",
      accessor: (item: any) => (
        <Badge
          color={
            item.status === EventStatus.CONFIRMED
              ? "green"
              : item.status === EventStatus.PENDING_DEPOSIT
                ? "amber"
                : "red"
          }
          variant="soft"
          className="font-bold"
        >
          {item.status === EventStatus.CONFIRMED
            ? "Confirmado"
            : item.status === EventStatus.PENDING_DEPOSIT
              ? "Seña Pendiente"
              : "Pendiente"}
        </Badge>
      ),
    },
    {
      header: "Acciones",
      accessor: (item: any) => (
        <Button
          variant="ghost"
          size="2"
          color="violet"
          className="font-bold"
          asChild
        >
          <Link href={`/eventos/${item.id}`}>
            Detalles <ArrowRight size={14} />
          </Link>
        </Button>
      ),
      className: "pr-6",
      align: "end" as const,
    },
  ];

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
      if (data.length > 0) setOrganizerId(data[0].id);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalOrganizerId = organizerId;

      // Si el modo es "new", primero creamos al usuario
      if (createMode === "new") {
        const newUser = await userService.create({
          fullName: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: Role.ORGANIZADOR,
        });
        finalOrganizerId = newUser.id;
      }

      await addEvento({
        honoreeName,
        date: new Date(fecha).toISOString(),
        type: tipo,
        approximateGuestCount: Number(guestCount),
        organizerId: finalOrganizerId,
      });

      setIsModalOpen(false);
      resetForm();
      fetchEventos(1, pagination.limit, search); // Refresh list
    } catch (error: any) {
      alert(error.message || "Error al procesar la solicitud");
    }
  };

  const resetForm = () => {
    setHonoreeName("");
    setFecha("");
    setTipo(EventType.SWEET_15);
    setGuestCount(100);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setCreateMode("existing");
  };

  return (
    <Flex direction="column" gap="6">
      {/* Header Area */}
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Heading
            size="8"
            weight="bold"
            className="tracking-tight text-slate-900"
          >
            Gestión de Eventos
          </Heading>
          <Text size="2" color="gray" className="font-medium">
            Administra todos los eventos registrados en el salón.
          </Text>
        </Flex>

        <Dialog.Root
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (open) fetchUsers();
            else resetForm();
          }}
        >
          <Dialog.Trigger>
            <Button
              size="3"
              color="violet"
              className="cursor-pointer font-bold px-5 shadow-sm"
            >
              <Plus size={16} />
              Nuevo Evento
            </Button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 500 }} size="3">
            <Dialog.Title className="tracking-tight">
              Crear Nuevo Evento
            </Dialog.Title>
            <Dialog.Description size="2" color="gray" mb="5">
              Registra el evento y asigna un organizador para su gestión.
            </Dialog.Description>

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="4">
                <Box className="space-y-4">
                  <Box>
                    <Text
                      as="label"
                      size="2"
                      weight="bold"
                      className="text-slate-900"
                      htmlFor="nombre"
                    >
                      Nombre Agasajado/s
                    </Text>
                    <TextField.Root
                      id="nombre"
                      placeholder="Ej: Martina"
                      value={honoreeName}
                      onChange={(e) => setHonoreeName(e.target.value)}
                      required
                      mt="1"
                      size="3"
                    >
                      <TextField.Slot>
                        <Hash size={14} className="text-slate-400" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>

                  <Flex gap="4">
                    <Box className="flex-1">
                      <Text
                        as="label"
                        size="2"
                        weight="bold"
                        className="text-slate-900"
                        htmlFor="fecha"
                      >
                        Fecha
                      </Text>
                      <TextField.Root
                        id="fecha"
                        type="datetime-local"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <CalendarDays size={14} className="text-slate-400" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>
                    <Box className="w-[120px]">
                      <Text
                        as="label"
                        size="2"
                        weight="bold"
                        className="text-slate-900"
                        htmlFor="guests"
                      >
                        Invitados
                      </Text>
                      <TextField.Root
                        id="guests"
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        required
                        mt="1"
                        size="3"
                      >
                        <TextField.Slot>
                          <UsersIcon size={14} className="text-slate-400" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>
                  </Flex>

                  <Box>
                    <Text
                      as="div"
                      size="2"
                      weight="bold"
                      className="text-slate-900 mb-1"
                    >
                      Tipo de Evento
                    </Text>
                    <Select.Root
                      value={tipo}
                      onValueChange={(val: EventType) => setTipo(val)}
                      size="3"
                    >
                      <Select.Trigger className="w-full" />
                      <Select.Content color="violet">
                        <Select.Item value={EventType.SWEET_15}>
                          🎉 15 Años
                        </Select.Item>
                        <Select.Item value={EventType.WEDDING}>
                          💍 Boda
                        </Select.Item>
                        <Select.Item value={EventType.CORPORATE}>
                          🏢 Corporativo
                        </Select.Item>
                        <Select.Item value={EventType.OTHER}>
                          🌟 Otro
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                </Box>

                <Separator size="4" className="my-1" />

                <Box className="space-y-4">
                  <Flex justify="between" align="center">
                    <Text size="2" weight="bold" className="text-slate-900">
                      Organizador
                    </Text>
                    <Flex gap="1" className="bg-slate-100 p-1 rounded-lg">
                      <Button
                        variant={createMode === "existing" ? "solid" : "ghost"}
                        size="1"
                        onClick={() => setCreateMode("existing")}
                        type="button"
                        className={cn(
                          createMode === "existing"
                            ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                            : "text-slate-500",
                        )}
                      >
                        Existente
                      </Button>
                      <Button
                        variant={createMode === "new" ? "solid" : "ghost"}
                        size="1"
                        onClick={() => setCreateMode("new")}
                        type="button"
                        className={cn(
                          createMode === "new"
                            ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                            : "text-slate-500",
                        )}
                      >
                        Nuevo
                      </Button>
                    </Flex>
                  </Flex>

                  {createMode === "existing" ? (
                    <Box>
                      <Select.Root
                        value={organizerId}
                        onValueChange={(val) => setOrganizerId(val)}
                        size="3"
                        required
                      >
                        <Select.Trigger className="w-full" />
                        <Select.Content color="violet">
                          {users.map((u) => (
                            <Select.Item key={u.id} value={u.id}>
                              {u.fullName} ({u.role})
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </Box>
                  ) : (
                    <Flex
                      direction="column"
                      gap="3"
                      p="4"
                      className="bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <Box>
                        <Text
                          as="label"
                          size="1"
                          weight="bold"
                          className="text-slate-500 uppercase tracking-wider ml-1"
                        >
                          Nombre Completo
                        </Text>
                        <TextField.Root
                          placeholder="Ej: Juan Perez"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          required
                          mt="1"
                          size="2"
                        >
                          <TextField.Slot>
                            <UserIcon size={14} />
                          </TextField.Slot>
                        </TextField.Root>
                      </Box>
                      <Box>
                        <Text
                          as="label"
                          size="1"
                          weight="bold"
                          className="text-slate-500 uppercase tracking-wider ml-1"
                        >
                          Email
                        </Text>
                        <TextField.Root
                          type="email"
                          placeholder="juan@email.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          required
                          mt="1"
                          size="2"
                        >
                          <TextField.Slot>
                            <Mail size={14} />
                          </TextField.Slot>
                        </TextField.Root>
                      </Box>
                      <Box>
                        <Text
                          as="label"
                          size="1"
                          weight="bold"
                          className="text-slate-500 uppercase tracking-wider ml-1"
                        >
                          Contraseña
                        </Text>
                        <PasswordInput
                          placeholder="Mín. 6 caracteres"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                          required
                          mt="1"
                          size="2"
                        />
                      </Box>
                    </Flex>
                  )}
                </Box>

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
                    loading={isLoading}
                    className="font-bold px-6"
                  >
                    Crear Evento
                  </Button>
                </Flex>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      {/* Content Area */}
      <Card size="2" variant="surface" className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={Array.isArray(eventos) ? eventos : []}
          isLoading={isLoading}
          emptyMessage="No hay eventos registrados aún."
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          searchPlaceholder="Buscar por agasajado..."
        />
      </Card>
    </Flex>
  );
}
