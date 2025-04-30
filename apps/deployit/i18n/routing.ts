/* eslint-disable @typescript-eslint/ban-ts-comment */
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";
//@ts-expect-error
import { createSharedPathnamesNavigation } from "next-intl/navigation";

// Define routing configuration
export const routing = defineRouting({
  locales: ["en", "fr", "zh-Hans"], // Supported locales
  defaultLocale: "en",              // Default locale fallback
  localePrefix: "as-needed",        // Optional prefix based on default locale
});

// Export Next.js-compatible navigation helpers
export const {
  Link,
  redirect,
  usePathname,
  useRouter
} = createSharedPathnamesNavigation({ routing });
