import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ClerkProvider } from "@clerk/nextjs";

//TODO: Outer layer of the layout which has all the providers etc

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
