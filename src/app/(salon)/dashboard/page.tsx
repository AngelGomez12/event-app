"use client";

import { EventStatus } from "@/lib/api";
import { useAuditLogStore } from "@/store/useAuditLogStore";
import { useEventStore } from "@/store/useEventStore";
import { useTenantStore } from "@/store/useTenantStore";
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Grid,
  Heading,
  Separator,
  Text,
} from "@radix-ui/themes";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  DollarSign,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Dashboard() {
  const { eventos, fetchEventos, isLoading: eventsLoading } = useEventStore();
  const { currentTenant, fetchCurrentTenant } = useTenantStore();
  const { myLogs, fetchMyLogs } = useAuditLogStore();

  useEffect(() => {
    fetchEventos();
    fetchCurrentTenant();
    fetchMyLogs(1, 5);
  }, [fetchEventos, fetchCurrentTenant, fetchMyLogs]);

  const confirmados = Array.isArray(eventos)
    ? eventos.filter((e) => e.status === EventStatus.CONFIRMED).length
    : 0;
  const pendientes = Array.isArray(eventos) ? eventos.length - confirmados : 0;

  const isProfileIncomplete =
    currentTenant &&
    (!currentTenant.address ||
      !currentTenant.city ||
      !currentTenant.contactPhone);

  const proximosEventos = Array.isArray(eventos)
    ? [...eventos]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
    : [];

  const getLogActionText = (action: string, entity: string) => {
    const actions: any = {
      POST: "Creó",
      PATCH: "Actualizó",
      PUT: "Actualizó",
      DELETE: "Eliminó",
    };
    const entities: any = {
      Events: "un evento",
      Event_payments: "un pago",
      Tenants: "la configuración",
      Users: "un usuario",
    };
    return `${actions[action] || action} ${entities[entity] || entity}`;
  };

  return (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="1">
        <Heading size="8" weight="bold" className="tracking-tight">
          Dashboard
        </Heading>
        <Text size="2" color="gray">
          Resumen general y métricas clave de tu salón.
        </Text>
      </Flex>

      {/* Quick Actions Bar */}
      <Flex
        gap="3"
        align="center"
        className="bg-slate-50 border border-slate-200 p-2 rounded-lg"
      >
        <Button variant="ghost" color="violet" size="2" asChild>
          <Link href="/eventos">
            <Plus size={16} /> Nuevo Evento
          </Link>
        </Button>
        <Button variant="ghost" color="violet" size="2" asChild>
          <Link href="/calendario">
            <Calendar size={16} /> Ver Calendario
          </Link>
        </Button>
        <Separator orientation="vertical" size="1" className="mx-1 h-4" />
        <Text
          size="1"
          weight="medium"
          className="text-slate-400 px-2 uppercase tracking-widest"
        >
          Atajos rápidos
        </Text>
      </Flex>

      {isProfileIncomplete && (
        <Callout.Root
          color="amber"
          variant="soft"
          className="border border-amber-200/50"
        >
          <Callout.Icon>
            <AlertCircle size={18} />
          </Callout.Icon>
          <Flex justify="between" align="center" style={{ width: "100%" }}>
            <Callout.Text>
              El perfil de tu salón está incompleto. Completa la información
              para que los clientes puedan encontrarte.
            </Callout.Text>
            <Button size="1" variant="ghost" color="amber" asChild>
              <Link href="/configuracion">
                Configurar Perfil <ArrowRight size={14} />
              </Link>
            </Button>
          </Flex>
        </Callout.Root>
      )}

      {/* Stats Grid - Radix Documentation Cards Style */}
      <Grid columns={{ initial: "1", md: "3" }} gap="4">
        <Card size="3" variant="surface">
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2" className="text-gray-500 mb-1">
              <Calendar size={14} />
              <Text size="1" weight="bold" className="uppercase tracking-wider">
                Confirmados
              </Text>
            </Flex>
            <Heading size="9" weight="bold" className="tracking-tighter">
              {confirmados || 0}
            </Heading>
            <Text size="1" color="gray" className="font-medium mt-1">
              Próximo mes
            </Text>
          </Flex>
        </Card>

        <Card size="3" variant="surface">
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2" className="text-slate-500 mb-1">
              <Users size={14} />
              <Text size="1" weight="bold" className="uppercase tracking-wider">
                Pendientes
              </Text>
            </Flex>
            <Heading
              size="9"
              weight="bold"
              className="tracking-tighter text-violet-600"
            >
              {pendientes || 0}
            </Heading>
            <Text size="1" color="gray" className="font-medium mt-1">
              Requieren atención
            </Text>
          </Flex>
        </Card>

        <Card size="3" variant="surface">
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2" className="text-slate-500 mb-1">
              <DollarSign size={14} />
              <Text size="1" weight="bold" className="uppercase tracking-wider">
                Ingresos
              </Text>
            </Flex>
            <Heading size="9" weight="bold" className="tracking-tighter">
              $12k
            </Heading>
            <Flex align="center" gap="1" className="text-green-600 mt-1">
              <TrendingUp size={12} />
              <Text size="1" weight="bold">
                +20% vs anterior
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Main Content Sections */}
      <Grid columns={{ initial: "1", lg: "7" }} gap="6">
        <Box className="lg:col-span-4">
          <Card size="3" variant="surface">
            <Flex justify="between" align="center" mb="4">
              <Heading size="4" weight="bold" className="tracking-tight">
                Próximos Eventos
              </Heading>
              <Button variant="ghost" color="gray" size="1" asChild>
                <Link href="/eventos">
                  Ver todos <ArrowRight size={14} />
                </Link>
              </Button>
            </Flex>
            <Flex direction="column" gap="3">
              {eventsLoading ? (
                <Text color="gray" size="2">
                  Cargando agenda...
                </Text>
              ) : proximosEventos.length === 0 ? (
                <Text color="gray" size="2">
                  No hay eventos próximos.
                </Text>
              ) : (
                proximosEventos.map((evento) => (
                  <Flex
                    key={evento.id}
                    justify="between"
                    align="center"
                    className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Flex direction="column">
                      <Text size="2" weight="bold" className="text-slate-900">
                        {evento.honoreeName}
                      </Text>
                      <Text size="1" color="gray" className="font-medium">
                        {format(new Date(evento.date), "dd 'de' MMMM, yyyy", {
                          locale: es,
                        })}
                      </Text>
                    </Flex>
                    <Badge
                      color={
                        evento.status === EventStatus.CONFIRMED
                          ? "green"
                          : "amber"
                      }
                      variant="soft"
                    >
                      {evento.status}
                    </Badge>
                  </Flex>
                ))
              )}
            </Flex>
          </Card>
        </Box>

        <Box className="lg:col-span-3">
          <Card size="3" variant="surface">
            <Heading size="4" weight="bold" className="tracking-tight mb-4">
              Actividad Reciente
            </Heading>
            <Flex direction="column" gap="4">
              {Array.isArray(myLogs) && myLogs.length > 0 ? (
                myLogs.map((log) => (
                  <Flex
                    key={log.id}
                    direction="column"
                    gap="1"
                    className="relative pl-5 border-l border-slate-200"
                  >
                    <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-slate-300" />
                    <Text
                      size="2"
                      weight="bold"
                      className="text-slate-900 leading-none"
                    >
                      {getLogActionText(log.action, log.entity)}
                    </Text>
                    <Flex justify="between" align="center">
                      <Text size="1" color="gray" className="font-medium">
                        Por {log.userEmail?.split("@")[0] || "Sistema"}
                      </Text>
                      <Text size="1" color="gray" className="font-medium">
                        {formatDistanceToNow(new Date(log.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </Text>
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Text size="2" color="gray" align="center">
                  Sin actividad reciente.
                </Text>
              )}
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Flex>
  );
}
