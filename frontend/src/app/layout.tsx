import type { ReactNode } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <html lang="en">
      <body>
          <Toaster />
        {children}
      </body>
    </html>
  );
}