'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heading, Text, Card, Flex, Box, Badge, Button, Separator, Grid, Spinner } from '@radix-ui/themes';
import { ArrowLeft, Calendar, Users, Hash, Edit3, User, DollarSign, Wallet, Receipt, Trash2 } from 'lucide-react';
import { eventService } from '@/services/event.service';
import { Event, EventStatus, EventType } from '@/lib/api';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddPaymentModal } from './AddPaymentModal';
import { EditPriceModal } from './EditPriceModal';

export default function EventoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [evento, setEvento] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvento = async () => {
    try {
      const data = await eventService.getById(id);
      setEvento(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el evento');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvento();
  }, [id]);

  const totalPagado = evento?.payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
  const saldoPendiente = (evento?.basePrice || 0) - totalPagado;

  const handleRemovePayment = async (paymentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pago?')) {
      try {
        await eventService.removePayment(id, paymentId);
        fetchEvento();
      } catch (err) {
        console.error('Error al eliminar pago');
      }
    }
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.CONFIRMED: return 'green';
      case EventStatus.PENDING_DEPOSIT: return 'orange';
      case EventStatus.CANCELLED: return 'red';
      default: return 'gray';
    }
  };

  const getEventTypeName = (type: EventType) => {
    switch (type) {
      case EventType.WEDDING: return '💍 Boda';
      case EventType.SWEET_15: return '🎉 15 Años';
      case EventType.CORPORATE: return '🏢 Evento Corporativo';
      case EventType.OTHER: return '🌟 Otro';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Flex direction="column" align="center" gap="3">
          <Spinner size="3" />
          <Text color="gray">Cargando detalles del evento...</Text>
        </Flex>
      </Flex>
    );
  }

  if (error || !evento) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Card size="3" style={{ maxWidth: 400, textAlign: 'center' }}>
          <Heading size="4" color="red" mb="2">Oops!</Heading>
          <Text as="div" color="gray" mb="4">{error || 'Evento no encontrado'}</Text>
          <Button variant="soft" onClick={() => router.push('/eventos')}>
            Volver a Eventos
          </Button>
        </Card>
      </Flex>
    );
  }

  return (
    <Box className="max-w-5xl mx-auto py-6">
      <Flex align="center" gap="2" mb="4">
        <Button variant="ghost" color="gray" asChild>
          <Link href="/eventos"><ArrowLeft size={16} /> Volver</Link>
        </Button>
      </Flex>

      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="8" mb="1">{evento.honoreeName}</Heading>
          <Text color="gray" size="3">
            {getEventTypeName(evento.type)} · {format(new Date(evento.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </Text>
        </div>
        <Flex gap="3">
          <Badge size="3" color={getStatusColor(evento.status)} variant="soft" radius="full">
            {evento.status}
          </Badge>
          <Button variant="soft" color="violet">
            <Edit3 size={16} /> Editar Estado
          </Button>
        </Flex>
      </Flex>

      <Grid columns={{ initial: '1', md: '3' }} gap="4">
        <Box className="md:col-span-2">
          <Card size="4" mb="4">
            <Heading size="4" mb="4">Información General</Heading>
            <Grid columns="2" gap="4">
              <Box>
                <Flex align="center" gap="2" color="gray" mb="1">
                  <Calendar size={14} /> <Text size="1" weight="bold">Fecha y Hora</Text>
                </Flex>
                <Text size="3">{format(new Date(evento.date), "dd/MM/yyyy HH:mm")}</Text>
              </Box>
              <Box>
                <Flex align="center" gap="2" color="gray" mb="1">
                  <Users size={14} /> <Text size="1" weight="bold">Invitados (Aprox)</Text>
                </Flex>
                <Text size="3">{evento.approximateGuestCount} personas</Text>
              </Box>
              <Box>
                <Flex align="center" gap="2" color="gray" mb="1">
                  <Hash size={14} /> <Text size="1" weight="bold">ID del Evento</Text>
                </Flex>
                <Text size="2" color="gray">{evento.id.slice(0, 8)}...</Text>
              </Box>
              <Box>
                <Flex align="center" gap="2" color="gray" mb="1">
                  <User size={14} /> <Text size="1" weight="bold">Organizador</Text>
                </Flex>
                <Text size="2" color="gray">{evento.organizerId.slice(0, 8)}...</Text>
              </Box>
            </Grid>
          </Card>

          {/* Finanzas Card */}
          <Card size="4" mb="4">
            <Flex justify="between" align="center" mb="4">
              <Heading size="4">Finanzas y Cobranzas</Heading>
              <AddPaymentModal eventId={id} onPaymentAdded={fetchEvento} />
            </Flex>
            
            <Grid columns="3" gap="4" mb="6">
              <Box p="3" style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-3)' }}>
                <Flex justify="between" align="center" mb="1">
                  <Text size="2" color="gray">Precio Acordado</Text>
                  <EditPriceModal eventId={id} currentPrice={evento.basePrice || 0} onPriceUpdated={fetchEvento} />
                </Flex>
                <Text size="5" weight="bold">${Number(evento.basePrice || 0).toLocaleString()}</Text>
              </Box>
              <Box p="3" style={{ background: 'var(--green-2)', borderRadius: 'var(--radius-3)' }}>
                <Text as="div" size="2" color="green" mb="1">Total Pagado</Text>
                <Text size="5" weight="bold" color="green">${totalPagado.toLocaleString()}</Text>
              </Box>
              <Box p="3" style={{ background: saldoPendiente > 0 ? 'var(--ruby-2)' : 'var(--gray-2)', borderRadius: 'var(--radius-3)' }}>
                <Text as="div" size="2" color={saldoPendiente > 0 ? 'ruby' : 'gray'} mb="1">Saldo Pendiente</Text>
                <Text size="5" weight="bold" color={saldoPendiente > 0 ? 'ruby' : 'gray'}>${saldoPendiente.toLocaleString()}</Text>
              </Box>
            </Grid>

            <Heading size="3" mb="3">Historial de Pagos</Heading>
            {evento.payments && evento.payments.length > 0 ? (
              <Flex direction="column" gap="2">
                {evento.payments.map((p) => (
                  <Flex key={p.id} justify="between" align="center" p="3" style={{ border: '1px solid var(--gray-4)', borderRadius: 'var(--radius-2)' }}>
                    <Box>
                      <Flex align="center" gap="2" mb="1">
                        <Badge color="blue" variant="soft">{p.method}</Badge>
                        <Text size="2" weight="bold">${Number(p.amount).toLocaleString()}</Text>
                      </Flex>
                      <Text size="1" color="gray">
                        {format(new Date(p.paymentDate), "dd/MM/yyyy")} {p.referenceNumber && `· Ref: ${p.referenceNumber}`}
                      </Text>
                    </Box>
                    <Button variant="ghost" color="red" size="1" onClick={() => handleRemovePayment(p.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </Flex>
                ))}
              </Flex>
            ) : (
              <Flex justify="center" py="4">
                <Text size="2" color="gray">No se han registrado pagos aún.</Text>
              </Flex>
            )}
          </Card>
        </Box>

        <Box>
          <Card size="3" mb="4">
            <Heading size="3" mb="3">Invitados Confirmados</Heading>
            <Separator size="4" mb="4" />
            <Flex direction="column" align="center" justify="center" py="6" gap="2">
              <Users size={32} className="text-gray-300" />
              <Text size="2" color="gray" align="center">
                El módulo de RSVP e invitados pronto estará conectado aquí.
              </Text>
              <Button mt="3" variant="outline" size="1" color="violet" asChild>
                <Link href="/invitados">Gestionar Invitados</Link>
              </Button>
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
}
