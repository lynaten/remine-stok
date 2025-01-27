import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Navbar } from "@/app/_components/navbar";
import { api } from "@/trpc/server";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Remine Stock",
  description: "Stok produk remine",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  try {
    await api.user.me();
    return (
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="max-w-screen max-h-screen">
          <TRPCReactProvider>
            <Navbar></Navbar>
            {children}
          </TRPCReactProvider>
        </body>
      </html>
    );
  } catch {
    return (
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="max-w-screen max-h-screen">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    );
  }
}
