'use client';

import { useGuestStore, Invitado } from '@/store/useGuestStore';
import { useEventStore } from '@/store/useEventStore';
import { useEffect, useState, useCallback } from 'react';
import { Button, Card, Heading, Text, Badge, Dialog, TextField, Flex, Box, Separator, Spinner } from '@radix-ui/themes';
import { Plus, User, AlertCircle, Search, X } from 'lucide-react';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';

function DraggableGuest({ guest }: { guest: Invitado }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: guest.id,
        data: guest
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        position: 'relative' as any,
    } : undefined;
    
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing mb-2">
            <Flex justify="between" align="center" p="2" style={{ background: 'white', borderRadius: 'var(--radius-2)', border: '1px solid var(--gray-4)', boxShadow: transform ? '0 5px 15px rgba(0,0,0,0.1)' : 'none' }}>
                <Flex align="center" gap="2">
                    <User size={12} style={{ color: 'var(--gray-9)' }} />
                    <Text size="2" weight="medium">{guest.nombre}</Text>
                </Flex>
            </Flex>
        </div>
    );
}

function DroppableTable({ id, title, children }: { id: string, title: React.ReactNode, children: React.ReactNode }) {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });
    
    return (
        <Card size="3" style={{ border: isOver ? '2px dashed var(--violet-9)' : undefined, transition: 'border 0.2s ease' }}>
            {title}
            <Separator size="4" mb="3" />
            <div ref={setNodeRef} style={{ minHeight: 120, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </Card>
    );
}

export default function MesasPage() {
    const { myEvent, fetchMyEvent } = useEventStore();
    const { mesas, addMesa, invitados, fetchInvitados, fetchMesas, assignMesa, isLoading } = useGuestStore();
    
    const [newTable, setNewTable] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMyEvent();
    }, [fetchMyEvent]);

    useEffect(() => {
        if (myEvent) {
            fetchInvitados(myEvent.id);
            fetchMesas(myEvent.id);
        }
    }, [myEvent, fetchInvitados, fetchMesas]);

    const handleSearch = useCallback((query: string) => {
        if (myEvent) {
            fetchInvitados(myEvent.id, query);
        }
    }, [myEvent, fetchInvitados]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, handleSearch]);

    const handleAddMesa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!myEvent || !newTable.trim()) return;
        await addMesa(myEvent.id, newTable);
        setNewTable('');
        setIsModalOpen(false);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        
        const guestId = active.id as string;
        const destinationMesaId = over.id as string;
        
        const guest = invitados.find(i => i.id === guestId);
        if (!guest) return;
        
        const targetMesa = destinationMesaId === 'unassigned' ? 'none' : destinationMesaId;
        
        if ((guest.mesaId || 'none') !== targetMesa) {
            assignMesa(guestId, targetMesa);
        }
    };

    const removeGuestFromTable = (guestId: string) => {
        assignMesa(guestId, 'none');
    };

    if (!myEvent) {
        return (
            <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
                <Spinner size="3" />
            </Flex>
        );
    }

    const confirmadosSinMesa = invitados.filter(i => i.estado === 'confirmado' && !i.mesaId);
    const getGuestsForTable = (mesaId: string) => {
        if (!mesaId) return [];
        return invitados.filter(i => i.mesaId === mesaId);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Flex direction="column" gap="6">
                <Flex justify="between" align="center">
                    <Flex direction="column" gap="1">
                        <Heading size="7" weight="bold">Organización de Mesas</Heading>
                        <Flex align="center" gap="3">
                            <Text size="2" color="gray">Ubicá a tus invitados en las mesas disponibles</Text>
                            {event && (
                                <>
                                    <Separator orientation="vertical" size="1" />
                                    <Badge color={event.maxTableCount > 0 && mesas.length >= event.maxTableCount ? 'red' : 'blue'} variant="soft">
                                        {event.maxTableCount > 0 
                                            ? `${mesas.length} de ${event.maxTableCount} mesas creadas`
                                            : `${mesas.length} mesas creadas`}
                                    </Badge>
                                </>
                            )}
                        </Flex>
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

                <Box style={{ maxWidth: 400 }}>
                    <TextField.Root
                        placeholder="Buscar invitado..."
                        size="3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    >
                        <TextField.Slot><Search size={16} /></TextField.Slot>
                        {searchQuery && (
                            <TextField.Slot side="right">
                                <Button variant="ghost" color="gray" size="1" onClick={() => setSearchQuery('')}>
                                    <X size={14} />
                                </Button>
                            </TextField.Slot>
                        )}
                    </TextField.Root>
                </Box>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Panel lateral: Sin Asignar */}
                    <div className="w-full lg:w-72 shrink-0">
                        <Card size="3" style={{ border: '1px solid var(--amber-6)', background: 'var(--amber-1)' }}>
                            <Flex align="center" gap="2" mb="3">
                                <AlertCircle size={16} style={{ color: 'var(--amber-9)' }} />
                                <Text size="2" weight="bold" style={{ color: 'var(--amber-11)' }}>
                                    Sin Asignar ({confirmadosSinMesa.length})
                                </Text>
                            </Flex>
                            
                            {/* Unassigned Area is Droppable too */}
                            <div className="unassigned-droppable">
                                {isLoading && confirmadosSinMesa.length === 0 ? (
                                    <Flex justify="center" py="4"><Spinner size="2" /></Flex>
                                ) : (
                                    <DroppableTable 
                                        id="unassigned" 
                                        title={<Text size="1" color="gray" style={{ display: 'none' }}>Drop here</Text>}
                                    >
                                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
                                            {confirmadosSinMesa.map(guest => (
                                                <DraggableGuest key={guest.id} guest={guest} />
                                            ))}
                                            {confirmadosSinMesa.length === 0 && (
                                                <Text key="no-guests" size="2" color="gray" style={{ fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                                                    Todos los filtrados tienen mesa asignada o no hay resultados.
                                                </Text>
                                            )}
                                        </div>
                                    </DroppableTable>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Grilla de mesas */}
                    <div className="flex-1 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                        {mesas.map(mesa => {
                            const guests = getGuestsForTable(mesa.id);
                            return (
                                <DroppableTable 
                                    key={mesa.id} 
                                    id={mesa.id}
                                    title={
                                        <Flex justify="between" align="center" mb="3">
                                            <Text weight="bold" size="3">{mesa.nombre}</Text>
                                            <Badge color="violet" variant="soft" radius="full">{guests.length} pax</Badge>
                                        </Flex>
                                    }
                                >
                                    <Flex direction="column" style={{ minHeight: 80, height: '100%' }}>
                                        {guests.map(guest => (
                                            <DraggableGuest key={guest.id} guest={guest} />
                                        ))}
                                        {guests.length === 0 && (
                                            <Text key="empty-mesa" size="2" color="gray" style={{ fontStyle: 'italic', textAlign: 'center', margin: 'auto', opacity: 0.7 }}>
                                                Arrastrá invitados aquí
                                            </Text>
                                        )}
                                    </Flex>
                                </DroppableTable>
                            );
                        })}
                        {mesas.length === 0 && (
                            <Flex align="center" justify="center" style={{ gridColumn: '1 / -1', minHeight: 200 }}>
                                <Text color="gray" size="3">Todavía no creaste ninguna mesa.</Text>
                            </Flex>
                        )}
                    </div>
                </div>
            </Flex>
        </DndContext>
    );
}
