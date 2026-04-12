'use client';

import { useState } from 'react';
import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useTenantStore } from '@/store/useTenantStore';

export function CreateTenantModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addTenant } = useTenantStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const data = {
        name: formData.get('name') as string,
        customDomain: formData.get('customDomain') as string,
      }
      await addTenant(
        data.name,
        data.customDomain
      );
      setOpen(false);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Falló la creación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="3" color="violet" variant="solid">Nuevo Salón</Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Registrar Salón</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Crea un nuevo salón (tenant) para el sistema.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Nombre del Salón</Text>
              <TextField.Root
                name="name"
                placeholder="Ej. Los Pinos"
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Dominio Personalizado</Text>
              <TextField.Root
                name="customDomain"
                placeholder="lospinos.app.com"
                required
              />
            </label>

            {error && (
              <Text color="ruby" size="2">
                {error}
              </Text>
            )}

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" color="violet" loading={loading}>
                Guardar Salón
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
