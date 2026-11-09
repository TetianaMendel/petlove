
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import StoreProvider from "@/lib/store/StoreProvider";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-family",
});

export const metadata: Metadata = {
  title: "PetLove",
  description: "Find your favorite pet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <StoreProvider>
          <TanStackProvider>
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" />
          </TanStackProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
