"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Text, Popover, Button, Flex, IconButton, Separator } from '@radix-ui/themes';
import { Lock, User, UserMinus } from 'lucide-react';
import { Mesa, Invitado, useGuestStore } from '@/store/useGuestStore';

interface FloorPlanTableProps {
  mesa: Mesa;
  invitados: Invitado[];
  isEditing: boolean;
  isSalonAdmin: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}

export function FloorPlanTable({ mesa, invitados, isEditing, isSalonAdmin, onPointerDown }: FloorPlanTableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: mesa.id,
  });

  const { assignMesa } = useGuestStore();
  const tableGuests = invitados.filter(i => i.mesaId === mesa.id);

  const tableContent = (
    <div 
      className={`w-16 h-16 rounded-full border-2 shadow-md flex flex-col items-center justify-center relative transition-colors ${
        isOver ? 'border-violet-500 bg-violet-50' : 'border-black/20'
      } ${mesa.isStructural ? 'border-orange-500' : ''}`}
      style={{ backgroundColor: isOver ? undefined : mesa.color }}
    >
      <Text size="1" weight="bold" className="text-black/60 text-[8px] uppercase tracking-tighter">
        {mesa.nombre}
      </Text>
      
      {tableGuests.length > 0 && (
        <div className="flex items-center gap-0.5 mt-0.5">
          <User size={8} className="text-black/40" />
          <Text size="1" className="text-[10px] font-bold text-black/60">{tableGuests.length}</Text>
        </div>
      )}

      {mesa.isStructural && <Lock size={10} className="absolute -top-1 -right-1 text-orange-600" />}
      
      {/* Sillas */}
      {Array.from({ length: mesa.seats }).map((_, i) => (
        <div 
          key={i}
          className={`absolute w-1.5 h-3 rounded-full transition-colors ${
            i < tableGuests.length ? 'bg-violet-400' : 'bg-black/10'
          }`}
          style={{
            transform: `rotate(${(360 / mesa.seats) * i}deg) translateY(-36px)`
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      className={`absolute transition-all duration-75 ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{
        left: mesa.x,
        top: mesa.y,
        transform: `rotate(${mesa.rotation}deg) scale(${mesa.scale})`,
        zIndex: 10
      }}
      onPointerDown={onPointerDown}
    >
      {isEditing ? (
        tableContent
      ) : (
        <Popover.Root>
          <Popover.Trigger>
            <button className="outline-none focus:ring-2 focus:ring-violet-500 rounded-full">
              {tableContent}
            </button>
          </Popover.Trigger>
          <Popover.Content size="1" style={{ width: 200 }}>
            <Flex direction="column" gap="2">
              <Text size="2" weight="bold" mb="1">{mesa.nombre} - Invitados</Text>
              <Separator size="4" />
              
              {tableGuests.length === 0 ? (
                <Text size="1" color="gray" italic align="center" my="2">
                  No hay invitados en esta mesa
                </Text>
              ) : (
                <Flex direction="column" gap="1" mt="1">
                  {tableGuests.map(guest => (
                    <Flex key={guest.id} justify="between" align="center" p="1" className="hover:bg-gray-50 rounded">
                      <Text size="1" truncate style={{ maxWidth: 140 }}>{guest.nombre}</Text>
                      <IconButton 
                        size="1" 
                        variant="ghost" 
                        color="red" 
                        onClick={() => assignMesa(guest.id, 'none')}
                        title="Quitar de la mesa"
                      >
                        <UserMinus size={12} />
                      </IconButton>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )}
    </div>
  );
}
