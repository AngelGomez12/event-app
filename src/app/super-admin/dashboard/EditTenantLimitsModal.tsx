'use client';

import { useState } from 'react';
import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useTenantStore } from '@/store/useTenantStore';
import { Tenant } from '@/lib/api';
import { Settings2 } from 'lucide-react';

interface Props {
  tenant: Tenant;
}

export function EditTenantLimitsModal({ tenant }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateTenant } = useTenantStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      const data = {
        maxGuestCapacity: Number(formData.get('maxGuestCapacity')),
      };
      
      await updateTenant(tenant.id, data);
      setOpen(false);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Falló la actualización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="ghost" color="gray" size="2">
          <Flex align="center" gap="2">
            <Settings2 size={14} /> Gestionar Límites
          </Flex>
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Límites del Salón</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Ajusta las capacidades máximas para <strong>{tenant.name}</strong>.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Capacidad Máxima de Invitados</Text>
              <TextField.Root
                name="maxGuestCapacity"
                type="number"
                defaultValue={tenant.maxGuestCapacity}
                placeholder="Ej. 200"
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
                Guardar Cambios
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
