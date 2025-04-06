import clsx from "clsx";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter, Lexend } from "next/font/google";
import type { ReactNode } from "react";
type Props = {
	children: ReactNode;
};


const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const lexend = Lexend({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lexend",
});

export default async function RootLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { locale: string };
}) {
	const { locale } = params;
	const messages = await getMessages();
	return (
		<html
			lang={locale}
			className={clsx(
				"h-full scroll-smooth antialiased",
				inter.variable,
				lexend.variable,
			)}
		>
			<body>
				<NextIntlClientProvider messages={messages}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
