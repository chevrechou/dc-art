// app/components/SeoSchema.tsx
import React from "react";

export default function SeoSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Derek Calkins",
    jobTitle: "Tattoo Artist",
    address: {
      "@type": "PostalAddress",
      streetAddress: "6910 South Rainbow Boulevard Unit 107",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      postalCode: "89118",
      addressCountry: "US"
    },
    url: "https://dcartstudio.com",
    sameAs: [
      "https://www.instagram.com/dc_art_collective/",
      "https://michael585.substack.com/"
    ]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
