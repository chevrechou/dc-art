import UpcomingClient from "./UpcomingClient";

export const metadata = {
	title: "Upcoming Events | Derek Calkins",
	description:
		"See Derek Calkins’ upcoming tattoo conventions, expos, and guest spots. Find dates and locations, then book a session or meet in person.",
	alternates: { canonical: "/upcoming" },
	openGraph: {
		title: "Upcoming Events | Derek Calkins",
		description:
			"Conventions, expos, and guest spots. See where Derek will be tattooing next and how to book.",
		url: "https://www.derekcalkinstattoo.com/upcoming",
		siteName: "Derek Calkins",
		type: "website",
		locale: "en_US",
		images: [
			{
				url: "/og/upcoming-og.jpg",
				width: 1200,
				height: 630,
				alt: "Collage of Derek Calkins tattoos with Upcoming Events text",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Upcoming Events | Derek Calkins",
		description:
			"Conventions, expos, and guest spots. See where Derek will be tattooing next.",
		images: ["/og/upcoming-og.jpg"],
		creator: "@dc_art_collective",
	},
};

export default function UpcomingPage() {
	return <UpcomingClient />;
}
