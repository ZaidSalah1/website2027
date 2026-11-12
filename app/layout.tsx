import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zaid — Full-Stack Product Engineer",
  description: "Full-stack engineer building reliable, useful digital products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
