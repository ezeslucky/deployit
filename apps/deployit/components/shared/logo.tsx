/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	logoUrl?: string;
}

export const Logo = ({ className = "size-14", logoUrl }: Props) => {
	if (logoUrl) {
		return (
			<img
				src={logoUrl}
				alt="Organization Logo"
				className={cn(className, "object-contain rounded-sm")}
			/>
		);
	}
    return (
		// <?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		  <rect width="200" height="200" fill="#1E1E2F"/>
		  <circle cx="100" cy="100" r="80" fill="#4A90E2"/>
		  <path d="M100,60 L120,100 L100,140 L80,100 Z" fill="#FFFFFF"/>
		  <text x="50%" y="180" font-size="20" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif">DeployIt</text>
		</svg>
		
    )
}