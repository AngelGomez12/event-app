'use client';

import { Card, Heading, Text, Button, Flex } from '@radix-ui/themes';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingFailurePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: '100%', maxWidth: 480 }}>
        <Flex direction="column" gap="4" align="center">
          <XCircle size={64} style={{ color: 'var(--red-9)' }} />
          <Heading size="7" weight="bold">Hubo un problema</Heading>
          <Text size="3" color="gray" align="center">
            No pudimos procesar tu pago. No te preocupes, podés volver a intentarlo 
            desde el login una vez que la cuenta esté creada.
          </Text>
          <Button size="3" color="violet" asChild>
            <Link href="/login">Volver al Login</Link>
          </Button>
        </Flex>
      </Card>
    </div>
  );
}
