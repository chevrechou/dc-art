"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return (
    <>
      {showHeader && <Header />}
      <main style={showHeader ? { paddingTop: "0px" } : undefined}>
        {children}
      </main>
    </>
  );
}
