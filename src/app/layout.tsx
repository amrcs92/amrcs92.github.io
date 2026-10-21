import type { ReactNode } from "react";
import "./globals.css";

// <html> lives in app/[locale]/layout.tsx so each locale sets its own lang and dir.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
