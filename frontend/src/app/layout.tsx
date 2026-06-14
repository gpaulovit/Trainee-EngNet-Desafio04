import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zilla University - Gestão de Presença",
  description: "Sistema de frequência para aulas laboratoriais - EngNet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${merriweather.variable}`}
    >
      <body className="font-sans antialiased min-h-screen transition-colors duration-300 relative">
        <div
          className="pointer-events-none fixed inset-0 z-[-1] opacity-50 dark:opacity-55"
          style={{
            backgroundImage: "url('/logofundo.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
