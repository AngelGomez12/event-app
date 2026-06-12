"use client";

import { guestService } from "@/services/guest.service";
import {
  Box,
  Card,
  Flex,
  Heading,
  Separator,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { Calendar, MapPin, Ticket, User } from "lucide-react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

export default function InvitacionPublicaPage() {
  const params = useParams();
  const guestId = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!guestId) return;
      try {
        setLoading(true);
        const invitationData = await guestService.getPublicInvitation(guestId);
        setData(invitationData.data);
      } catch (err: any) {
        console.error("Error fetching invitation", err);
        setError(
          "No pudimos encontrar tu invitación. Por favor verificá el link.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [guestId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        className="min-h-screen bg-slate-50"
      >
        <Flex direction="column" align="center" gap="4">
          <Spinner size="3" />
          <Text color="gray" size="2">
            Cargando tu invitación...
          </Text>
        </Flex>
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <Flex
        justify="center"
        align="center"
        className="min-h-screen bg-slate-50 p-6"
      >
        <Card size="3" style={{ maxWidth: 400 }} className="text-center p-8">
          <Heading color="red" mb="2">
            ¡Ups!
          </Heading>
          <Text size="3" color="gray">
            {error || "Algo salió mal al cargar los datos."}
          </Text>
        </Card>
      </Flex>
    );
  }

  const { fullName, event } = data;
  const tenant = event?.tenant;

  return (
    <Box className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Flex direction="column" gap="6" className="max-w-md mx-auto">
        <Card
          size="4"
          className="overflow-hidden p-0 border-none shadow-2xl rounded-[32px]"
        >
          {/* Cover Header */}
          <Box className="bg-violet-600 p-10 text-white text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern
                  id="pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#pattern)" />
              </svg>
            </div>
            <Text
              size="1"
              weight="bold"
              className="uppercase tracking-[0.3em] opacity-80"
            >
              Invitación Digital
            </Text>
            <Heading size="8" weight="bold" className="tracking-tighter">
              ¡Te esperamos {event?.honoreeName}!
            </Heading>
          </Box>

          <Box className="p-8 space-y-8 bg-white">
            {/* QR Section */}
            <Flex direction="column" align="center" gap="4" className="py-2">
              <Box className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                <QRCodeSVG
                  value={guestId}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </Box>
              <Flex align="center" gap="2" className="text-slate-400">
                <Ticket size={16} />
                <Text
                  size="1"
                  weight="bold"
                  className="uppercase tracking-widest"
                >
                  Código de Acceso Único
                </Text>
              </Flex>
            </Flex>

            <Separator size="4" className="opacity-50" />

            {/* Event Info */}
            <Flex direction="column" gap="5">
              <Flex gap="4">
                <Box className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <User size={20} />
                </Box>
                <Box>
                  <Text
                    size="1"
                    weight="bold"
                    className="uppercase tracking-wider text-slate-400 block"
                  >
                    Invitado
                  </Text>
                  <Text size="3" weight="bold" className="text-slate-900">
                    {fullName}
                  </Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </Box>
                <Box>
                  <Text
                    size="1"
                    weight="bold"
                    className="uppercase tracking-wider text-slate-400 block"
                  >
                    Fecha y Hora
                  </Text>
                  <Text
                    size="3"
                    weight="bold"
                    className="text-slate-900 capitalize"
                  >
                    {formatDate(event?.date)}
                  </Text>
                </Box>
              </Flex>

              <Flex gap="4">
                <Box className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                  <MapPin size={20} />
                </Box>
                <Box>
                  <Text
                    size="1"
                    weight="bold"
                    className="uppercase tracking-wider text-slate-400 block"
                  >
                    Ubicación
                  </Text>
                  <Text size="3" weight="bold" className="text-slate-900">
                    Salón {tenant?.name || "A confirmar"},{" "}
                    {tenant?.address || "Dirección pendiente"}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            <Box className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
              <Text size="2" color="gray" className="font-medium italic">
                &quot;Presenta este código en la entrada para agilizar tu
                ingreso.&quot;
              </Text>
            </Box>
          </Box>
        </Card>

        <Text
          size="1"
          color="gray"
          align="center"
          className="opacity-50 font-medium"
        >
          Powered by Admin Eventos
        </Text>
      </Flex>
    </Box>
  );
}
