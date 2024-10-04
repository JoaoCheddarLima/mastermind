import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASTERMIND",
  description: "Empower your memory with the full power of flashcards and AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
