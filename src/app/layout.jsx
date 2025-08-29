import Header from "./components/Header";
import Footer from "./components/Footer";
import FrameNav from "./components/FrameNav";
import SiteChrome from "./components/SiteChrome";
import "./globals.css";  // ✅ global styles here

import { Cormorant_Garamond } from "next/font/google";
import { Cormorant_Unicase } from "next/font/google";

const cormorantUni = Cormorant_Unicase({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
      <body>
         <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
