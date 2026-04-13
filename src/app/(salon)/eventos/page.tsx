'use client';

import { useEventStore } from '@/store/useEventStore';
import { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Heading,
    Text,
    Table,
    Badge,
    Dialog,
    TextField,
    Select,
    Flex,
    Box,
    Separator,
} from '@radix-ui/themes';
import { Plus, CalendarDays, Hash, Users as UsersIcon } from 'lucide-react';
import { EventStatus, EventType, User } from '@/lib/api';
import { userService } from '@/services/user.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function EventosPage() {
    const { eventos, fetchEventos, addEvento, isLoading } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);

    const [honoreeName, setHonoreeName] = useState('');
    const [fecha, setFecha] = useState('');
    const [tipo, setTipo] = useState<EventType>(EventType.SWEET_15);
    const [guestCount, setGuestCount] = useState(100);
    const [organizerId, setOrganizerId] = useState('');

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data);
            if (data.length > 0) setOrganizerId(data[0].id);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addEvento({
                honoreeName,
                date: new Date(fecha).toISOString(),
                type: tipo,
                approximateGuestCount: Number(guestCount),
                organizerId,
            });
            setIsModalOpen(false);
            setHonoreeName('');
            setFecha('');
            setTipo(EventType.BIRTHDAY_15);
            setGuestCount(100);
        } catch (error) {
            console.error('Failed to create event', error);
        }
    };

    return (
        <Flex direction="column" gap="6">
            {/* Header */}
            <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                    <Heading size="7" weight="bold">Gestión de Eventos</Heading>
                    <Text size="2" color="gray">Administrá todos los eventos del salón</Text>
                </Flex>

                <Dialog.Root open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (open) fetchUsers();
                }}>
                    <Dialog.Trigger>
                        <Button size="3" color="violet">
                            <Plus size={16} />
                            Nuevo Evento
                        </Button>
                    </Dialog.Trigger>

                    <Dialog.Content style={{ maxWidth: 460 }} size="4">
                        <Dialog.Title>Crear Nuevo Evento</Dialog.Title>
                        <Dialog.Description size="2" color="gray" mb="4">
                            Completá los datos del nuevo evento para registrarlo.
                        </Dialog.Description>

                        <Separator size="4" mb="4" />

                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="label" size="2" weight="medium" htmlFor="nombre">
                                        Nombre Agasajado/s
                                    </Text>
                                    <TextField.Root
                                        id="nombre"
                                        placeholder="Ej: Martina, Juan y Ana"
                                        value={honoreeName}
                                        onChange={(e) => setHonoreeName(e.target.value)}
                                        required
                                        mt="1"
                                        size="3"
                                    >
                                        <TextField.Slot>
                                            <Hash size={14} />
                                        </TextField.Slot>
                                    </TextField.Root>
                                </Box>

                                <Flex gap="4">
                                    <Box style={{ flex: 1 }}>
                                        <Text as="label" size="2" weight="medium" htmlFor="fecha">
                                            Fecha del Evento
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
                                                <CalendarDays size={14} />
                                            </TextField.Slot>
                                        </TextField.Root>
                                    </Box>
                                    <Box style={{ width: '120px' }}>
                                        <Text as="label" size="2" weight="medium" htmlFor="guests">
                                            Invitados
                                        </Text>
                                        <TextField.Root
                                            id="guests"
                                            type="number"
                                            min="1"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(Number(e.target.value))}
                                            required
                                            mt="1"
                                            size="3"
                                        >
                                            <TextField.Slot>
                                                <UsersIcon size={14} />
                                            </TextField.Slot>
                                        </TextField.Root>
                                    </Box>
                                </Flex>

                                <Box>
                                    <Text as="div" size="2" weight="medium" mb="1">
                                        Tipo de Evento
                                    </Text>
                                    <Select.Root
                                        value={tipo}
                                        onValueChange={(val: EventType) => setTipo(val)}
                                        size="3"
                                    >
                                        <Select.Trigger style={{ width: '100%' }} />
                                        <Select.Content color="violet">
                                            <Select.Item value={EventType.SWEET_15}>🎉 15 Años</Select.Item>
                                            <Select.Item value={EventType.WEDDING}>💍 Boda</Select.Item>
                                            <Select.Item value={EventType.CORPORATE}>🏢 Corporativo</Select.Item>
                                            <Select.Item value={EventType.OTHER}>🌟 Otro</Select.Item>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>

                                <Box>
                                    <Text as="div" size="2" weight="medium" mb="1">
                                        Organizador Responsable
                                    </Text>
                                    <Select.Root
                                        value={organizerId}
                                        onValueChange={(val) => setOrganizerId(val)}
                                        size="3"
                                        required
                                    >
                                        <Select.Trigger style={{ width: '100%' }} placeholder="Seleccionar organizador" />
                                        <Select.Content color="violet">
                                            {users.map(u => (
                                                <Select.Item key={u.id} value={u.id}>{u.fullName}</Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                </Box>

                                <Separator size="4" mt="2" />

                                <Flex gap="3" justify="end">
                                    <Dialog.Close>
                                        <Button variant="soft" color="gray" type="button" size="3">
                                            Cancelar
                                        </Button>
                                    </Dialog.Close>
                                    <Button type="submit" color="violet" size="3">
                                        Crear Evento
                                    </Button>
                                </Flex>
                            </Flex>
                        </form>
                    </Dialog.Content>
                </Dialog.Root>
            </Flex>

            {/* Table Card */}
            <Card size="3">
                <Flex justify="between" align="center" mb="4">
                    <Heading size="4">Listado de Eventos</Heading>
                    <Text size="1" color="gray">{Array.isArray(eventos) ? eventos.length : 0} evento{eventos?.length !== 1 ? 's' : ''} registrado{eventos?.length !== 1 ? 's' : ''}</Text>
                </Flex>
                <Separator size="4" mb="4" />

                {isLoading ? (
                    <Flex justify="center" py="6">
                        <Text color="gray" size="2">Cargando eventos...</Text>
                    </Flex>
                ) : (!Array.isArray(eventos) || eventos.length === 0) ? (
                    <Flex justify="center" py="8" direction="column" align="center" gap="2">
                        <Text size="4">📋</Text>
                        <Text color="gray" size="2">No hay eventos registrados aún.</Text>
                        <Button variant="soft" color="violet" size="2" onClick={() => setIsModalOpen(true)}>
                            Crear primer evento
                        </Button>
                    </Flex>
                ) : (
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Agasajado/s</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Invitados (Aprox)</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {eventos.map((evento) => (
                                <Table.Row key={evento.id} align="center">
                                    <Table.Cell>
                                        <Text size="2" color="gray">
                                            {format(new Date(evento.date), "dd/MM/yy HH:mm", { locale: es })}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2" weight="medium">{evento.honoreeName}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2">
                                            {evento.type === EventType.WEDDING ? '💍 Boda' : 
                                             evento.type === EventType.SWEET_15 ? '🎉 15 Años' : 
                                             evento.type === EventType.CORPORATE ? '🏢 Corp' : '🌟 Otro'}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2">{evento.approximateGuestCount}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            color={
                                                evento.status === EventStatus.CONFIRMED ? 'green' : 
                                                evento.status === EventStatus.PENDING_DEPOSIT ? 'orange' : 
                                                'red'
                                            }
                                            variant="soft"
                                            radius="full"
                                        >
                                            {evento.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button variant="ghost" size="1" color="violet" asChild>
                                            <Link href={`/eventos/${evento.id}`}>
                                                Ver Detalle →
                                            </Link>
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Card>
        </Flex>
    );
}
