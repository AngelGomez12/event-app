'use client';

import { useState } from 'react';
import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { eventService } from '@/services/event.service';
import { Edit3 } from 'lucide-react';

interface Props {
  eventId: string;
  currentLimit: number;
  onLimitUpdated: () => void;
}

export function EditTableLimitModal({ eventId, currentLimit, onLimitUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const maxTableCount = Number(formData.get('maxTableCount'));

    try {
      await eventService.updateTableLimit(eventId, maxTableCount);
      onLimitUpdated();
      setOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el límite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="ghost" color="gray" size="1">
          <Edit3 size={12} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Límites de Mobiliario</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Ajustá el número máximo de mesas físicas disponibles para este evento.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Mesas Totales</Text>
              <TextField.Root
                name="maxTableCount"
                type="number"
                defaultValue={currentLimit}
                placeholder="Ej. 20 (0 para ilimitado)"
                required
              />
            </label>

            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" color="violet" loading={loading}>
                Guardar Límite
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
