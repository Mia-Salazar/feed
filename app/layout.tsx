import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "../presentation/organisms/Header";
import { AppProviders } from "../store/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tecnical Test by Mia Salazar",
  description: "Proejct made with Next.js, Redux, TypeScript, and clean architecture.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <AppProviders>

          {children}
        </AppProviders>
      </body>
    </html>
  );
}