'use client';

import { useEventStore } from '@/store/useEventStore';
import { useEffect, useState } from 'react';
import { Card, Heading, Text, Flex, Box } from '@radix-ui/themes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CalendarPage() {
  const { eventos, fetchEventos } = useEventStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => { fetchEventos(); }, [fetchEventos]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const allCells = [...Array(startDayOfWeek).fill(null), ...daysInMonth];

  return (
    <Flex direction="column" gap="6">
      <Flex justify="between" align="center">
        <Flex direction="column" gap="1">
          <Heading size="7" weight="bold">Calendario de Eventos</Heading>
          <Text size="2" color="gray">Visualizá todos los eventos del mes</Text>
        </Flex>
        <Flex align="center" gap="3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            style={{ background: 'var(--gray-3)', border: 'none', borderRadius: 'var(--radius-2)', padding: '6px 8px', cursor: 'pointer' }}
            className="hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <Text size="4" weight="bold" style={{ textTransform: 'capitalize', minWidth: 160, textAlign: 'center' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </Text>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            style={{ background: 'var(--gray-3)', border: 'none', borderRadius: 'var(--radius-2)', padding: '6px 8px', cursor: 'pointer' }}
            className="hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </Flex>
      </Flex>

      <Card size="3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
            <Text key={d} size="1" weight="bold" color="gray" style={{ padding: '6px 0', textTransform: 'uppercase' }}>
              {d}
            </Text>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {allCells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} style={{ minHeight: 100 }} />;

            const dayEvents = eventos.filter(e => isSameDay(new Date(e.fecha), day));
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                style={{
                  minHeight: 100,
                  borderRadius: 'var(--radius-3)',
                  border: '1px solid var(--gray-4)',
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  background: isToday ? 'var(--violet-2)' : isCurrentMonth ? 'white' : 'var(--gray-1)',
                  borderColor: isToday ? 'var(--violet-6)' : 'var(--gray-4)',
                  opacity: isCurrentMonth ? 1 : 0.4,
                }}
              >
                <Flex justify="start" mb="1">
                  <Box style={{
                    width: 26, height: 26,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '50%',
                    background: isToday ? 'var(--violet-9)' : 'transparent',
                  }}>
                    <Text size="1" weight={isToday ? 'bold' : 'regular'}
                      style={{ color: isToday ? 'white' : 'var(--gray-11)' }}>
                      {format(day, 'd')}
                    </Text>
                  </Box>
                </Flex>

                <Flex direction="column" gap="1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      title={event.nombre_agasajado}
                      style={{
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-1)',
                        background: event.tipo === 'boda' ? 'var(--pink-3)' : 'var(--violet-3)',
                        color: event.tipo === 'boda' ? 'var(--pink-11)' : 'var(--violet-11)',
                        fontSize: 11,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}
                    >
                      {event.nombre_agasajado}
                    </div>
                  ))}
                </Flex>
              </div>
            );
          })}
        </div>
      </Card>
    </Flex>
  );
}
