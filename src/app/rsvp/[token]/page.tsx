"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  Heading,
  Text,
  Flex,
  Box,
  Button,
  Spinner,
  Badge,
} from "@radix-ui/themes";
import { Check, X, PartyPopper } from "lucide-react";
import { rsvpService, RsvpDetails } from "@/services/rsvp.service";

export default function RsvpPage() {
  const params = useParams();
  const token = params.token as string;

  const [invitation, setInvitation] = useState<RsvpDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        if (!token) return;
        const data = await rsvpService.getInvitation(token);
        setInvitation(data);
      } catch (err: any) {
        setError(
          err.message ||
            "No pudimos cargar la invitación. Puede que el link sea inválido o haya expirado.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleConfirm = async (statusArg: "CONFIRMED" | "DECLINED") => {
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await rsvpService.confirmAttendance(token, statusArg);
      setInvitation((prev) =>
        prev
          ? { ...prev, attendanceStatus: statusArg, status: statusArg }
          : null,
      );
      alert(
        `Asistencia ${statusArg === "CONFIRMED" ? "Confirmada" : "Rechazada"} correctamente.`,
      );
    } catch (err: any) {
      setError(
        err.message ||
          "Hubo un error al guardar tu respuesta. Por favor, intentá de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex
        align="center"
        justify="center"
        minHeight="100vh"
        className="bg-slate-50"
      >
        <Flex direction="column" align="center" gap="3">
          <Spinner size="3" />
          <Text color="gray">Cargando invitación...</Text>
        </Flex>
      </Flex>
    );
  }

  if (error && !invitation) {
    return (
      <Flex
        align="center"
        justify="center"
        minHeight="100vh"
        className="bg-slate-50 p-4"
      >
        <Card size="4" style={{ maxWidth: 400, width: "100%" }}>
          <Flex
            direction="column"
            align="center"
            gap="4"
            className="text-center"
          >
            <Box className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <X size={32} className="text-red-500" />
            </Box>
            <Heading size="6">Ups! Algo salió mal</Heading>
            <Text color="gray">{error}</Text>
          </Flex>
        </Card>
      </Flex>
    );
  }

  if (!invitation) return null;

  // Normalización de datos para soportar distintos formatos del backend
  const guestName =
    invitation.fullName ||
    invitation.guestName ||
    invitation.name ||
    "Invitado";
  const currentStatus =
    invitation.attendanceStatus || invitation.status || invitation.estado;
  const isConfirmed =
    currentStatus === "CONFIRMED" || currentStatus === "confirmado";
  const isDeclined =
    currentStatus === "DECLINED" || currentStatus === "rechazado";
  const isAnswered = isConfirmed || isDeclined;

  // Normalización evento
  const eventName =
    invitation.event?.name ||
    invitation.event?.title ||
    invitation.event?.guestName ||
    "tu evento privado";
  const eventImage = invitation.event?.imageUrl; // Permitimos mostrar imagen del evento si tiene

  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      className="bg-slate-50 p-4"
    >
      <Card
        size="4"
        style={{ maxWidth: 500, width: "100%", overflow: "hidden" }}
        className="p-0"
      >
        {/* Header Header con Foto del Evento o Color sólido */}
        <Box
          style={{
            height: 160,
            width: "100%",
            position: "relative",
            backgroundColor: "var(--violet-9)",
          }}
          className="mb-8"
        >
          {eventImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={eventImage}
              alt="Portada del evento"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Flex align="center" justify="center" height="100%">
              <PartyPopper size={48} color="white" opacity={0.5} />
            </Flex>
          )}
          <Box
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center absolute shadow-md border-4 border-white"
            style={{ bottom: -40, left: "50%", transform: "translateX(-50%)" }}
          >
            <PartyPopper size={36} className="text-violet-600" />
          </Box>
        </Box>

        <Flex
          direction="column"
          align="center"
          gap="5"
          className="text-center p-6 pt-0"
        >
          <Heading size="7" className="tracking-tight text-slate-900 mt-4">
            ¡Hola, {guestName}!
          </Heading>

          <Text size="3" color="gray" className="max-w-xs">
            Te han invitado a <br />
            <Text weight="bold" color="violet">
              {eventName}
            </Text>
          </Text>

          {isAnswered ? (
            <Flex
              direction="column"
              align="center"
              gap="4"
              mt="4"
              className="w-full bg-slate-50 p-6 rounded-xl border border-slate-200"
            >
              <Badge
                size="3"
                color={isConfirmed ? "green" : "red"}
                variant="soft"
                radius="full"
              >
                {isConfirmed ? "ASISTENCIA CONFIRMADA" : "ASISTENCIA RECHAZADA"}
              </Badge>

              <Text size="2" color="gray" mt="2">
                {isConfirmed
                  ? "¡Qué bueno que venís! Ya anotamos tu confirmación."
                  : "¡Qué lástima que no podés venir! Gracias por avisar."}
              </Text>

              <Text size="1" color="gray" mt="4">
                Si necesitas cambiar tu respuesta, contactate con el
                organizador.
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" gap="3" w="100%" mt="4">
              {error && (
                <Box className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-2 text-center">
                  {error}
                </Box>
              )}

              <Text size="2" weight="medium" mb="2">
                ¿Vas a poder asistir?
              </Text>
              <Button
                size="4"
                color="green"
                variant="soft"
                onClick={() => handleConfirm("CONFIRMED")}
                disabled={isSubmitting}
              >
                <Check size={20} className="mr-2" />
                Sí, confirmo asistencia
              </Button>

              <Button
                size="4"
                color="red"
                variant="ghost"
                onClick={() => handleConfirm("DECLINED")}
                disabled={isSubmitting}
              >
                <X size={20} className="mr-2" />
                No voy a poder ir
              </Button>
            </Flex>
          )}
        </Flex>
      </Card>
    </Flex>
  );
}
