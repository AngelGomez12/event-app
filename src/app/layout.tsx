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
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Eventos | Gestión de Salones",
  description: "Plataforma de gestión de salones y eventos con enfoque en la experiencia del organizador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-violet-100 selection:text-violet-900`}
      >
        <Theme
          accentColor="violet"
          grayColor="slate"
          radius="large"
          scaling="100%"
          appearance="light"
        >
          <div className="min-h-screen flex flex-col">
            <GlobalNotificationAlert />
            <ImpersonationBanner />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </Theme>
      </body>
    </html>
  );
}
