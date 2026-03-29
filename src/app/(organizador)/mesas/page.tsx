'use client';

import { useGuestStore } from '@/store/useGuestStore';
import { useEffect, useState } from 'react';
import { Button, Card, Heading, Text, Badge, Dialog, TextField, Flex, Box, Separator } from '@radix-ui/themes';
import { Plus, User, AlertCircle } from 'lucide-react';

export default function MesasPage() {
    const { mesas, addMesa, invitados, fetchInvitados, assignMesa } = useGuestStore();
    const [newTable, setNewTable] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchInvitados('1');
    }, [fetchInvitados]);

    const handleAddMesa = (e: React.FormEvent) => {
        e.preventDefault();
        addMesa(newTable);
        setNewTable('');
        setIsModalOpen(false);
    };

    const confirmadosSinMesa = invitados.filter(i => i.estado === 'confirmado' && !i.mesaId);
    const getGuestsForTable = (mesaId: string) => invitados.filter(i => i.mesaId === mesaId);

    return (
        <Flex direction="column" gap="6">
            <Flex justify="between" align="center">
                <Flex direction="column" gap="1">
                    <Heading size="7" weight="bold">Distribución de Mesas</Heading>
                    <Text size="2" color="gray">Organizá la disposición de tus invitados</Text>
                </Flex>

                <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <Dialog.Trigger>
                        <Button size="3" color="violet"><Plus size={16} /> Nueva Mesa</Button>
                    </Dialog.Trigger>
                    <Dialog.Content size="4" style={{ maxWidth: 400 }}>
                        <Dialog.Title>Crear Mesa</Dialog.Title>
                        <Separator size="4" my="4" />
                        <form onSubmit={handleAddMesa}>
                            <Flex direction="column" gap="4">
                                <Box>
                                    <Text as="label" size="2" weight="medium">Nombre de la Mesa</Text>
                                    <TextField.Root mt="1" size="3" placeholder="Ej: Amigos del Novio"
                                        value={newTable} onChange={(e) => setNewTable(e.target.value)} autoFocus />
                                </Box>
                                <Flex gap="3" justify="end">
                                    <Dialog.Close>
                                        <Button variant="soft" color="gray" type="button" size="3">Cancelar</Button>
                                    </Dialog.Close>
                                    <Button type="submit" color="violet" size="3" disabled={!newTable.trim()}>Crear</Button>
                                </Flex>
                            </Flex>
                        </form>
                    </Dialog.Content>
                </Dialog.Root>
            </Flex>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sin asignar */}
                <div className="w-full lg:w-64 shrink-0">
                    <Card size="3" style={{ border: '1px solid var(--amber-6)', background: 'var(--amber-1)' }}>
                        <Flex align="center" gap="2" mb="3">
                            <AlertCircle size={16} style={{ color: 'var(--amber-9)' }} />
                            <Text size="2" weight="bold" style={{ color: 'var(--amber-11)' }}>
                                Sin Asignar ({confirmadosSinMesa.length})
                            </Text>
                        </Flex>
                        <Flex direction="column" gap="2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {confirmadosSinMesa.map(guest => (
                                <Flex key={guest.id} justify="between" align="center" p="2"
                                    style={{ background: 'white', borderRadius: 'var(--radius-2)', border: '1px solid var(--gray-4)' }}>
                                    <Text size="2" weight="medium">{guest.nombre}</Text>
                                    <select
                                        className="text-xs border rounded p-1"
                                        style={{ fontSize: 11, borderColor: 'var(--gray-5)' }}
                                        onChange={(e) => assignMesa(guest.id, e.target.value)}
                                        value="none"
                                    >
                                        <option value="none">Asignar...</option>
                                        {mesas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                </Flex>
                            ))}
                            {confirmadosSinMesa.length === 0 && (
                                <Text size="1" color="gray" style={{ fontStyle: 'italic' }}>Todos tienen mesa asignada.</Text>
                            )}
                        </Flex>
                    </Card>
                </div>

                {/* Grilla de mesas */}
                <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {mesas.map(mesa => {
                        const guests = getGuestsForTable(mesa.id);
                        return (
                            <Card key={mesa.id} size="3">
                                <Flex justify="between" align="center" mb="3">
                                    <Text weight="bold" size="3">{mesa.nombre}</Text>
                                    <Badge color="violet" variant="soft" radius="full">{guests.length} pax</Badge>
                                </Flex>
                                <Separator size="4" mb="3" />
                                <Flex direction="column" gap="2" style={{ minHeight: 80 }}>
                                    {guests.map(guest => (
                                        <Flex key={guest.id} justify="between" align="center" p="2"
                                            style={{ borderRadius: 'var(--radius-2)', background: 'var(--gray-2)' }}>
                                            <Flex align="center" gap="2">
                                                <User size={12} style={{ color: 'var(--gray-9)' }} />
                                                <Text size="2">{guest.nombre}</Text>
                                            </Flex>
                                            <button
                                                onClick={() => assignMesa(guest.id, 'none')}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-8)', fontSize: 12 }}
                                                className="hover:text-red-500"
                                            >✕</button>
                                        </Flex>
                                    ))}
                                    {guests.length === 0 && (
                                        <Text size="1" color="gray" style={{ fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                                            Mesa vacía
                                        </Text>
                                    )}
                                </Flex>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </Flex>
    );
}
