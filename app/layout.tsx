import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Provider } from "@radix-ui/react-tooltip";



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
      <html lang="en">
        <body
          className={outfit.className}
        >
          <ConvexClientProvider>
            <Provider>
              {children}
            </Provider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
