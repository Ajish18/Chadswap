import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "ChadSwap",
  description: "Trade Solana tokens fast and free",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          margin: 0,
          padding: 0,
        }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}