'use client';

import { useEventStore } from '@/store/useEventStore';
import { useGuestStore } from '@/store/useGuestStore';
import { useEffect, useState } from 'react';
import {
    Button, Card, Heading, Text, Badge, Table,
    Dialog, TextField, Flex, Box, Separator, Spinner
} from '@radix-ui/themes';
import { Plus, Link as LinkIcon, Check, X } from 'lucide-react';

export default function InvitadosPage() {
    const { myEvent, fetchMyEvent } = useEventStore();
    const { invitados, fetchInvitados, addInvitado, updateEstadoInvitado, isLoading } = useGuestStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [restriccion, setRestriccion] = useState('');

    useEffect(() => {
        fetchMyEvent();
    }, [fetchMyEvent]);

    useEffect(() => {
        if (myEvent) {
            fetchInvitados(myEvent.id);
        }
    }, [myEvent, fetchInvitados]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!myEvent) return;
        await addInvitado(myEvent.id, { nombre, telefono, restriccionAlimentaria: restriccion, estado: 'pendiente' });
        setIsModalOpen(false);
        setNombre('');
        setTelefono('');
        setRestriccion('');
    };

    const copyLink = (id: string) => {
        const link = `https://mievento.com/rsvp/${id}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado: ' + link);
    };

    const estadoColor = (estado: string) => {
        if (estado === 'confirmado') return 'green';
        if (estado === 'rechazado') return 'red';
        return 'amber';
    };

    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                    <Heading size="7" weight="bold">Lista de Invitados</Heading>
                    <Text size="2" color="gray">Gestioná la asistencia de tus invitados</Text>
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
                                    <Text as="label" size="2" weight="medium">Nombre Completo</Text>
                                    <TextField.Root mt="1" size="3" placeholder="Ej: Juan Perez"
                                        value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                </Box>
                                <Box>
                                    <Text as="label" size="2" weight="medium">Teléfono (WhatsApp)</Text>
                                    <TextField.Root mt="1" size="3" placeholder="+54 9 11..."
                                        value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                                </Box>
                                <Box>
                                    <Text as="label" size="2" weight="medium">Restricción Alimentaria</Text>
                                    <TextField.Root mt="1" size="3" placeholder="Ej: Vegetariano, Celiaquía"
                                        value={restriccion} onChange={(e) => setRestriccion(e.target.value)} />
                                </Box>
                                <Separator size="4" />
                                <Flex gap="3" justify="end">
                                    <Dialog.Close>
                                        <Button variant="soft" color="gray" type="button" size="3">Cancelar</Button>
                                    </Dialog.Close>
                                    <Button type="submit" color="violet" size="3">Guardar</Button>
                                </Flex>
                            </Flex>
                        </form>
                    </Dialog.Content>
                </Dialog.Root>
            </Flex>

            <Card size="3">
                <Heading size="4" mb="4">Gestionar Asistencia</Heading>
                <Separator size="4" mb="4" />
                {isLoading ? (
                    <Flex justify="center" py="6">
                        <Flex direction="column" align="center" gap="2">
                            <Spinner size="3" />
                            <Text color="gray" size="2">Cargando invitados...</Text>
                        </Flex>
                    </Flex>
                ) : (!Array.isArray(invitados) || invitados.length === 0) ? (
                    <Flex justify="center" py="8" direction="column" align="center" gap="2">
                        <Text size="4">👥</Text>
                        <Text color="gray" size="2">No hay invitados aún. ¡Agregá el primero!</Text>
                    </Flex>
                ) : (
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Teléfono</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Restricción</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {invitados.map((inv) => (
                                <Table.Row key={inv.id} align="center">
                                    <Table.Cell><Text size="2" weight="medium">{inv.nombre}</Text></Table.Cell>
                                    <Table.Cell><Text size="2" color="gray">{inv.telefono || '-'}</Text></Table.Cell>
                                    <Table.Cell><Text size="2" color="gray">{inv.restriccionAlimentaria || '-'}</Text></Table.Cell>
                                    <Table.Cell>
                                        <Badge color={estadoColor(inv.estado) as any} variant="soft" radius="full">
                                            {inv.estado.toUpperCase()}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Flex gap="2">
                                            <Button variant="ghost" size="1" color="green"
                                                onClick={() => updateEstadoInvitado(inv.id, 'confirmado')}>
                                                <Check size={14} />
                                            </Button>
                                            <Button variant="ghost" size="1" color="red"
                                                onClick={() => updateEstadoInvitado(inv.id, 'rechazado')}>
                                                <X size={14} />
                                            </Button>
                                            <Button variant="ghost" size="1" color="blue"
                                                onClick={() => copyLink(inv.id)}>
                                                <LinkIcon size={14} />
                                            </Button>
                                        </Flex>
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
