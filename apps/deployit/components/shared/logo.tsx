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
    fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><path d="M4.207 13.207l1.586 1.586c.391.391 1.024.391 1.414 0L17.805 4.195C18.246 3.754 17.934 3 17.31 3h-3.896c-.265 0-.52.105-.707.293l-8.5 8.5C3.817 12.183 3.817 12.817 4.207 13.207zM17.31 12h-3.896c-.265 0-.52.105-.707.293l-4 4c-.391.391-.391 1.024 0 1.414l4 4C12.895 21.895 13.149 22 13.414 22h3.896c.624 0 .936-.754.495-1.195l-3.098-3.098c-.391-.391-.391-1.024 0-1.414l3.098-3.098C18.246 12.754 17.934 12 17.31 12z"/></svg>
	);
};
