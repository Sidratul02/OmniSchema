import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "OmniSchema — Visual Database Schema Builder",
  description: "Build, visualize, and export database schemas for PostgreSQL, MySQL, Prisma, Drizzle, and more."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f172a",
              color: "white",
              border: "1px solid #1f2937",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "10px"
            },
            success: {
              iconTheme: { primary: "#2563eb", secondary: "white" }
            },
            error: {
              iconTheme: { primary: "#dc2626", secondary: "white" }
            }
          }}
        />
        {children}
      </body>
    </html>
  );
}
