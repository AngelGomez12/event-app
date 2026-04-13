import { useEventStore } from '@/store/useEventStore';
import { useTenantStore } from '@/store/useTenantStore';
import { useAuditLogStore } from '@/store/useAuditLogStore';
import { useEffect } from 'react';
import { Card, Heading, Text, Badge, Flex, Box, Separator, Button, Callout, Grid } from '@radix-ui/themes';
import { Calendar, Users, DollarSign, TrendingUp, AlertCircle, ArrowRight, Plus, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';
import { EventStatus, EventType } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const { eventos, fetchEventos, isLoading: eventsLoading } = useEventStore();
  const { currentTenant, fetchCurrentTenant } = useTenantStore();
  const { myLogs, fetchMyLogs } = useAuditLogStore();

  useEffect(() => {
    fetchEventos();
    fetchCurrentTenant();
    fetchMyLogs(1, 5);
  }, [fetchEventos, fetchCurrentTenant, fetchMyLogs]);

  const confirmados = Array.isArray(eventos) ? eventos.filter(e => e.status === EventStatus.CONFIRMED).length : 0;
  const pendientes = Array.isArray(eventos) ? eventos.length - confirmados : 0;

  const isProfileIncomplete = currentTenant && (!currentTenant.address || !currentTenant.city || !currentTenant.contactPhone);

  const proximosEventos = Array.isArray(eventos) 
    ? [...eventos]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
    : [];

  const getLogActionText = (action: string, entity: string) => {
    const actions: any = {
      'POST': 'Creó',
      'PATCH': 'Actualizó',
      'PUT': 'Actualizó',
      'DELETE': 'Eliminó',
    };
    const entities: any = {
      'Events': 'un evento',
      'Event_payments': 'un pago',
      'Tenants': 'la configuración',
      'Users': 'un usuario',
    };
    return `${actions[action] || action} ${entities[entity] || entity}`;
  };

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Heading size="7" weight="bold">Dashboard General</Heading>
          <Text size="2" color="gray">Resumen de tu salón de eventos</Text>
        </Flex>
      </Flex>

      {/* Quick Actions */}
      <Card size="2">
        <Flex gap="4" align="center">
          <Text size="2" weight="bold" color="gray" mr="2">ACCESOS RÁPIDOS:</Text>
          <Button variant="soft" color="violet" asChild>
            <Link href="/eventos">
              <Plus size={16} /> Nuevo Evento
            </Link>
          </Button>
          <Button variant="soft" color="green" asChild>
            <Link href="/eventos">
              <CreditCard size={16} /> Registrar Cobro
            </Link>
          </Button>
          <Button variant="soft" color="gray" asChild>
            <Link href="/calendario">
              <Calendar size={16} /> Ver Calendario
            </Link>
          </Button>
        </Flex>
      </Card>

      {isProfileIncomplete && (
        <Callout.Root color="amber" variant="soft">
          <Callout.Icon>
            <AlertCircle size={18} />
          </Callout.Icon>
          <Flex justify="between" align="center" style={{ width: '100%' }}>
            <Callout.Text>
              Tu perfil de salón está incompleto. Completa la información de contacto y ubicación para que los clientes puedan encontrarte.
            </Callout.Text>
            <Button size="1" variant="ghost" asChild>
              <Link href="/configuracion">
                Completar Perfil <ArrowRight size={14} />
              </Link>
            </Button>
          </Flex>
        </Callout.Root>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card size="3">
          <Flex justify="between" align="start" mb="3">
            <Text size="2" color="gray" weight="medium">Eventos Confirmados</Text>
            <Box style={{ color: 'var(--green-9)' }}>
              <Calendar size={18} />
            </Box>
          </Flex>
          <Heading size="8" weight="bold" style={{ color: 'var(--green-11)' }}>
            {confirmados || 0}
          </Heading>
          <Text size="1" color="gray" mt="1">En el próximo mes</Text>
        </Card>

        <Card size="3">
          <Flex justify="between" align="start" mb="3">
            <Text size="2" color="gray" weight="medium">Próximos Pendientes</Text>
            <Box style={{ color: 'var(--amber-9)' }}>
              <Users size={18} />
            </Box>
          </Flex>
          <Heading size="8" weight="bold" style={{ color: 'var(--amber-11)' }}>
            {pendientes || 0}
          </Heading>
          <Text size="1" color="gray" mt="1">Requieren atención</Text>
        </Card>

        <Card size="3">
          <Flex justify="between" align="start" mb="3">
            <Text size="2" color="gray" weight="medium">Ingresos Estimados</Text>
            <Box style={{ color: 'var(--violet-9)' }}>
              <DollarSign size={18} />
            </Box>
          </Flex>
          <Heading size="8" weight="bold" style={{ color: 'var(--violet-11)' }}>
            $12,000
          </Heading>
          <Flex align="center" gap="1" mt="1">
            <TrendingUp size={12} style={{ color: 'var(--green-9)' }} />
            <Text size="1" color="green">+20% desde el mes pasado</Text>
          </Flex>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Próximos Eventos */}
        <div className="lg:col-span-4">
          <Card size="3">
            <Heading size="4" mb="4">Próximos Eventos</Heading>
            <Separator size="4" mb="4" />
            {eventsLoading ? (
              <Text color="gray" size="2">Cargando eventos...</Text>
            ) : (!Array.isArray(eventos) || proximosEventos.length === 0) ? (
              <Text color="gray" size="2">No hay eventos próximos.</Text>
            ) : (
              <Flex direction="column" gap="3">
                {proximosEventos.map((evento) => (
                  <Flex key={evento.id} justify="between" align="center" p="3"
                    style={{ borderRadius: 'var(--radius-3)', background: 'var(--gray-2)' }}
                  >
                    <Flex direction="column" gap="1">
                      <Text size="2" weight="bold">{evento.honoreeName}</Text>
                      <Text size="1" color="gray">
                        {new Date(evento.date).toLocaleDateString()} · {evento.type === EventType.WEDDING ? '💍 Boda' : evento.type === EventType.SWEET_15 ? '🎉 15 Años' : evento.type === EventType.CORPORATE ? '🏢 Corp' : '🌟 Otro'}
                      </Text>
                    </Flex>
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
                  </Flex>
                ))}
              </Flex>
            )}
          </Card>
        </div>

        {/* Actividad Reciente */}
        <div className="lg:col-span-3">
          <Card size="3">
            <Heading size="4" mb="4">Actividad Reciente</Heading>
            <Separator size="4" mb="4" />
            <Flex direction="column" gap="3">
              {myLogs.length > 0 ? (
                myLogs.map((log) => (
                  <Box key={log.id}>
                    <Flex justify="between" align="center" mb="1">
                      <Text size="2" weight="medium">
                        {getLogActionText(log.action, log.entity)}
                      </Text>
                      <Text size="1" color="gray">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: es })}
                      </Text>
                    </Flex>
                    <Text size="1" color="gray">Por: {log.userEmail || 'Sistema'}</Text>
                    <Separator size="4" mt="2" style={{ opacity: 0.2 }} />
                  </Box>
                ))
              ) : (
                <Text size="2" color="gray" align="center" py="4">Sin actividad reciente.</Text>
              )}
            </Flex>
          </Card>
        </div>
      </div>
    </Flex>
  );
}
