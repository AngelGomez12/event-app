'use client';

import { useEffect, useState } from 'react';
import { Heading, Text, Badge, Flex, Card, Button, Dialog, TextField, TextArea, Select, Switch, Box } from '@radix-ui/themes';
import { Plus, Trash, Megaphone } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DataTable } from '@/components/DataTable';
import { GlobalNotification } from '@/services/notification.service';

export default function NotificationsAdminPage() {
  const { 
    notifications, fetchNotifications, addNotification, 
    updateNotification, deleteNotification, isLoading, pagination 
  } = useNotificationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotifications(1, pagination.limit, search);
  }, [fetchNotifications, search]);

  const handlePageChange = (page: number) => {
    fetchNotifications(page, pagination.limit, search);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

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
      fetchNotifications(1, pagination.limit, search);
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await updateNotification(id, { isActive: !current });
  };

  const columns = [
    {
        header: 'Aviso',
        accessor: (n: GlobalNotification) => (
            <Box>
                <Text weight="bold" as="div" size="2">{n.title}</Text>
                <Text size="1" color="gray" className="line-clamp-1">{n.message}</Text>
            </Box>
        )
    },
    {
        header: 'Tipo',
        accessor: (n: GlobalNotification) => (
            <Badge color={
                n.type === 'info' ? 'blue' : 
                n.type === 'warning' ? 'orange' : 
                n.type === 'success' ? 'green' : 'red'
            }>
                {n.type.toUpperCase()}
            </Badge>
        )
    },
    {
        header: 'Fecha',
        accessor: (n: GlobalNotification) => (
            <Text size="2">{format(new Date(n.createdAt), 'dd/MM HH:mm', { locale: es })}</Text>
        )
    },
    {
        header: 'Estado',
        accessor: (n: GlobalNotification) => (
            <Flex align="center" gap="2">
                <Switch 
                    checked={n.isActive} 
                    onCheckedChange={() => toggleActive(n.id, n.isActive)} 
                />
                <Text size="1">{n.isActive ? 'Activa' : 'Pausada'}</Text>
            </Flex>
        )
    },
    {
        header: 'Acciones',
        accessor: (n: GlobalNotification) => (
            <Button variant="ghost" color="red" size="1" onClick={() => deleteNotification(n.id)}>
                <Trash size={14} />
            </Button>
        ),
        align: 'center' as const
    }
  ];

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

      <Card size="3" className="p-0 overflow-hidden">
        <DataTable
            columns={columns}
            data={notifications}
            isLoading={isLoading}
            emptyMessage="No hay notificaciones enviadas."
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            onSearchChange={handleSearch}
            searchPlaceholder="Buscar por título..."
        />
      </Card>
    </div>
  );
}
