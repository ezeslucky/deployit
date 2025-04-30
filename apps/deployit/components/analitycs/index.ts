"use client";

import ReactGA from "react-ga4";

const initializeGA = () => {
	
	ReactGA.initialize("G-0RTZ5EPB26");

	
};

interface Props {
	category: string;
	action: string;
	label: string;
}
const trackGAEvent = ({ category, action, label }: Props) => {
	console.log("GA event:", category, ":", action, ":", label);
	// Send GA4 Event
	ReactGA.event({
		category: category,
		action: action,
		label: label,
	});
};

export default initializeGA;
export { initializeGA, trackGAEvent };
