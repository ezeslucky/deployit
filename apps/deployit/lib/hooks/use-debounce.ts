/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	//@ts-expect-error
	const timeoutRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return ((...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		return new Promise<ReturnType<T>>((resolve) => {
			timeoutRef.current = setTimeout(() => {
				resolve(callback(...args));
			}, delay);
		});
	}) as T;
}
