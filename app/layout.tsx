import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

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
        <header>
          <h1>Hello PetLove</h1>
        </header>

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
