import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Imperial",
  description: "good script idk",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <Navbar />
        {children}
        <script src="https://checkout.komerza.com/embed/embed.iife.js" defer></script>
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener("DOMContentLoaded",()=>{Komerza.init()})` }} />
      </body>
    </html>
  );
}