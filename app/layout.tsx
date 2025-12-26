import type { Metadata } from "next";
import { Jost } from 'next/font/google'
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ['latin']
})


export const metadata: Metadata = {
  title: "Nike",
  description: "E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.className} antialiased bg-[var(--color-light-100)] text-[color:var(--color-dark-900)]`}
      >
        {children}
      </body>
    </html>
  );
}
