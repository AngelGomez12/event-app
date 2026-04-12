'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Table, Flex, Card, Button, Dialog, TextField, TextArea, Select, Switch } from '@radix-ui/themes';
import { Bell, Plus, Trash, Megaphone } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotificationsAdminPage() {
  const { notifications, fetchNotifications, addNotification, updateNotification, deleteNotification, isLoading } = useNotificationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addNotification({
        title: formData.get('title') as string,
        message: formData.get('message') as string,
        type: formData.get('type') as any,
        isActive: true
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updateNotification(id, { isActive: !current });
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      <Flex justify="between" align="end" mb="6">
        <div>
          <Heading size="7" mb="1">Centro de Notificaciones</Heading>
          <Text color="gray" size="3">Envía avisos globales a todos los usuarios del sistema.</Text>
        </div>

        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Dialog.Trigger>
            <Button size="3" color="violet">
              <Plus size={18} /> Nueva Notificación
            </Button>
          </Dialog.Trigger>
          <Dialog.Content style={{ maxWidth: 450 }}>
            <Dialog.Title>Crear Aviso Global</Dialog.Title>
            <Dialog.Description size="2" mb="4">Este mensaje será visible para todos los salones y organizadores.</Dialog.Description>
            
            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="3">
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">Título</Text>
                  <TextField.Root name="title" placeholder="Ej: Mantenimiento Programado" required />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">Mensaje</Text>
                  <TextArea name="message" placeholder="Escribe el contenido del aviso..." required style={{ minHeight: 100 }} />
                </label>
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">Tipo de Alerta</Text>
                  <Select.Root name="type" defaultValue="info">
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item value="info">ℹ️ Información (Azul)</Select.Item>
                      <Select.Item value="warning">⚠️ Advertencia (Naranja)</Select.Item>
                      <Select.Item value="success">✅ Éxito (Verde)</Select.Item>
                      <Select.Item value="error">🚨 Error / Urgente (Rojo)</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </label>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">Cancelar</Button>
                  </Dialog.Close>
                  <Button type="submit" color="violet" loading={formLoading}>Enviar Notificación</Button>
                </Flex>
              </Flex>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      <Card size="3">
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Aviso</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tipo</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Fecha</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell justify="center">Acciones</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {notifications.map((n) => (
              <Table.Row key={n.id} align="center">
                <Table.Cell>
                  <Text weight="bold" as="div">{n.title}</Text>
                  <Text size="1" color="gray" className="line-clamp-1">{n.message}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={
                    n.type === 'info' ? 'blue' : 
                    n.type === 'warning' ? 'orange' : 
                    n.type === 'success' ? 'green' : 'red'
                  }>
                    {n.type.toUpperCase()}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text size="2">{format(new Date(n.createdAt), 'dd/MM HH:mm', { locale: es })}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Switch 
                      checked={n.isActive} 
                      onCheckedChange={() => toggleActive(n.id, n.isActive)} 
                    />
                    <Text size="1">{n.isActive ? 'Activa' : 'Pausada'}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell justify="center">
                  <Button variant="ghost" color="red" size="1" onClick={() => deleteNotification(n.id)}>
                    <Trash size={14} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}

            {notifications.length === 0 && !isLoading && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-10">
                  <Flex direction="column" align="center" gap="2">
                    <Megaphone size={32} className="text-gray-300" />
                    <Text color="gray">No hay notificaciones enviadas.</Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card>
    </div>
  );
}
