import type { LanguageCode } from "@/lib/languages";
import Cookies from "js-cookie";

export default function useLocale() {
	const currentLocale = (Cookies.get("DEPLOYI_LOCALE") ?? "en") as LanguageCode;

	const setLocale = (locale: LanguageCode) => {
		Cookies.set("DEPLOYI_LOCALE", locale, { expires: 365 });
		window.location.reload();
	};

	return {
		locale: currentLocale,
		setLocale,
	};
}
