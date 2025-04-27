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
		<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 559 446"
		className={className}
	  >
		{/* <!-- Outer shape of the D --> */}
		<path
		  className="fill-primary stroke-primary"
		  d="M84 22 H279 V424 H84 C84 424 28 424 28 379 S28 67 84 22 Z"
		/>
		
		{/* <!-- Inner cutout of the D --> */}
		<path
		  className="fill-primary stroke-primary"
		  d="M223 67 H140 C140 67 84 67 84 112 V335 C84 379 140 379 140 379 H223 V67 Z"
		/>
		
		{/* <!-- Diagonal line --> */}
		<path
		  className="fill-primary stroke-primary"
		  d="M84 67 L475 379"
		  fill="none"
		  stroke-width="60"
		/>
		
		{/* <!-- First arrow rectangle --> */}
		<rect
		  className="fill-primary stroke-primary"
		  x="363"
		  y="290"
		  width="112"
		  height="36"
		/>
		
		{/* <!-- Second arrow rectangle --> */}
		<rect
		  className="fill-primary stroke-primary"
		  x="419"
		  y="335"
		  width="56"
		  height="36"
		/>
	  </svg>
		
    )
}