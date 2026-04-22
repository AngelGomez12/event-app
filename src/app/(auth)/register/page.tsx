"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Heading,
  Text,
  TextField,
  Flex,
  Box,
  Separator,
  Select,
} from "@radix-ui/themes";
import { PasswordInput } from "@/components/forms/PasswordInput";
import Link from "next/link";
import { tenantService } from "@/services/tenant.service";
import { SubscriptionPlan } from "@/lib/api";

type RegisterStep = "form" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan>(SubscriptionPlan.BASIC);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const salonName = formData.get("salonName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await tenantService.onboard({
        salonName,
        email,
        password,
        plan,
      });

      // Si el backend devuelve un initPoint, redirigimos directamente a Mercado Pago
      if (response.initPoint || response.sandboxInitPoint) {
        const redirectUrl = response.initPoint || response.sandboxInitPoint;
        window.location.href = redirectUrl;
        return; // Detenemos la ejecución ya que estamos saliendo de la app
      }

      // Si no hay initPoint (plan gratuito), vamos a la pantalla de éxito
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Error al registrar el salón");
      setLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
        <Card size="4" style={{ width: "100%", maxWidth: 480 }}>
          <Flex direction="column" gap="4" align="center">
            <Heading size="7" weight="bold">
              ¡Registro Exitoso!
            </Heading>
            <Text size="3" color="gray" align="center">
              Tu salón ha sido creado correctamente. Ya podés empezar a
              gestionarlo.
            </Text>
            <Button
              size="3"
              color="violet"
              onClick={() => router.push("/login")}
            >
              Ir al Login
            </Button>
          </Flex>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: "100%", maxWidth: 480 }}>
        <Flex direction="column" gap="1" mb="5" align="center">
          <Heading size="7" weight="bold">
            Crea tu Salón
          </Heading>
          <Text size="2" color="gray">
            Comienza a gestionar tus eventos hoy mismo
          </Text>
        </Flex>

        <form onSubmit={handleRegister}>
          <Flex direction="column" gap="4">
            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="salonName">
                Nombre del Salón
              </Text>
              <TextField.Root
                name="salonName"
                id="salonName"
                placeholder="Ej. Salón Cristal"
                required
                mt="1"
                size="3"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="email">
                Email del Administrador
              </Text>
              <TextField.Root
                name="email"
                id="email"
                type="email"
                placeholder="admin@tu-salon.com"
                required
                mt="1"
                size="3"
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" htmlFor="password">
                Contraseña
              </Text>
              <PasswordInput
                name="password"
                id="password"
                placeholder="Mínimo 8 caracteres"
                required
                mt="1"
                size="3"
                showLeftIcon={false}
              />
            </Box>

            <Box>
              <Text as="label" size="2" weight="medium" mb="1">
                Plan de Suscripción
              </Text>
              <Select.Root
                value={plan}
                onValueChange={(v) => setPlan(v as SubscriptionPlan)}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value={SubscriptionPlan.BASIC}>
                    Plan Básico (UYU 0/mes)
                  </Select.Item>
                  <Select.Item value={SubscriptionPlan.PREMIUM}>
                    Plan Premium (UYU 1500/mes)
                  </Select.Item>
                  <Select.Item value={SubscriptionPlan.ENTERPRISE}>
                    Plan Enterprise (Consultar)
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            {error && (
              <Text size="2" style={{ color: "var(--ruby-11)" }}>
                {error}
              </Text>
            )}

            <Separator size="4" />

            <Button
              type="submit"
              size="3"
              color="violet"
              style={{ width: "100%", fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar Salón"}
            </Button>

            <Flex justify="center" mt="2">
              <Text size="2">
                ¿Ya tienes un salón?{" "}
                <Link
                  href="/login"
                  style={{ color: "var(--violet-10)", fontWeight: 600 }}
                >
                  Inicia sesión
                </Link>
              </Text>
            </Flex>
          </Flex>
        </form>
      </Card>
    </div>
  );
}
