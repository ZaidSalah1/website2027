import type { Metadata } from "next";
import "./globals.css";
import "../styles/themes.css";
import { DEFAULT_THEME } from "../lib/theme";

export const metadata: Metadata = {
  title: "Zaid — Full-Stack Product Engineer",
  description: "Full-stack engineer building reliable, useful digital products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
