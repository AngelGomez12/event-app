'use client';

import { useState, useEffect } from 'react';
import { Button, Dialog, Flex, Text, Badge, Grid, Card, Separator, Box, Spinner } from '@radix-ui/themes';
import { Tenant, SubscriptionPlan } from '@/lib/api';
import { Info, MapPin, Phone, Mail, Globe, Calendar, Users, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { tenantService } from '@/services/tenant.service';

interface Props {
  tenantId: string;
  trigger?: React.ReactNode;
}

export function ViewTenantDetailsModal({ tenantId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && tenantId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const data = await tenantService.getById(tenantId);
          setTenant(data);
        } catch (error) {
          console.error('Error fetching tenant details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [open, tenantId]);

  const getPlanColor = (plan?: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.ENTERPRISE: return 'violet';
      case SubscriptionPlan.PREMIUM: return 'amber';
      default: return 'blue';
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {trigger || (
          <Button variant="ghost" color="gray" size="2">
            <Flex align="center" gap="2">
              <Info size={14} /> Ver Detalles
            </Flex>
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 600 }}>
        <Dialog.Title>
          {loading ? 'Cargando detalles...' : tenant ? `Detalles del Salón: ${tenant.name}` : 'Detalles del Salón'}
        </Dialog.Title>

        {loading ? (
          <Flex justify="center" align="center" py="8">
            <Spinner size="3" />
          </Flex>
        ) : tenant ? (
          <>
            <Dialog.Description size="2" mb="4" color="gray">
              Información completa y configuración actual del inquilino.
            </Dialog.Description>

            <Separator size="4" mb="4" />

            <Grid columns="2" gap="4">
              {/* Columna 1: Info General */}
              <Flex direction="column" gap="4">
                <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Estado y Plan</Text>
                  <Flex gap="2" align="center">
                    <Badge color={tenant.status === 'ACTIVE' ? "green" : "red"} variant="soft">
                      {tenant.status}
                    </Badge>
                    <Badge color={getPlanColor(tenant.subscriptionPlan)} variant="surface">
                      PLAN {tenant.subscriptionPlan}
                    </Badge>
                  </Flex>
                </Box>

                <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Contacto</Text>
                  <Flex direction="column" gap="1">
                    <Flex align="center" gap="2">
                      <Mail size={12} className="text-gray-400" />
                      <Text size="2">{tenant.contactEmail || 'No definido'}</Text>
                    </Flex>
                    <Flex align="center" gap="2">
                      <Phone size={12} className="text-gray-400" />
                      <Text size="2">{tenant.contactPhone || 'No definido'}</Text>
                    </Flex>
                  </Flex>
                </Box>

                <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Ubicación</Text>
                  <Flex align="start" gap="2">
                    <MapPin size={12} className="text-gray-400" style={{ marginTop: '4px' }} />
                    <Text size="2">{tenant.address ? `${tenant.address}, ${tenant.city}` : 'No definida'}</Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Columna 2: Config y Fechas */}
              <Flex direction="column" gap="4">
                 <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Identificadores</Text>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">ID: <code className="text-xs bg-gray-100 p-0.5 rounded">{tenant.id}</code></Text>
                    <Text size="1" color="gray">Slug: <code className="text-xs bg-gray-100 p-0.5 rounded">{tenant.slug}</code></Text>
                  </Flex>
                </Box>

                <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Capacidad</Text>
                  <Flex align="center" gap="2">
                    <Users size={12} className="text-gray-400" />
                    <Text size="2">{tenant.maxGuestCapacity} invitados máx.</Text>
                  </Flex>
                </Box>

                <Box>
                  <Text size="1" color="gray" weight="bold" mb="1" as="div" style={{ textTransform: 'uppercase' }}>Dominios</Text>
                  <Flex align="center" gap="2">
                    <Globe size={12} className="text-gray-400" />
                    <Text size="2">{tenant.customDomain || 'Standard (.mievento.com)'}</Text>
                  </Flex>
                </Box>
              </Flex>
            </Grid>

            <Separator size="4" my="4" />

            <Box>
               <Text size="1" color="gray" weight="bold" mb="2" as="div" style={{ textTransform: 'uppercase' }}>Historial del Sistema</Text>
               <Grid columns="2" gap="3">
                  <Card variant="surface">
                    <Flex align="center" gap="2">
                      <Calendar size={14} color="gray" />
                      <div>
                        <Text size="1" color="gray" as="div">Creado el</Text>
                        <Text size="2" weight="bold">
                          {tenant.createdAt ? format(new Date(tenant.createdAt), "d 'de' MMMM, yyyy", { locale: es }) : 'N/A'}
                        </Text>
                      </div>
                    </Flex>
                  </Card>
                  <Card variant="surface">
                    <Flex align="center" gap="2">
                      <Clock size={14} color="gray" />
                      <div>
                        <Text size="1" color="gray" as="div">Última actualización</Text>
                        <Text size="2" weight="bold">
                          {tenant.updatedAt ? format(new Date(tenant.updatedAt), "d 'de' MMMM", { locale: es }) : 'N/A'}
                        </Text>
                      </div>
                    </Flex>
                  </Card>
               </Grid>
            </Box>

            <Flex gap="3" mt="6" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">Cerrar</Button>
              </Dialog.Close>
            </Flex>
          </>
        ) : (
          <Text color="red">Error al cargar la información.</Text>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
