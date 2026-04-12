'use client';

import { useEffect } from 'react';
import { Callout, Flex, Container, Box, IconButton } from '@radix-ui/themes';
import { Info, AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';

export function GlobalNotificationAlert() {
  const { activeNotifications, fetchActiveNotifications } = useNotificationStore();

  useEffect(() => {
    fetchActiveNotifications();
    // Refresh cada 5 minutos
    const interval = setInterval(fetchActiveNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchActiveNotifications]);

  if (activeNotifications.length === 0) return null;

  return (
    <Box className="w-full">
      {activeNotifications.map((n) => (
        <Callout.Root 
          key={n.id} 
          size="1" 
          variant="soft" 
          color={
            n.type === 'info' ? 'blue' : 
            n.type === 'warning' ? 'orange' : 
            n.type === 'success' ? 'green' : 'red'
          }
          style={{ borderRadius: 0 }}
        >
          <Container size="4">
            <Callout.Icon>
              {n.type === 'info' && <Info size={16} />}
              {n.type === 'warning' && <AlertTriangle size={16} />}
              {n.type === 'success' && <CheckCircle size={16} />}
              {n.type === 'error' && <AlertCircle size={16} />}
            </Callout.Icon>
            <Callout.Text>
              <strong>{n.title}:</strong> {n.message}
            </Callout.Text>
          </Container>
        </Callout.Root>
      ))}
    </Box>
  );
}
