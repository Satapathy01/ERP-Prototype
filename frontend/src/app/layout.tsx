import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "~/components/ui/tooltip";
import { ThemeProvider } from "~/providers/theme-provider";
import { ToasterProvider } from "~/providers/toast-provider";
import ReactQueryProvider from "~/providers/react-query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "School ERP",
  description: "School management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>

            <ToasterProvider />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}