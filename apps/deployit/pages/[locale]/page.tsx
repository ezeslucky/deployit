
import { Faqs } from "@/components/Faqs";
import { Hero } from "@/components/Hero";

import { FirstFeaturesSection } from "@/components/first-features";

import { SecondaryFeaturesSections } from "@/components/secondary-features";

import { StatsSection } from "@/components/stats";
import { setRequestLocale } from "next-intl/server";

export default async function Home({ params }: { params: { locale: string } }) {
	const { locale } = await params;
	setRequestLocale(locale);
	return (
		<div>
			<main>
				<Hero />
				<FirstFeaturesSection />
				<SecondaryFeaturesSections />
				<StatsSection />
				
				
				<Faqs />
				
			</main>
		</div>
	);
}
