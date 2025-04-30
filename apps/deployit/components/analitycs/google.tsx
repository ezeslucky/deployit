/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect } from "react";
import initializeGA from ".";

export default function GoogleAnalytics() {
	useEffect(() => {
		// @ts-expect-error
		if (!window.GA_INITIALIZED) {
			initializeGA();
			// @ts-expect-error
			window.GA_INITIALIZED = true;
		}
	}, []);

	return null;
}
