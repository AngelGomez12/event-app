'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Heading, Text, TextField, Flex, Box, Separator } from '@radix-ui/themes';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'salon' | 'organizador'>('salon');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'salon') {
      router.push('/dashboard');
    } else {
      router.push('/mi-evento');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: '100%', maxWidth: 420 }}>
        <Flex direction="column" gap="1" mb="5" align="center">
          <Heading size="7" weight="bold">Bienvenido</Heading>
          <Text size="2" color="gray">Inicia sesión para gestionar tus eventos</Text>
        </Flex>

        <form onSubmit={handleLogin}>
          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="email">Email</Text>
              <TextField.Root
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                required
                mt="1"
                size="3"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="password">Contraseña</Text>
              <TextField.Root
                id="password"
                type="password"
                placeholder="••••••••"
                required
                mt="1"
                size="3"
              />
            </Box>

            <Separator size="4" />

            <Box>
              <Text as="div" size="1" weight="bold" color="gray" mb="2" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rol para Demo
              </Text>
              <Flex gap="2">
                <Button
                  type="button"
                  variant={role === 'salon' ? 'solid' : 'surface'}
                  color={role === 'salon' ? 'violet' : 'gray'}
                  style={{ flex: 1 }}
                  onClick={() => setRole('salon')}
                >
                  Dueño Salón
                </Button>
                <Button
                  type="button"
                  variant={role === 'organizador' ? 'solid' : 'surface'}
                  color={role === 'organizador' ? 'violet' : 'gray'}
                  style={{ flex: 1 }}
                  onClick={() => setRole('organizador')}
                >
                  Organizador
                </Button>
              </Flex>
            </Box>

            <Button type="submit" size="3" color="violet" style={{ width: '100%', fontWeight: 700 }}>
              Ingresar como {role === 'salon' ? 'Administrador' : 'Agasajado'}
            </Button>
          </Flex>
        </form>
      </Card>
    </div>
  );
}
