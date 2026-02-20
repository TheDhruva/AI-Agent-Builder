import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from "./ConvexClientProvider";
// 1. Rename Radix Provider to avoid naming conflicts
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip"; 
// 2. IMPORT THE DATA PROVIDER (Make sure this points to your Logic file)
import DbUserProvider from "./provider"; 

export const metadata: Metadata = {
  title: "AI Agent Builder",
  description: "WEB APP To Build AI Agent",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <ConvexClientProvider>
            {/* 3. Wrap EVERYTHING in your Data Provider */}
            <DbUserProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </DbUserProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}