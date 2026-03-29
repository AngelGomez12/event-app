import Link from "next/link";
import { Button, Heading, Text, Flex } from "@radix-ui/themes";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900 text-white">
      <main className="flex flex-col items-center gap-8 text-center p-8">
        <Flex direction="column" align="center" gap="4">
          <Heading
            size="9"
            weight="bold"
            style={{ color: 'white', letterSpacing: '-0.02em' }}
          >
            Gestión de Eventos
          </Heading>
          <Text
            size="4"
            style={{ color: 'var(--violet-4)', maxWidth: 520, textAlign: 'center' }}
          >
            La plataforma integral para administrar salones de fiestas y organizar tu evento soñado.
          </Text>
        </Flex>

        <Flex gap="3" mt="4">
          <Link href="/login">
            <Button size="4" variant="solid" color="violet" style={{ fontWeight: 700 }}>
              Iniciar Sesión
            </Button>
          </Link>
        </Flex>
      </main>

      <footer className="mt-16">
        <Text size="1" style={{ color: 'var(--violet-6)' }}>
          &copy; 2026 Admin Eventos. Todos los derechos reservados.
        </Text>
      </footer>
    </div>
  );
}
