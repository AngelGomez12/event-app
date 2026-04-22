"use client";

import { useNotificationStore } from "@/store/useNotificationStore";
import { Box, Callout } from "@radix-ui/themes";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useEffect } from "react";

export function GlobalNotificationAlert() {
  const { activeNotifications, fetchActiveNotifications } =
    useNotificationStore();

  useEffect(() => {
    fetchActiveNotifications();
    // Refresh cada 5 minutos
    const interval = setInterval(fetchActiveNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchActiveNotifications]);

  if (activeNotifications.length === 0) return null;

  return (
    <Box className="w-full">
      {activeNotifications.map((n) => (
        <Callout.Root
          key={n.id}
          size="2"
          variant="soft"
          color={
            n.type === "info"
              ? "blue"
              : n.type === "warning"
                ? "orange"
                : n.type === "success"
                  ? "green"
                  : "red"
          }
          className="rounded-none flex justify-center items-center py-3"
          style={{ borderRadius: 0 }}
        >
          <Callout.Icon>
            {n.type === "info" && <Info size={18} />}
            {n.type === "warning" && <AlertTriangle size={18} />}
            {n.type === "success" && <CheckCircle size={18} />}
            {n.type === "error" && <AlertCircle size={18} />}
          </Callout.Icon>
          <Callout.Text>
            <strong className="font-semibold tracking-tight">{n.title}:</strong>{" "}
            {n.message}
          </Callout.Text>
        </Callout.Root>
      ))}
    </Box>
  );
}
