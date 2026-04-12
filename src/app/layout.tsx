import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { GlobalNotificationAlert } from "@/components/GlobalNotificationAlert";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Eventos",
  description: "Plataforma de gestión de salones y eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme
          accentColor="violet"
          grayColor="slate"
          radius="medium"
          scaling="100%"
          appearance="light"
        >
          <GlobalNotificationAlert />
          <ImpersonationBanner />
          {children}
        </Theme>
      </body>
    </html>
  );
}
