

/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
    // @ts-ignore
    // staticPageGenerationTimeout: 180,  // default 60 seconds
  },
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	transpilePackages: ["@deployi/server"],
	/**
	 * If you are using `appDir` then you must comment the below `i18n` config out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
};

export default nextConfig;