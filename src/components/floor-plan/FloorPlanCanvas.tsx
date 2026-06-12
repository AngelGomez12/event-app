"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  MousePointer2, 
  Eraser, 
  Square, 
  Type, 
  RotateCw, 
  Check,
  X,
  LayoutGrid,
  Users,
  Lock,
  CircleDot
} from 'lucide-react';
import { useFloorPlanStore } from '@/store/useFloorPlanStore';
import { useGuestStore, Mesa } from '@/store/useGuestStore';
import { useEventStore } from '@/store/useEventStore';
import { Button, Flex, Text } from '@radix-ui/themes';
import Cookies from 'js-cookie';
import { Role } from '@/lib/api';

import { FloorPlanTable } from './FloorPlanTable';

export default function FloorPlanCanvas() {
  const { myEvent } = useEventStore();
  const { mesas, fetchMesas, setMesas, invitados, addMesa, updateMesa } = useGuestStore();
  const { 
    elements, 
    fetchElements, 
    addElement, 
    updateElement, 
    removeElement, 
    saveTablePositions,
    isEditing,
    setIsEditing,
    setElements
  } = useFloorPlanStore();
  
  const [activeTool, setActiveTool] = useState('cursor');
  const [selectedSeats, setSelectedSeats] = useState(8);
  const [dragState, setDragState] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Identify role from cookie
  const userRole = Cookies.get('userRole');
  const isSalonAdmin = userRole === Role.ADMIN_SALON || userRole === Role.SUPER_ADMIN; 

  // Force isEditing to false if not admin
  useEffect(() => {
    if (!isSalonAdmin && isEditing) {
      setIsEditing(false);
    }
  }, [isSalonAdmin, isEditing, setIsEditing]);

  useEffect(() => {
    if (myEvent) {
      fetchMesas(myEvent.id);
      fetchElements(myEvent.id);
    }
  }, [myEvent, fetchMesas, fetchElements]);

  const handleSave = async () => {
    if (!myEvent) return;
    try {
      await saveTablePositions(myEvent.id, mesas);
      setToastMessage('¡Plano guardado exitosamente!');
    } catch (error) {
      setToastMessage('Error al guardar el plano.');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isEditing || !myEvent || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'add-table' && myEvent) {
      const tableCount = mesas.length + 1;
      addMesa(myEvent.id, {
        nombre: `Mesa ${tableCount}`,
        x,
        y,
        type: 'round',
        seats: selectedSeats,
        color: '#ffffff',
        rotation: 0,
        scale: 1.0,
        isStructural: false
      });
      setActiveTool('cursor');
    } else if (activeTool === 'add-divider' && isSalonAdmin) {
      addElement(myEvent.id, {
        type: 'divider',
        x,
        y,
        width: 100,
        height: 20,
        rotation: 0,
        color: '#3b82f6',
        order: elements.length,
        isStructural: true
      });
      setActiveTool('cursor');
    } else if (activeTool === 'add-text') {
      addElement(myEvent.id, {
        type: 'text',
        x,
        y,
        content: 'Nuevo Texto',
        width: 120,
        height: 40,
        rotation: 0,
        color: '#1f2937',
        order: elements.length,
        isStructural: false
      });
      setActiveTool('cursor');
    }
  };

  const handlePointerDownElement = (e: React.PointerEvent, id: string, type: 'table' | 'element') => {
    if (!isEditing) return;
    e.stopPropagation();
    
    const target = type === 'table' 
      ? mesas.find(m => m.id === id) 
      : elements.find(el => el.id === id);
    
    if (!target) return;

    if (target.isStructural && !isSalonAdmin) {
      setToastMessage('Este elemento es estructural y no puede modificarse.');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    if (activeTool === 'eraser') {
      if (type === 'element' && myEvent) {
        removeElement(myEvent.id, id);
      }
      return;
    }

    if (activeTool === 'rotate') {
      if (type === 'table') {
        const newMesas = mesas.map(m => 
          m.id === id ? { ...m, rotation: (m.rotation || 0) + 45 } : m
        );
        setMesas(newMesas);
      } else if (type === 'element' && myEvent) {
        updateElement(myEvent.id, id, { rotation: (target.rotation || 0) + 45 });
      }
      return;
    }

    if (activeTool === 'seats' && type === 'table' && myEvent) {
        updateMesa(myEvent.id, id, { seats: selectedSeats });
        return;
    }

    if (activeTool === 'cursor') {
      setDragState({
        type,
        id,
        startX: e.clientX,
        startY: e.clientY,
        origX: target.x,
        origY: target.y
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState || !isEditing) return;
    
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    if (dragState.type === 'table') {
      const newMesas = mesas.map(m => 
        m.id === dragState.id ? { ...m, x: dragState.origX + dx, y: dragState.origY + dy } : m
      );
      setMesas(newMesas);
    } else if (dragState.type === 'element') {
      const newElements = elements.map(el => 
        el.id === dragState.id ? { ...el, x: dragState.origX + dx, y: dragState.origY + dy } : el
      );
      setElements(newElements);
    }
  };

  const handlePointerUp = () => {
    setDragState(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <Flex gap="2">
          <Button 
            variant={!isEditing ? "solid" : "soft"} 
            onClick={() => setIsEditing(false)}
            color="violet"
          >
            <Users size={16} /> Asignación
          </Button>
          {isSalonAdmin && (
            <Button 
              variant={isEditing ? "solid" : "soft"} 
              onClick={() => setIsEditing(true)}
              color="orange"
            >
              <LayoutGrid size={16} /> Diseño
            </Button>
          )}
        </Flex>

        {isEditing && (
          <Flex gap="2">
            <Button color="green" onClick={handleSave}>
              <Check size={16} /> Guardar Cambios
            </Button>
            <Button color="gray" variant="soft" onClick={() => fetchElements(myEvent!.id)}>
              <X size={16} /> Descartar
            </Button>
          </Flex>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {isEditing && (
          <aside className="w-20 bg-gray-50 border-r flex flex-col items-center py-4 gap-4 overflow-y-auto">
            <ToolButton 
              icon={<MousePointer2 size={20} />} 
              label="Mover" 
              isActive={activeTool === 'cursor'} 
              onClick={() => setActiveTool('cursor')} 
            />
            <ToolButton 
              icon={<CircleDot size={20} className="text-green-600" />} 
              label="Mesa" 
              isActive={activeTool === 'add-table'} 
              onClick={() => setActiveTool('add-table')} 
            />
            {isSalonAdmin && (
              <ToolButton 
                icon={<Square size={20} />} 
                label="Divisor" 
                isActive={activeTool === 'add-divider'} 
                onClick={() => setActiveTool('add-divider')} 
              />
            )}
            <ToolButton 
              icon={<Type size={20} />} 
              label="Texto" 
              isActive={activeTool === 'add-text'} 
              onClick={() => setActiveTool('add-text')} 
            />
            <ToolButton 
              icon={<RotateCw size={20} />} 
              label="Rotar" 
              isActive={activeTool === 'rotate'} 
              onClick={() => setActiveTool('rotate')} 
            />
            <div className="flex flex-col items-center gap-1">
                <ToolButton 
                    icon={<Users size={20} className="text-purple-600" />} 
                    label="Asientos" 
                    isActive={activeTool === 'seats'} 
                    onClick={() => setActiveTool('seats')} 
                />
                {activeTool === 'seats' && (
                    <input 
                        type="number" 
                        min="1"
                        max="20"
                        value={selectedSeats}
                        onChange={(e) => setSelectedSeats(parseInt(e.target.value) || 1)}
                        className="w-12 text-center text-xs border rounded bg-white"
                    />
                )}
            </div>
            <ToolButton 
              icon={<Eraser size={20} />} 
              label="Borrar" 
              isActive={activeTool === 'eraser'} 
              onClick={() => setActiveTool('eraser')} 
            />
          </aside>
        )}

        <main 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden touch-none"
          style={{
            backgroundColor: '#e6dfce',
            backgroundImage: 'radial-gradient(#c4ba9c 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
          onClick={handleCanvasClick}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {mesas.map(mesa => (
            <FloorPlanTable 
              key={mesa.id}
              mesa={mesa}
              invitados={invitados}
              isEditing={isEditing}
              isSalonAdmin={isSalonAdmin}
              onPointerDown={(e) => handlePointerDownElement(e, mesa.id, 'table')}
            />
          ))}

          {elements.map(el => (
            <div
              key={el.id}
              className={`absolute ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg)`,
                backgroundColor: el.color,
                zIndex: el.order,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: el.type === 'shape' ? '50%' : '2px'
              }}
              onPointerDown={(e) => handlePointerDownElement(e, el.id, 'element')}
            >
              {el.type === 'text' ? (
                <input 
                    type="text" 
                    value={el.content || ''} 
                    onChange={(e) => {
                      if (myEvent) updateElement(myEvent.id, el.id, { content: e.target.value });
                    }} 
                    className="bg-transparent text-center font-bold outline-none border-none w-full text-white placeholder-white/50"
                    placeholder="Texto"
                    onClick={(e) => e.stopPropagation()}
                />
              ) : (
                el.isStructural && <Lock size={12} className="absolute top-1 right-1 text-black/30" />
              )}
            </div>
          ))}

          {toastMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50">
              {toastMessage}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ToolButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded w-14 transition-colors ${isActive ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200'}`}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}
