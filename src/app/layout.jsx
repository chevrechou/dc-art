import Header from "./components/Header";
import Footer from "./components/Footer";
import FrameNav from "./components/FrameNav";
import SiteChrome from "./components/SiteChrome";

export const metadata = {
  title: "Derek Calkins Tattoo Portfolio",
  description: "Portfolio of tattoo artist Derek Calkins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
         <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
