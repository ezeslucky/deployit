import { cn } from "@/lib/utils";
import Link from "next/link";
import type React from "react";
import { GithubIcon } from "../icons/data-tools-icons";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";

interface Props {
	children: React.ReactNode;
}
export const OnboardingLayout = ({ children }: Props) => {
	return (
		<div className="container relative min-h-svh flex-col items-center justify-center flex lg:max-w-none lg:grid lg:grid-cols-2 lg:px-0 w-full">
			<div className="relative hidden h-full flex-col  p-10 text-primary dark:border-r lg:flex">
				<div className="absolute inset-0 bg-muted" />
				<Link
					href="https://deployi.me/"
					className="relative z-20 flex items-center text-lg font-medium gap-4  text-primary"
				>
					<Logo className="size-10" />
					Deployi
				</Link>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg text-primary">
							&ldquo;Deployi is your all-in-one platform to deploy, manage, and
							scale any kind of application effortlessly. Whether you're
							deploying a simple web app or a complex microservices
							architecture, Deployi handles it all with speed, security, and
							flexibility.&rdquo;
						</p>
					</blockquote>
				</div>
			</div>
			<div className="w-full">
				<div className="flex w-full flex-col justify-center space-y-6 max-w-lg mx-auto">
					{children}
				</div>
				<div className="flex items-center gap-4 justify-center absolute bottom-4 right-4 text-muted-foreground">
					<Button variant="ghost" size="icon">
						<Link href="https://github.com/ezeslucky/deployi">
							<GithubIcon />
						</Link>
					</Button>
					<Button variant="ghost" size="icon">
						<Link
							href="https://x.com/ezeslucky
"
						>
							<svg
								stroke="currentColor"
								fill="currentColor"
								strokeWidth="0"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								className="size-5"
							>
								<path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z" />
							</svg>
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
