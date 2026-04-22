"use client";

import { useTenantStore } from "@/store/useTenantStore";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  Globe,
  Info,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Settings,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SalonConfigPage() {
  const { currentTenant, fetchCurrentTenant, updateCurrentTenant, isLoading } =
    useTenantStore();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentTenant();
  }, [fetchCurrentTenant]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const instagram = formData.get("instagram") as string;
    const website = formData.get("website") as string;

    const socialLinks = {
      ...currentTenant?.socialLinks,
      instagram: instagram || currentTenant?.socialLinks?.instagram || "",
      website: website || currentTenant?.socialLinks?.website || "",
    };

    const updateData = {
      name: (formData.get("name") as string) || currentTenant?.name,
      contactEmail:
        (formData.get("contactEmail") as string) || currentTenant?.contactEmail,
      contactPhone:
        (formData.get("contactPhone") as string) || currentTenant?.contactPhone,
      address: (formData.get("address") as string) || currentTenant?.address,
      city: (formData.get("city") as string) || currentTenant?.city,
      country: (formData.get("country") as string) || currentTenant?.country,
      latitude: formData.get("latitude")
        ? Number(formData.get("latitude"))
        : currentTenant?.latitude,
      longitude: formData.get("longitude")
        ? Number(formData.get("longitude"))
        : currentTenant?.longitude,
      website: website || currentTenant?.website,
      primaryColor:
        (formData.get("primaryColor") as string) ||
        currentTenant?.primaryColor ||
        "#4F46E5",
      logoUrl: (formData.get("logoUrl") as string) || currentTenant?.logoUrl,
      faviconUrl:
        (formData.get("faviconUrl") as string) || currentTenant?.faviconUrl,
      legalName:
        (formData.get("legalName") as string) || currentTenant?.legalName,
      taxId: (formData.get("taxId") as string) || currentTenant?.taxId,
      timezone: (formData.get("timezone") as string) || currentTenant?.timezone,
      defaultCurrency:
        (formData.get("defaultCurrency") as string) ||
        currentTenant?.defaultCurrency,
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

  if (!currentTenant && isLoading)
    return <Box p="8">Cargando configuración...</Box>;
  if (!currentTenant)
    return <Box p="8">No se encontró información del salón.</Box>;

  return (
    <Box className="max-w-4xl mx-auto py-8">
      <Flex direction="column" gap="2" mb="6">
        <Heading size="8">Configuración del Salón</Heading>
        <Text color="gray" size="3">
          Completa el perfil de tu salón para que los clientes te conozcan
          mejor.
        </Text>
      </Flex>

      <form onSubmit={handleSubmit}>
        <Tabs.Root defaultValue="perfil">
          <Tabs.List size="2">
            <Tabs.Trigger value="perfil">
              <Flex align="center" gap="2">
                <Store size={16} /> Identidad
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="contacto">
              <Flex align="center" gap="2">
                <MapPin size={16} /> Ubicación y Contacto
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="social">
              <Flex align="center" gap="2">
                <Instagram size={16} /> Redes y Web
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="legal">
              <Flex align="center" gap="2">
                <Info size={16} /> Datos Legales
              </Flex>
            </Tabs.Trigger>
            <Tabs.Trigger value="avanzado">
              <Flex align="center" gap="2">
                <Settings size={16} /> Avanzado
              </Flex>
            </Tabs.Trigger>
          </Tabs.List>

          <Box pt="4">
            <Tabs.Content value="perfil">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Nombre del Salón
                      </Text>
                      <TextField.Root
                        name="name"
                        defaultValue={currentTenant.name || ""}
                        required
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Color Primario (Marca)
                      </Text>
                      <Flex align="center" gap="2">
                        <TextField.Root
                          name="primaryColor"
                          type="text"
                          defaultValue={currentTenant.primaryColor || "#4F46E5"}
                          style={{ width: 60, padding: 0 }}
                        />
                        <Text size="1" color="gray">
                          Color para tus invitaciones.
                        </Text>
                      </Flex>
                    </Box>
                  </Grid>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        URL del Logo
                      </Text>
                      <TextField.Root
                        name="logoUrl"
                        defaultValue={currentTenant.logoUrl || ""}
                        placeholder="https://..."
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        URL del Favicon
                      </Text>
                      <TextField.Root
                        name="faviconUrl"
                        defaultValue={currentTenant.faviconUrl || ""}
                        placeholder="https://..."
                      />
                    </Box>
                  </Grid>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Slug (ID Único)
                    </Text>
                    <TextField.Root value={currentTenant.slug || ""} disabled>
                      <TextField.Slot>
                        <Globe size={14} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="contacto">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Dirección
                    </Text>
                    <TextField.Root
                      name="address"
                      defaultValue={currentTenant.address || ""}
                      placeholder="Ej: Av. Italia 1234"
                    />
                  </Box>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Ciudad
                      </Text>
                      <TextField.Root
                        name="city"
                        defaultValue={currentTenant.city || ""}
                        placeholder="Ej: Montevideo"
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        País
                      </Text>
                      <TextField.Root
                        name="country"
                        defaultValue={currentTenant.country || ""}
                        placeholder="Ej: Uruguay"
                      />
                    </Box>
                  </Grid>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Latitud
                      </Text>
                      <TextField.Root
                        name="latitude"
                        type="number"
                        step="any"
                        defaultValue={currentTenant.latitude || ""}
                        placeholder="-34.123"
                      />
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Longitud
                      </Text>
                      <TextField.Root
                        name="longitude"
                        type="number"
                        step="any"
                        defaultValue={currentTenant.longitude || ""}
                        placeholder="-56.123"
                      />
                    </Box>
                  </Grid>
                  <Grid columns="2" gap="4">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Email Público
                      </Text>
                      <TextField.Root
                        name="contactEmail"
                        type="email"
                        defaultValue={currentTenant.contactEmail || ""}
                        placeholder="contacto@salon.com"
                      >
                        <TextField.Slot>
                          <Mail size={14} />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Teléfono de Contacto
                      </Text>
                      <TextField.Root
                        name="contactPhone"
                        defaultValue={currentTenant.contactPhone || ""}
                        placeholder="+598 99 123 456"
                      >
                        <TextField.Slot>
                          <Phone size={14} />
                        </TextField.Slot>
                      </TextField.Root>
                    </Box>
                  </Grid>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="social">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Instagram (Usuario)
                    </Text>
                    <TextField.Root
                      name="instagram"
                      defaultValue={currentTenant.socialLinks?.instagram || ""}
                      placeholder="@tusaleon"
                    >
                      <TextField.Slot>
                        <Instagram size={14} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Sitio Web
                    </Text>
                    <TextField.Root
                      name="website"
                      defaultValue={currentTenant.website || ""}
                      placeholder="https://www.tusalon.com"
                    >
                      <TextField.Slot>
                        <Globe size={14} />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="legal">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Nombre Legal / Razón Social
                    </Text>
                    <TextField.Root
                      name="legalName"
                      defaultValue={currentTenant.legalName || ""}
                      placeholder="Ej: Eventos S.A."
                    />
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      ID Fiscal (RUT/CUIT)
                    </Text>
                    <TextField.Root
                      name="taxId"
                      defaultValue={currentTenant.taxId || ""}
                      placeholder="Ej: 21XXXXXX001X"
                    />
                  </Box>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="avanzado">
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Zona Horaria
                    </Text>
                    <Select.Root
                      name="timezone"
                      defaultValue={
                        currentTenant.timezone || "America/Montevideo"
                      }
                    >
                      <Select.Trigger style={{ width: "100%" }} />
                      <Select.Content>
                        <Select.Item value="America/Montevideo">
                          Uruguay (GMT-3)
                        </Select.Item>
                        <Select.Item value="America/Buenos_Aires">
                          Argentina (GMT-3)
                        </Select.Item>
                        <Select.Item value="America/Santiago">
                          Chile (GMT-3)
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Moneda por Defecto
                    </Text>
                    <Select.Root
                      name="defaultCurrency"
                      defaultValue={currentTenant.defaultCurrency || "UYU"}
                    >
                      <Select.Trigger style={{ width: "100%" }} />
                      <Select.Content>
                        <Select.Item value="UYU">
                          Pesos Uruguayos (UYU)
                        </Select.Item>
                        <Select.Item value="ARS">
                          Pesos Argentinos (ARS)
                        </Select.Item>
                        <Select.Item value="USD">Dólares (USD)</Select.Item>
                      </Select.Content>
                    </Select.Root>
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
