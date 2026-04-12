'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Card, Flex, Box, TextField, Button, Tabs, Separator, Grid } from '@radix-ui/themes';
import { useTenantStore } from '@/store/useTenantStore';
import { Store, MapPin, Phone, Globe, Instagram, Mail, Info } from 'lucide-react';

export default function SalonConfigPage() {
  const { currentTenant, fetchCurrentTenant, updateCurrentTenant, isLoading } = useTenantStore();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentTenant();
  }, [fetchCurrentTenant]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const socialLinks = {
      instagram: formData.get('instagram') as string,
      website: formData.get('website') as string,
    };

    const updateData = {
      name: formData.get('name') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      primaryColor: formData.get('primaryColor') as string,
      socialLinks,
    };

    try {
      await updateCurrentTenant(updateData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentTenant && isLoading) return <Box p="8">Cargando configuración...</Box>;
  if (!currentTenant) return <Box p="8">No se encontró información del salón.</Box>;

  return (
    <Box className="max-w-4xl mx-auto py-8">
      <Flex direction="column" gap="2" mb="6">
        <Heading size="8">Configuración del Salón</Heading>
        <Text color="gray" size="3">Completa el perfil de tu salón para que los clientes te conozcan mejor.</Text>
      </Flex>

      <form onSubmit={handleSubmit}>
        <Tabs.Root defaultValue="perfil">
          <Tabs.List size="2">
            <Tabs.Trigger value="perfil">
              <Flex align="center" gap="2"><Store size={16} /> Identidad</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="contacto">
              <Flex align="center" gap="2"><MapPin size={16} /> Ubicación y Contacto</Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="social">
              <Flex align="center" gap="2"><Instagram size={16} /> Redes Sociales</Flex>
            </Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Tabs.Content value="perfil">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">Nombre del Salón</Text>
                      <TextField.Root name="name" defaultValue={currentTenant.name} required />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">Color Primario (Marca)</Text>
                      <Flex align="center" gap="2">
                        <TextField.Root name="primaryColor" type="color" defaultValue={currentTenant.primaryColor || '#4F46E5'} style={{ width: 60, padding: 0 }} />
                        <Text size="1" color="gray">Este color se usará en tus invitaciones.</Text>
                      </Flex>
                    </Box>
                  </Grid>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Slug (ID Único)</Text>
                    <TextField.Root value={currentTenant.slug} disabled>
                      <TextField.Slot><Globe size={14} /></TextField.Slot>
                    </TextField.Root>
                    <Text size="1" color="gray" mt="1">El slug identifica tu salón en la URL de las invitaciones.</Text>
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="contacto">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Dirección</Text>
                    <TextField.Root name="address" defaultValue={currentTenant.address} placeholder="Ej: Av. Italia 1234" />
                  </Box>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">Ciudad</Text>
                      <TextField.Root name="city" defaultValue={currentTenant.city} placeholder="Ej: Montevideo" />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">Email Público</Text>
                      <TextField.Root name="contactEmail" type="email" defaultValue={currentTenant.contactEmail} placeholder="contacto@salon.com">
                        <TextField.Slot><Mail size={14} /></TextField.Slot>
                      </TextField.Root>
                    </Box>
                  </Grid>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Teléfono de Contacto / WhatsApp</Text>
                    <TextField.Root name="contactPhone" defaultValue={currentTenant.contactPhone} placeholder="Ej: +598 99 123 456">
                      <TextField.Slot><Phone size={14} /></TextField.Slot>
                    </TextField.Root>
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="social">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Instagram (Usuario)</Text>
                    <TextField.Root name="instagram" defaultValue={currentTenant.socialLinks?.instagram} placeholder="@tusaleon">
                      <TextField.Slot><Instagram size={14} /></TextField.Slot>
                    </TextField.Root>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">Sitio Web</Text>
                    <TextField.Root name="website" defaultValue={currentTenant.website} placeholder="https://www.tusalon.com">
                      <TextField.Slot><Globe size={14} /></TextField.Slot>
                    </TextField.Root>
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Flex justify="end" gap="3" mt="6">
          {success && (
            <Flex align="center" gap="2" className="text-green-600">
              <Info size={16} /> <Text size="2">¡Cambios guardados!</Text>
            </Flex>
          )}
          <Button size="3" color="violet" type="submit" loading={isLoading}>
            Guardar Configuración
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
