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
import { Plus, CalendarDays, Hash } from 'lucide-react';

export default function EventosPage() {
    const { eventos, fetchEventos, addEvento, isLoading } = useEventStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [tipo, setTipo] = useState<'boda' | '15'>('15');

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addEvento({
            nombre_agasajado: nombre,
            fecha,
            tipo,
            estado: 'pendiente',
        });
        setIsModalOpen(false);
        setNombre('');
        setFecha('');
        setTipo('15');
    };

    return (
        <Flex direction="column" gap="6">
            {/* Header */}
            <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                    <Heading size="7" weight="bold">Gestión de Eventos</Heading>
                    <Text size="2" color="gray">Administrá todos los eventos del salón</Text>
                </Flex>

                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                        mt="1"
                                        size="3"
                                    >
                                        <TextField.Slot>
                                            <Hash size={14} />
                                        </TextField.Slot>
                                    </TextField.Root>
                                </Box>

                                <Box>
                                    <Text as="label" size="2" weight="medium" htmlFor="fecha">
                                        Fecha del Evento
                                    </Text>
                                    <TextField.Root
                                        id="fecha"
                                        type="date"
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

                                <Box>
                                    <Text as="div" size="2" weight="medium" mb="1">
                                        Tipo de Evento
                                    </Text>
                                    <Select.Root
                                        value={tipo}
                                        onValueChange={(val: 'boda' | '15') => setTipo(val)}
                                        size="3"
                                    >
                                        <Select.Trigger style={{ width: '100%' }} />
                                        <Select.Content color="violet">
                                            <Select.Item value="15">🎉 15 Años</Select.Item>
                                            <Select.Item value="boda">💍 Boda</Select.Item>
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
                    <Text size="1" color="gray">{eventos.length} evento{eventos.length !== 1 ? 's' : ''} registrado{eventos.length !== 1 ? 's' : ''}</Text>
                </Flex>
                <Separator size="4" mb="4" />

                {isLoading ? (
                    <Flex justify="center" py="6">
                        <Text color="gray" size="2">Cargando eventos...</Text>
                    </Flex>
                ) : eventos.length === 0 ? (
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
                                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {eventos.map((evento) => (
                                <Table.Row key={evento.id} align="center">
                                    <Table.Cell>
                                        <Text size="2" color="gray">{evento.fecha}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2" weight="medium">{evento.nombre_agasajado}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Text size="2">{evento.tipo === 'boda' ? '💍 Boda' : '🎉 15 Años'}</Text>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Badge
                                            color={evento.estado === 'confirmado' ? 'green' : 'amber'}
                                            variant="soft"
                                            radius="full"
                                        >
                                            {evento.estado}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button variant="ghost" size="1" color="violet">
                                            Ver Detalle →
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
