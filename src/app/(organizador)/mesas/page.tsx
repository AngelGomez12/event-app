"use client";

import { useGuestStore, Invitado } from "@/store/useGuestStore";
import { useEventStore } from "@/store/useEventStore";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  Dialog,
  TextField,
  Flex,
  Box,
  Separator,
  Spinner,
  Callout,
} from "@radix-ui/themes";
import { Plus, User, AlertCircle, Search, X } from "lucide-react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import FloorPlanCanvas from "@/components/floor-plan/FloorPlanCanvas";
import { useFloorPlanStore } from "@/store/useFloorPlanStore";

function DraggableGuest({ guest }: { guest: Invitado }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: guest.id,
    data: guest,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        position: "relative" as any,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing mb-2"
    >
      <Flex
        justify="between"
        align="center"
        p="2"
        style={{
          background: "white",
          borderRadius: "var(--radius-2)",
          border: "1px solid var(--gray-4)",
          boxShadow: transform ? "0 5px 15px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <Flex align="center" gap="2">
          <User size={12} style={{ color: "var(--gray-9)" }} />
          <Text size="2" weight="medium">
            {guest.nombre}
          </Text>
        </Flex>
      </Flex>
    </div>
  );
}

function UnassignedDroppable({ children, count }: { children: React.ReactNode, count: number }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "unassigned",
  });

  return (
    <Card
      size="2"
      ref={setNodeRef}
      style={{
        border: isOver ? "1px solid var(--violet-8)" : "1px solid var(--amber-6)",
        background: isOver ? "var(--violet-1)" : "var(--amber-1)",
        transition: "all 0.2s ease",
      }}
    >
      <Flex align="center" gap="2" mb="3">
        <AlertCircle size={14} style={{ color: isOver ? "var(--violet-9)" : "var(--amber-9)" }} />
        <Text
          size="2"
          weight="bold"
          style={{ color: isOver ? "var(--violet-11)" : "var(--amber-11)" }}
        >
          Sin Asignar ({count})
        </Text>
      </Flex>

      <div
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          paddingRight: 4,
          minHeight: "100px",
        }}
      >
        {children}
      </div>
    </Card>
  );
}

export default function MesasPage() {
  const { myEvent, fetchMyEvent } = useEventStore();
  const {
    mesas,
    addMesa,
    invitados,
    fetchInvitados,
    fetchMesas,
    assignMesa,
    error: guestError,
  } = useGuestStore();

  const [newTable, setNewTable] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMyEvent();
  }, [fetchMyEvent]);

  useEffect(() => {
    if (myEvent) {
      fetchInvitados(myEvent.id);
      fetchMesas(myEvent.id);
    }
  }, [myEvent, fetchInvitados, fetchMesas]);

  const handleSearch = useCallback(
    (query: string) => {
      if (myEvent) {
        fetchInvitados(myEvent.id, 1, undefined, query);
      }
    },
    [myEvent, fetchInvitados],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleAddMesa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myEvent || !newTable.trim()) return;
    await addMesa(myEvent.id, newTable);
    setNewTable("");
    setIsModalOpen(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const guestId = active.id as string;
    const destinationMesaId = over.id as string;

    const guest = invitados.find((i) => i.id === guestId);
    if (!guest) return;

    const targetMesa = destinationMesaId === "unassigned" ? "none" : destinationMesaId;

    if ((guest.mesaId || "none") !== targetMesa) {
      assignMesa(guestId, targetMesa);
    }
  };

  if (!myEvent) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
        <Spinner size="3" />
      </Flex>
    );
  }

  const confirmadosSinMesa = invitados.filter(
    (i) => i.estado === "confirmado" && !i.mesaId,
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Flex direction="column" gap="6">
        {guestError && (
          <Callout.Root color="red" size="1">
            <Callout.Icon>
              <AlertCircle size={16} />
            </Callout.Icon>
            <Callout.Text>{guestError}</Callout.Text>
          </Callout.Root>
        )}
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Heading size="7" weight="bold">
              Organización de Mesas y Plano
            </Heading>
            <Text size="2" color="gray">
              Diseñá tu salón y ubicá a tus invitados
            </Text>
          </Flex>

          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger>
              <Button size="3" color="violet">
                <Plus size={16} /> Nueva Mesa
              </Button>
            </Dialog.Trigger>
            <Dialog.Content size="4" style={{ maxWidth: 400 }}>
              <Dialog.Title>Crear Mesa</Dialog.Title>
              <Separator size="4" my="4" />
              <form onSubmit={handleAddMesa}>
                <Flex direction="column" gap="4">
                  <Box>
                    <Text as="label" size="2" weight="medium">
                      Nombre de la Mesa
                    </Text>
                    <TextField.Root
                      mt="1"
                      size="3"
                      placeholder="Ej: Amigos del Novio"
                      value={newTable}
                      onChange={(e) => setNewTable(e.target.value)}
                      autoFocus
                    />
                  </Box>
                  <Flex gap="3" justify="end">
                    <Dialog.Close>
                      <Button
                        variant="soft"
                        color="gray"
                        type="button"
                        size="3"
                      >
                        Cancelar
                      </Button>
                    </Dialog.Close>
                    <Button
                      type="submit"
                      color="violet"
                      size="3"
                      disabled={!newTable.trim()}
                    >
                      Crear
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Dialog.Content>
          </Dialog.Root>
        </Flex>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-80 shrink-0">
            <Flex direction="column" gap="4">
              <TextField.Root
                placeholder="Buscar invitado..."
                size="2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <TextField.Slot>
                  <Search size={14} />
                </TextField.Slot>
              </TextField.Root>

              <UnassignedDroppable count={confirmadosSinMesa.length}>
                {confirmadosSinMesa.map((guest) => (
                  <DraggableGuest key={guest.id} guest={guest} />
                ))}
                {confirmadosSinMesa.length === 0 && (
                  <Text
                    key="no-guests"
                    size="2"
                    color="gray"
                    style={{
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "20px 0",
                    }}
                  >
                    No hay invitados confirmados sin mesa.
                  </Text>
                )}
              </UnassignedDroppable>
            </Flex>
          </div>

          <div className="flex-1">
            <FloorPlanCanvas />
          </div>
        </div>
      </Flex>
    </DndContext>
  );
}
