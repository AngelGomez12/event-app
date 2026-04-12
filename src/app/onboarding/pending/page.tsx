'use client';

import { Card, Heading, Text, Button, Flex } from '@radix-ui/themes';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPendingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: '100%', maxWidth: 480 }}>
        <Flex direction="column" gap="4" align="center">
          <Clock size={64} style={{ color: 'var(--orange-9)' }} />
          <Heading size="7" weight="bold">Pago Pendiente</Heading>
          <Text size="3" color="gray" align="center">
            Estamos esperando la confirmación de tu pago. Una vez procesado, 
            podrás ingresar para gestionar tu salón.
          </Text>
          <Button size="3" color="violet" asChild>
            <Link href="/login">Ir al Login</Link>
          </Button>
        </Flex>
      </Card>
    </div>
  );
}
