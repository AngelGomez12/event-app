"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Card,
  Heading,
  Text,
  TextField,
  Flex,
  Box,
  Separator,
  Callout,
} from "@radix-ui/themes";
import { PasswordInput } from "@/components/forms/PasswordInput";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { tenantService } from "@/services/tenant.service";
import { Role } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await authService.login(email, password);
      // Validar si logeó bien y redirigir
      const { user } = result.data;
      const role = user.role;

      if (role === Role.SUPER_ADMIN) {
        router.push("/super-admin/dashboard");
      } else if (role === Role.ADMIN_SALON) {
        router.push("/dashboard"); // (salon)
      } else if (role === Role.ORGANIZADOR) {
        router.push("/mi-evento"); // (organizador)
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      // Manejo de redirección si el pago está pendiente
      if (err.message?.includes("pending payment")) {
        setError("Verificando estado de pago...");
        try {
          const res = await tenantService.getPaymentLink(email);

          if (res.activated) {
            setError(
              "¡Pago confirmado! Tu cuenta ha sido activada. Por favor, ingresa de nuevo.",
            );
            return;
          }

          if (res.initPoint || res.sandboxInitPoint) {
            setError("Pago pendiente. Redirigiendo a Mercado Pago...");
            setTimeout(() => {
              window.location.href = res.initPoint || res.sandboxInitPoint;
            }, 1500);
            return;
          }
        } catch (paymentErr) {
          setError(
            "Pago pendiente, pero no pudimos obtener el link. Contacte a soporte.",
          );
        }
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex direction="column" gap="1" mb="5" align="center">
        <Heading size="7" weight="bold">
          Bienvenido
        </Heading>
        <Text size="2" color="gray">
          Inicia sesión para gestionar tus eventos
        </Text>
      </Flex>

      {registered && (
        <Box mb="4">
          <Callout.Root color="green">
            <Callout.Text>
              ¡Registro exitoso! Ya puedes iniciar sesión con tus credenciales.
            </Callout.Text>
          </Callout.Root>
        </Box>
      )}

      <form onSubmit={handleLogin}>
        <Flex direction="column" gap="4">
          <Box>
            <Text as="label" size="2" weight="medium" htmlFor="email">
              Email
            </Text>
            <TextField.Root
              name="email"
              id="email"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="usuario@ejemplo.com"
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
              placeholder="••••••••"
              required
              mt="1"
              size="3"
              showLeftIcon={false}
            />
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
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>

          <Flex justify="center" mt="2">
            <Text size="2">
              ¿Aún no tienes un salón?{" "}
              <Link
                href="/register"
                style={{ color: "var(--violet-10)", fontWeight: 600 }}
              >
                Regístrate aquí
              </Link>
            </Text>
          </Flex>
        </Flex>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900">
      <Card size="4" style={{ width: "100%", maxWidth: 420 }}>
        <Suspense fallback={<Text>Cargando...</Text>}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}
