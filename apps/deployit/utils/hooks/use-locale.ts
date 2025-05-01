import type { LanguageCode } from "@/lib/languages";
import Cookies from "js-cookie";

export default function useLocale() {
	const currentLocale = (Cookies.get("deployit_LOCALE") ?? "en") as LanguageCode;

	const setLocale = (locale: LanguageCode) => {
		Cookies.set("deployit_LOCALE", locale, { expires: 365 });
		window.location.reload();
	};

	return {
		locale: currentLocale,
		setLocale,
	};
}
