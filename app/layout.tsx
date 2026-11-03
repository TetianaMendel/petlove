import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";

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
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${manrope.variable}`}>
        <Header />

        <main>{children}</main>

        <footer>
          <p>
            Created <time dateTime='2026'>2026</time>
          </p>
        </footer>
      </body>
    </html>
  );
};
