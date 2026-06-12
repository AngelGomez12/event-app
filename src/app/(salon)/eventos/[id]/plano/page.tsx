"use client";

import { useParams, useRouter } from "next/navigation";
import { Flex, Button, Heading, Text, Box, Card, Spinner } from "@radix-ui/themes";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import FloorPlanCanvas from "@/components/floor-plan/FloorPlanCanvas";
import { useEventStore } from "@/store/useEventStore";
import { useEffect } from "react";

export default function SalonPlanoPage() {
  const params = useParams();
  const id = params.id as string;
  const { myEvent, fetchEventoById, isLoading } = useEventStore();

  useEffect(() => {
    if (id) {
      fetchEventoById(id);
    }
  }, [id, fetchEventoById]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "80vh" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  return (
    <Box p="4">
      <Flex align="center" gap="4" mb="6">
        <Button variant="ghost" color="gray" asChild>
          <Link href={`/eventos/${id}`}>
            <ArrowLeft size={16} /> Volver al Evento
          </Link>
        </Button>
        <Flex direction="column">
          <Heading size="6">Diseño de Plano del Salón</Heading>
          <Text size="2" color="gray">
            Configurá la infraestructura y el layout base para {myEvent?.honoreeName}
          </Text>
        </Flex>
      </Flex>

      <Card size="2">
        <FloorPlanCanvas />
      </Card>
    </Box>
  );
}
