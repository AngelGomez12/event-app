import { useState } from 'react';
import { Dialog, Button, Flex, Text, TextField } from '@radix-ui/themes';
import { useEventStore } from '@/store/useEventStore';
import { Edit3 } from 'lucide-react';

interface Props {
  eventId: string;
  currentPrice: number;
  onPriceUpdated: () => void;
}

export function EditPriceModal({ eventId, currentPrice, onPriceUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateEventPrice } = useEventStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const basePrice = Number(formData.get('basePrice'));

    try {
      await updateEventPrice(eventId, basePrice);
      setOpen(false);
      onPriceUpdated();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el precio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="ghost" size="1" color="gray">
          <Edit3 size={14} />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 400 }}>
        <Dialog.Title>Editar Precio Total</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Establece el precio total acordado para este evento.
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Precio Total</Text>
              <TextField.Root name="basePrice" type="number" min="0" step="0.01" defaultValue={currentPrice} required />
            </label>

            {error && <Text color="red" size="2">{error}</Text>}

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" color="violet" loading={loading}>Guardar Precio</Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
