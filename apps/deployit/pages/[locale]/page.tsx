/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import { Faqs } from "@/components/Faqs";
import { Hero } from "@/components/Hero";
import { FirstFeaturesSection } from "@/components/first-features";
import { SecondaryFeaturesSections } from "@/components/secondary-features";
import { StatsSection } from "@/components/stats";
import { setRequestLocale } from "next-intl/server";
import { Sponsors } from "@/components/sponsors";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";
import { Pricing } from "@/components/pricing";

export default async function Home({ params }: { params: { locale: string } }) {
	const { locale } = params;
	setRequestLocale(locale);
	return (
		<div>
			<main>
			<Hero />
				<FirstFeaturesSection />
				<SecondaryFeaturesSections />
				<StatsSection />
				<Testimonials />
				<div className="w-full relative">
					<Pricing />
				</div>
				<Faqs />
				<Sponsors />
				<CallToAction />
			</main>
		</div>
	);
}
