import { useState } from 'react';
import { Dialog, Button, Flex, Text, TextField, Select } from '@radix-ui/themes';
import { useEventStore } from '@/store/useEventStore';
import { PaymentMethod } from '@/lib/api';
import { DollarSign } from 'lucide-react';

interface Props {
  eventId: string;
  onPaymentAdded: () => void;
}

export function AddPaymentModal({ eventId, onPaymentAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addEventPayment } = useEventStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: Number(formData.get('amount')),
      method: formData.get('method'),
      paymentDate: formData.get('paymentDate') as string,
      referenceNumber: formData.get('referenceNumber') as string,
      notes: formData.get('notes') as string,
    };

    try {
      await addEventPayment(eventId, data);
      setOpen(false);
      onPaymentAdded();
    } catch (err: any) {
      setError(err.message || 'Error al registrar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button size="2" color="green">
          <DollarSign size={16} /> Registrar Pago
        </Button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Registrar Nuevo Pago</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Ingresa los detalles del pago recibido (seña, cuota o cancelación).
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">Monto del Pago</Text>
              <TextField.Root name="amount" type="number" min="1" step="0.01" required placeholder="Ej: 15000" />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">Fecha de Pago</Text>
              <TextField.Root name="paymentDate" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">Método de Pago</Text>
              <Select.Root name="method" defaultValue={PaymentMethod.TRANSFER}>
                <Select.Trigger style={{ width: '100%' }} />
                <Select.Content>
                  <Select.Item value={PaymentMethod.CASH}>💵 Efectivo</Select.Item>
                  <Select.Item value={PaymentMethod.TRANSFER}>🏦 Transferencia Bancaria</Select.Item>
                  <Select.Item value={PaymentMethod.CREDIT_CARD}>💳 Tarjeta de Crédito</Select.Item>
                  <Select.Item value={PaymentMethod.DEBIT_CARD}>💳 Tarjeta de Débito</Select.Item>
                  <Select.Item value={PaymentMethod.MERCADO_PAGO}>📱 Mercado Pago</Select.Item>
                  <Select.Item value={PaymentMethod.OTHER}>❓ Otro</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">Número de Referencia (Opcional)</Text>
              <TextField.Root name="referenceNumber" placeholder="Nro. de comprobante, ticket, etc." />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">Notas (Opcional)</Text>
              <TextField.Root name="notes" placeholder="Ej: Pago de seña del 30%" />
            </label>

            {error && <Text color="red" size="2">{error}</Text>}

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" color="green" loading={loading}>Registrar Pago</Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
