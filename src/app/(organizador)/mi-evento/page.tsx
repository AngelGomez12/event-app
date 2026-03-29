'use client';

import { useEventStore } from '@/store/useEventStore';
import { useGuestStore } from '@/store/useGuestStore';
import { useEffect } from 'react';
import { Card, Heading, Text, Badge, Flex, Box, Separator } from '@radix-ui/themes';
import { differenceInDays } from 'date-fns';
import { Users, CheckCircle, XCircle, Sparkles } from 'lucide-react';

export default function MiEventoPage() {
    const { eventos, fetchEventos } = useEventStore();
    const { invitados, fetchInvitados } = useGuestStore();

    useEffect(() => {
        fetchEventos();
        fetchInvitados('1');
    }, [fetchEventos, fetchInvitados]);

    const myEvent = eventos[0];

    if (!myEvent) return (
        <Flex justify="center" py="9"><Text color="gray">Cargando evento...</Text></Flex>
    );

    const daysLeft = differenceInDays(new Date(myEvent.fecha), new Date());
    const totalInvitados = invitados.length;
    const confirmados = invitados.filter(i => i.estado === 'confirmado').length;
    const pendientes = invitados.filter(i => i.estado === 'pendiente').length;

    return (
        <Flex direction="column" gap="8">
            {/* Hero */}
            <Flex direction="column" align="center" gap="2" py="4">
                <Badge color="violet" variant="soft" size="2" radius="full">
                    {myEvent.tipo === 'boda' ? '💍 Gran Boda' : '🎉 Fiesta de 15'}
                </Badge>
                <Heading size="9" weight="bold" align="center" style={{ letterSpacing: '-0.02em' }}>
                    {myEvent.nombre_agasajado}
                </Heading>
                <Text size="4" color="gray" align="center">
                    Faltan <Text as="span" weight="bold" style={{ color: 'var(--violet-11)' }}>{daysLeft} días</Text> para la gran noche · {myEvent.fecha}
                </Text>
            </Flex>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card size="3">
                    <Flex justify="between" align="start" mb="3">
                        <Text size="2" color="gray" weight="medium">Total Invitados</Text>
                        <Users size={18} style={{ color: 'var(--violet-9)' }} />
                    </Flex>
                    <Heading size="8" weight="bold" style={{ color: 'var(--violet-11)' }}>{totalInvitados}</Heading>
                </Card>

                <Card size="3" style={{ border: '1px solid var(--green-5)', background: 'var(--green-1)' }}>
                    <Flex justify="between" align="start" mb="3">
                        <Text size="2" weight="medium" style={{ color: 'var(--green-11)' }}>Confirmados</Text>
                        <CheckCircle size={18} style={{ color: 'var(--green-9)' }} />
                    </Flex>
                    <Heading size="8" weight="bold" style={{ color: 'var(--green-11)' }}>{confirmados}</Heading>
                </Card>

                <Card size="3" style={{ border: '1px solid var(--amber-5)', background: 'var(--amber-1)' }}>
                    <Flex justify="between" align="start" mb="3">
                        <Text size="2" weight="medium" style={{ color: 'var(--amber-11)' }}>Pendientes</Text>
                        <XCircle size={18} style={{ color: 'var(--amber-9)' }} />
                    </Flex>
                    <Heading size="8" weight="bold" style={{ color: 'var(--amber-11)' }}>{pendientes}</Heading>
                </Card>
            </div>

            {/* CTA Banner */}
            <Card size="4" style={{ background: 'linear-gradient(135deg, var(--violet-9), var(--violet-11))', border: 'none' }}>
                <Flex justify="between" align="center" gap="4" className="flex-col md:flex-row">
                    <Flex direction="column" gap="2">
                        <Flex align="center" gap="2">
                            <Sparkles size={20} style={{ color: 'var(--violet-3)' }} />
                            <Heading size="5" weight="bold" style={{ color: 'white' }}>¡Comienza a organizar!</Heading>
                        </Flex>
                        <Text size="2" style={{ color: 'var(--violet-3)', maxWidth: 400 }}>
                            Enviá las invitaciones a tus amigos y familiares, y gestioná las confirmaciones desde tu panel.
                        </Text>
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    );
}
