"use client";

import { Invitado, useGuestStore } from "@/store/useGuestStore";
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  AlertTriangle,
  ArrowLeft,
  CameraOff,
  CheckCircle2,
  Home,
  Info,
  Scan,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CheckInPage() {
  const { id: eventId } = useParams();
  const router = useRouter();
  const { checkInInvitado, mesas, fetchMesas } = useGuestStore();

  const [scannedGuest, setScannedGuest] = useState<Invitado | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Verificar si estamos en un contexto seguro (HTTPS o localhost)
    if (typeof window !== "undefined") {
      setIsSecure(window.isSecureContext);
    }

    if (eventId) {
      fetchMesas(eventId as string);
    }
  }, [eventId, fetchMesas]);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      if (!isScanning || scannedGuest || error) return;

      try {
        // Asegurarse de que el elemento existe
        const element = document.getElementById("reader");
        if (!element) return;

        if (!scannerInstanceRef.current) {
          scannerInstanceRef.current = new Html5Qrcode("reader", {
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          });
        }

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await scannerInstanceRef.current.start(
          { facingMode: "environment" }, // Forzar cámara trasera
          config,
          onScanSuccess,
          onScanError,
        );
      } catch (err: any) {
        console.error("Error starting scanner:", err);
        if (mounted) {
          if (
            err?.includes?.("NotAllowedError") ||
            err?.name === "NotAllowedError"
          ) {
            setError("No diste permiso para usar la cámara.");
          } else if (!window.isSecureContext) {
            setError(
              "El navegador bloquea la cámara en sitios no seguros (HTTP).",
            );
          } else {
            setError(
              "No se pudo acceder a la cámara. Verificá que no esté en uso.",
            );
          }
          setIsScanning(false);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (scannerInstanceRef.current && scannerInstanceRef.current.isScanning) {
        scannerInstanceRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning, scannedGuest, error]);

  async function onScanSuccess(decodedText: string) {
    try {
      // Detener el escaneo inmediatamente para evitar múltiples lecturas
      if (scannerInstanceRef.current && scannerInstanceRef.current.isScanning) {
        await scannerInstanceRef.current.stop();
      }

      setError(null);
      const guestId = decodedText.trim();
      setIsScanning(false);

      const guest = await checkInInvitado(eventId as string, guestId);
      setScannedGuest(guest);

      const audio = new Audio("/success.mp3");
      audio.play().catch(() => {});
    } catch (err: any) {
      setError("Código inválido o invitado no encontrado.");
      setIsScanning(false);
      // Si falla, permitimos reintentar después de un momento o con el botón
    }
  }

  function onScanError(err: any) {
    // Ignorar errores de escaneo continuo
  }

  const handleReset = async () => {
    if (scannerInstanceRef.current && scannerInstanceRef.current.isScanning) {
      await scannerInstanceRef.current.stop();
    }
    setScannedGuest(null);
    setError(null);
    setIsScanning(true);
  };

  const getMesaNombre = (mesaId?: string) => {
    if (!mesaId) return "Sin asignar";
    const mesa = mesas.find((m) => m.id === mesaId);
    return mesa ? mesa.nombre : "Desconocida";
  };

  return (
    <Box className="min-h-screen bg-slate-50 p-6 md:p-12">
      <Flex direction="column" gap="4" className="max-w-xl mx-auto">
        {/* Header Navigation */}
        <Flex justify="between" align="center" mb="4">
          <IconButton
            variant="ghost"
            color="gray"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Text
            size="1"
            weight="bold"
            className="uppercase tracking-widest text-slate-400"
          >
            Control de Acceso
          </Text>
          <Box className="w-8" /> {/* Spacer */}
        </Flex>

        {!isSecure && (
          <Callout.Root color="amber" variant="surface" size="1">
            <Callout.Icon>
              <Info size={16} />
            </Callout.Icon>
            <Callout.Text>
              Estás usando una conexión no segura (HTTP). La cámara{" "}
              <strong>no funcionará</strong> a menos que uses HTTPS o configures
              los flags de Chrome.
            </Callout.Text>
          </Callout.Root>
        )}

        <Box className="text-center space-y-2 py-4">
          <Heading size="8" weight="bold" className="tracking-tight">
            Puerta de Ingreso
          </Heading>
          <Text color="gray" className="font-medium">
            Escanea el código QR del invitado para confirmar asistencia.
          </Text>
        </Box>

        {/* Scanner View */}
        <Card
          size="3"
          className="overflow-hidden p-0 relative border-2 border-slate-200 shadow-xl"
        >
          {isScanning && !error ? (
            <Box className="bg-black aspect-square flex items-center justify-center relative">
              <div id="reader" className="w-full h-full" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-violet-500 rounded-2xl animate-pulse pointer-events-none" />
              <Flex className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 gap-2 items-center">
                <Scan size={14} className="text-white animate-spin" />
                <Text
                  size="1"
                  weight="bold"
                  className="text-white uppercase tracking-wider"
                >
                  Buscando QR...
                </Text>
              </Flex>
            </Box>
          ) : (
            <Box className="p-8">
              {scannedGuest ? (
                <Flex
                  direction="column"
                  align="center"
                  gap="6"
                  className="text-center animate-in fade-in zoom-in duration-300"
                >
                  <Box className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={40} />
                  </Box>

                  <Box className="space-y-1">
                    <Text
                      size="1"
                      weight="bold"
                      className="uppercase tracking-widest text-green-600"
                    >
                      Acceso Autorizado
                    </Text>
                    <Heading size="7" weight="bold" className="tracking-tight">
                      {scannedGuest.nombre}
                    </Heading>
                  </Box>

                  <Card
                    variant="surface"
                    className="w-full bg-slate-50 border-slate-200"
                  >
                    <Flex direction="column" gap="4" p="2">
                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2" className="text-slate-500">
                          <Home size={16} />
                          <Text
                            size="2"
                            weight="bold"
                            className="uppercase tracking-wider"
                          >
                            Ubicación
                          </Text>
                        </Flex>
                        <Badge
                          size="3"
                          color="violet"
                          variant="solid"
                          className="font-bold px-4 py-1 rounded-md text-lg"
                        >
                          {getMesaNombre(scannedGuest.mesaId)}
                        </Badge>
                      </Flex>

                      <Separator size="4" className="opacity-50" />

                      <Flex justify="between" align="center">
                        <Flex align="center" gap="2" className="text-slate-500">
                          <AlertTriangle size={16} />
                          <Text
                            size="2"
                            weight="bold"
                            className="uppercase tracking-wider"
                          >
                            Restricción
                          </Text>
                        </Flex>
                        <Text size="2" weight="bold" className="text-slate-900">
                          {scannedGuest.restriccionAlimentaria || "Ninguna"}
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>

                  <Button
                    size="4"
                    color="violet"
                    className="w-full font-bold cursor-pointer mt-4"
                    onClick={handleReset}
                  >
                    Siguiente Invitado
                  </Button>
                </Flex>
              ) : error ? (
                <Flex
                  direction="column"
                  align="center"
                  gap="6"
                  className="text-center py-4"
                >
                  <Box className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                    <CameraOff size={40} />
                  </Box>
                  <Box className="space-y-1">
                    <Heading size="5" weight="bold" className="text-red-600">
                      Error de Cámara
                    </Heading>
                    <Text color="gray" className="font-medium">
                      {error}
                    </Text>
                  </Box>
                  <Button
                    size="3"
                    variant="soft"
                    color="gray"
                    className="w-full font-bold cursor-pointer"
                    onClick={handleReset}
                  >
                    Intentar de nuevo
                  </Button>

                  {!isSecure && (
                    <Text
                      size="1"
                      color="amber"
                      className="bg-amber-50 p-3 rounded-md border border-amber-200"
                    >
                      Para probar por IP local, entrá en{" "}
                      <strong>
                        chrome://flags/#unsafely-treat-insecure-origin-as-secure
                      </strong>{" "}
                      en Chrome y agregá tu IP.
                    </Text>
                  )}
                </Flex>
              ) : null}
            </Box>
          )}
        </Card>

        {/* Footer info */}
        <Flex
          justify="center"
          align="center"
          gap="2"
          className="text-slate-400 mt-4"
        >
          <User size={14} />
          <Text size="1" weight="medium">
            Personal autorizado: Puerta Principal
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
