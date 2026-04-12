'use client';

import { useEffect, useState } from 'react';
import { Flex, Text, Button, Box } from '@radix-ui/themes';
import { ShieldAlert } from 'lucide-react';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth.service';

export function ImpersonationBanner() {
  const [isImpersonating, setIsImpersonating] = useState(false);

  useEffect(() => {
    // Verificamos si existe el token de impersonación
    const checkImpersonation = () => {
      const token = Cookies.get('impersonatorToken');
      setIsImpersonating(!!token);
    };

    checkImpersonation();
    
    // Escuchar cambios (opcional, por si se borra manual)
    const interval = setInterval(checkImpersonation, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isImpersonating) return null;

  return (
    <Box 
      style={{ 
        backgroundColor: 'var(--amber-9)', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Flex justify="between" align="center" px="4" py="2">
        <Flex align="center" gap="2">
          <ShieldAlert size={18} />
          <Text size="2" weight="bold">
            Modo Impersonación Activo: Estás viendo el sistema como un Salón.
          </Text>
        </Flex>
        <Button 
          variant="solid" 
          color="gray" 
          highContrast
          size="1" 
          onClick={() => authService.stopImpersonating()}
        >
          Volver a Super Admin
        </Button>
      </Flex>
    </Box>
  );
}
