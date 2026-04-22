"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Card,
  Badge,
  Spinner,
  Separator,
} from "@radix-ui/themes";
import { Calendar, MapPin, User, Ticket } from "lucide-react";
import { guestService } from "@/services/guest.service";
import { eventService } from "@/services/event.service";
import { Invitado } from "@/store/useGuestStore";
import { Event } from "@/lib/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function InvitacionPublicaPage() {
  const { id: guestId } = useParams();
  const [invitado, setInvitado] = useState<Invitado | null>(null);
  const [evento, setEvento] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En una app real, este ID vendría de un token o el backend tendría un endpoint público
        // Para este demo, intentamos buscarlo (necesitaríamos el eventId que lo sacaremos del invitado en el backend real)
        // Por ahora simulamos la data si no tenemos el eventId a mano fácilmente
        setLoading(true);
        
        // Simulación de fetch (esto se conectaría a un endpoint público /public/guest/:id)
        // Por ahora mostramos lo que el invitado vería
        setTimeout(() => {
            setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching invitation", error);
        setLoading(false);
      }
    };

    if (guestId) fetchData();
  }, [guestId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" className="min-h-screen bg-slate-50">
        <Spinner size="3" />
      </Flex>
    );
  }

  return (
    <Box className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Flex direction="column" gap="6" className="max-w-md mx-auto">
        <Card size="4" className="overflow-hidden p-0 border-none shadow-2xl rounded-[32px]">
          {/* Cover Header */}
          <Box className="bg-violet-600 p-10 text-white text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%"><pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="white" /></pattern><rect width="100%" height="100%" fill="url(#pattern)" /></svg>
            </div>
            <Text size="1" weight="bold" className="uppercase tracking-[0.3em] opacity-80">Invitación Digital</Text>
            <Heading size="8" weight="bold" className="tracking-tighter">¡Te esperamos!</Heading>
          </Box>

          <Box className="p-8 space-y-8 bg-white">
            {/* QR Section */}
            <Flex direction="column" align="center" gap="4" className="py-2">
                <Box className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                    <QRCodeSVG 
                        value={guestId as string} 
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </Box>
                <Flex align="center" gap="2" className="text-slate-400">
                    <Ticket size={16} />
                    <Text size="1" weight="bold" className="uppercase tracking-widest">Código de Acceso Único</Text>
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
                        <Text size="1" weight="bold" className="uppercase tracking-wider text-slate-400 block">Invitado</Text>
                        <Text size="3" weight="bold" className="text-slate-900">Juan Perez (Demo)</Text>
                    </Box>
                </Flex>

                <Flex gap="4">
                    <Box className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        <Calendar size={20} />
                    </Box>
                    <Box>
                        <Text size="1" weight="bold" className="uppercase tracking-wider text-slate-400 block">Fecha y Hora</Text>
                        <Text size="3" weight="bold" className="text-slate-900">Sábado 25 de Abril, 21:00hs</Text>
                    </Box>
                </Flex>

                <Flex gap="4">
                    <Box className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        <MapPin size={20} />
                    </Box>
                    <Box>
                        <Text size="1" weight="bold" className="uppercase tracking-wider text-slate-400 block">Ubicación</Text>
                        <Text size="3" weight="bold" className="text-slate-900">Salón "La Riviera", Calle Falsa 123</Text>
                    </Box>
                </Flex>
            </Flex>

            <Box className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                <Text size="2" color="slate" className="font-medium italic italic">
                    "Presenta este código en la entrada para agilizar tu ingreso."
                </Text>
            </Box>
          </Box>
        </Card>

        <Text size="1" color="slate" align="center" className="opacity-50 font-medium">
            Powered by Admin Eventos
        </Text>
      </Flex>
    </Box>
  );
}
