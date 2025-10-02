import SiteChrome from "./components/SiteChrome";
import "./globals.css";  // ✅ global styles here

import { Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Derek Calkins Tattoo Portfolio",
  description: "Portfolio of tattoo artist Derek Calkins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cormorant.className}>
      <body suppressHydrationWarning>
        <SiteChrome>
          <Analytics />
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
