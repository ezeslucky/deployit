import type { LanguageCode } from "@/lib/languages";
import Cookies from "js-cookie";

export default function useLocale(){
    const currentLocale = (Cookies.get("DEPLOYIT_LOCALE") ?? "en") as LanguageCode


    const setLocale = (locale: LanguageCode) => {
        Cookies.set("DEPLOYIT_LOCALE", locale , {
            exprires:365
        })
        window.location.reload()
    }

    return {
        locale: currentLocale,
        setLocale,
    }
}