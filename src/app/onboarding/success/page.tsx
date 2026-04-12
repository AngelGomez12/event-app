'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Heading, Text, Button, Flex, Spinner } from '@radix-ui/themes';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { tenantService } from '@/services/tenant.service';

export default function OnboardingSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      if (paymentId) {
        try {
          await tenantService.checkPayment(paymentId);
          setActivated(true);
        } catch (error) {
          console.error('Error activating tenant:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkPayment();
  }, [paymentId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: '100%', maxWidth: 480 }}>
        <Flex direction="column" gap="4" align="center">
          {loading ? (
            <>
              <Spinner size="3" />
              <Heading size="7" weight="bold">Verificando pago...</Heading>
              <Text size="3" color="gray" align="center">
                Estamos confirmando tu suscripción con Mercado Pago.
              </Text>
            </>
          ) : (
            <>
              <CheckCircle size={64} style={{ color: 'var(--green-9)' }} />
              <Heading size="7" weight="bold">¡Pago Exitoso!</Heading>
              <Text size="3" color="gray" align="center">
                {activated 
                  ? 'Tu cuenta ha sido activada con éxito. Ya podés empezar a gestionar tu salón.' 
                  : 'Gracias por tu pago. Si tu cuenta no se activa en unos instantes, contactanos.'}
              </Text>
              <Button size="3" color="violet" asChild mt="4">
                <Link href="/login">Ir al Login</Link>
              </Button>
            </>
          )}
        </Flex>
      </Card>
    </div>
  );
}
