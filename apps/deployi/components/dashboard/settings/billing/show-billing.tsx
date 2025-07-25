import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { NumberInput } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { loadStripe } from "@stripe/stripe-js";
import clsx from "clsx";
import {
	AlertTriangle,
	CheckIcon,
	CreditCard,
	Loader2,
	MinusIcon,
	PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export const calculatePrice = (count: number, isAnnual = false) => {
	if (isAnnual) {
		if (count <= 1) return 45.9;
		return 35.7 * count;
	}
	if (count <= 1) return 4.5;
	return count * 3.5;
};
export const ShowBilling = () => {
	const { data: servers } = api.server.count.useQuery();
	const { data: admin } = api.user.get.useQuery();
	const { data, isLoading } = api.stripe.getProducts.useQuery();
	const { mutateAsync: createCheckoutSession } =
		api.stripe.createCheckoutSession.useMutation();

	const { mutateAsync: createCustomerPortalSession } =
		api.stripe.createCustomerPortalSession.useMutation();

	const [serverQuantity, setServerQuantity] = useState(3);
	const [isAnnual, setIsAnnual] = useState(false);

	const handleCheckout = async (productId: string) => {
		const stripe = await stripePromise;
		if (data && data.subscriptions.length === 0) {
			createCheckoutSession({
				productId,
				serverQuantity: serverQuantity,
				isAnnual,
			}).then(async (session) => {
				await stripe?.redirectToCheckout({
					sessionId: session.sessionId,
				});
			});
		}
	};
	const products = data?.products.filter((product) => {
		// @ts-ignore
		const interval = product?.default_price?.recurring?.interval;
		return isAnnual ? interval === "year" : interval === "month";
	});

	const maxServers = admin?.user.serversQuantity ?? 1;
	const percentage = ((servers ?? 0) / maxServers) * 100;
	const safePercentage = Math.min(percentage, 100);

	return (
		<div className="w-full">
			<Card className="h-full bg-sidebar  p-2.5 rounded-xl  max-w-5xl mx-auto">
				<div className="rounded-xl bg-background shadow-md ">
					<CardHeader className="">
						<CardTitle className="text-xl flex flex-row gap-2">
							<CreditCard className="size-6 text-muted-foreground self-center" />
							Billing
						</CardTitle>
						<CardDescription>Manage your subscription</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2 py-8 border-t">
						<div className="flex flex-col gap-4 w-full">
							<Tabs
								defaultValue="monthly"
								value={isAnnual ? "annual" : "monthly"}
								className="w-full"
								onValueChange={(e) => setIsAnnual(e === "annual")}
							>
								<TabsList>
									<TabsTrigger value="monthly">Monthly</TabsTrigger>
									<TabsTrigger value="annual">Annual</TabsTrigger>
								</TabsList>
							</Tabs>
							{admin?.user.stripeSubscriptionId && (
								<div className="space-y-2 flex flex-col">
									<h3 className="text-lg font-medium">Servers Plan</h3>
									<p className="text-sm text-muted-foreground">
										You have {servers} server on your plan of{" "}
										{admin?.user.serversQuantity} servers
									</p>
									<div>
										<Progress value={safePercentage} className="max-w-lg" />
									</div>
									{admin && admin.user.serversQuantity! <= (servers ?? 0) && (
										<div className="flex flex-row gap-4 p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg items-center">
											<AlertTriangle className="text-yellow-600 dark:text-yellow-400" />
											<span className="text-sm text-yellow-600 dark:text-yellow-400">
												You have reached the maximum number of servers you can
												create, please upgrade your plan to add more servers.
											</span>
										</div>
									)}
								</div>
							)}
							<div className="flex flex-col gap-1.5 mt-4">
								<span className="text-base text-primary">
									Need Help? We are here to help you.
								</span>
								<span className="text-sm text-muted-foreground">
									Message me on X
								</span>
								<Button className="rounded-full bg-black hover:bg-gray-800 w-fit">
									<Link
										href="https://x.com/ezeslucky"
										aria-label="Deployi on X (Twitter)"
										target="_blank"
										className="flex flex-row items-center gap-2 text-white"
									>
										<svg
											role="img"
											className="h-6 w-6 fill-white"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
										</svg>
										X
									</Link>
								</Button>
							</div>
							{isLoading ? (
								<span className="text-base text-muted-foreground flex flex-row gap-3 items-center justify-center min-h-[10vh]">
									Loading...
									<Loader2 className="animate-spin" />
								</span>
							) : (
								<>
									{products?.map((product) => {
										const featured = true;
										return (
											<div key={product.id}>
												<section
													className={clsx(
														"flex flex-col rounded-3xl  border-dashed border-2 px-4 max-w-sm",
														featured
															? "order-first  border py-8 lg:order-none"
															: "lg:py-8",
													)}
												>
													{isAnnual && (
														<div className="mb-4 flex flex-row items-center gap-2">
															<Badge>Recommended 🚀</Badge>
														</div>
													)}
													{isAnnual ? (
														<div className="flex flex-row gap-2 items-center">
															<p className=" text-2xl font-semibold tracking-tight text-primary ">
																${" "}
																{calculatePrice(
																	serverQuantity,
																	isAnnual,
																).toFixed(2)}{" "}
																USD
															</p>
															|
															<p className=" text-base font-semibold tracking-tight text-muted-foreground">
																${" "}
																{(
																	calculatePrice(serverQuantity, isAnnual) / 12
																).toFixed(2)}{" "}
																/ Month USD
															</p>
														</div>
													) : (
														<p className=" text-2xl font-semibold tracking-tight text-primary ">
															${" "}
															{calculatePrice(serverQuantity, isAnnual).toFixed(
																2,
															)}{" "}
															USD
														</p>
													)}
													<h3 className="mt-5 font-medium text-lg text-primary">
														{product.name}
													</h3>
													<p
														className={clsx(
															"text-sm",
															featured ? "text-white" : "text-slate-400",
														)}
													>
														{product.description}
													</p>

													<ul
														className={clsx(
															" mt-4 flex flex-col gap-y-2 text-sm",
															featured ? "text-white" : "text-slate-200",
														)}
													>
														{[
															"All the features of Deployi",
															"Unlimited deployments",
															"Self-hosted on your own infrastructure",
															"Full access to all deployment features",
															"Deployi integration",
															"Backups",
															"All Incoming features",
														].map((feature) => (
															<li
																key={feature}
																className="flex text-muted-foreground"
															>
																<CheckIcon />
																<span className="ml-4">{feature}</span>
															</li>
														))}
													</ul>
													<div className="flex flex-col gap-2 mt-4">
														<div className="flex items-center gap-2 justify-center">
															<span className="text-sm text-muted-foreground">
																{serverQuantity} Servers
															</span>
														</div>

														<div className="flex items-center space-x-2">
															<Button
																disabled={serverQuantity <= 1}
																variant="outline"
																onClick={() => {
																	if (serverQuantity <= 1) return;

																	setServerQuantity(serverQuantity - 1);
																}}
															>
																<MinusIcon className="h-4 w-4" />
															</Button>
															<NumberInput
																value={serverQuantity}
																onChange={(e) => {
																	setServerQuantity(
																		e.target.value as unknown as number,
																	);
																}}
															/>

															<Button
																variant="outline"
																onClick={() => {
																	setServerQuantity(serverQuantity + 1);
																}}
															>
																<PlusIcon className="h-4 w-4" />
															</Button>
														</div>
														<div
															className={cn(
																data?.subscriptions &&
																	data?.subscriptions?.length > 0
																	? "justify-between"
																	: "justify-end",
																"flex flex-row  items-center gap-2 mt-4",
															)}
														>
															{admin?.user.stripeCustomerId && (
																<Button
																	variant="secondary"
																	className="w-full"
																	onClick={async () => {
																		const session =
																			await createCustomerPortalSession();

																		window.open(session.url);
																	}}
																>
																	Manage Subscription
																</Button>
															)}

															{data?.subscriptions?.length === 0 && (
																<div className="justify-end w-full">
																	<Button
																		className="w-full"
																		onClick={async () => {
																			handleCheckout(product.id);
																		}}
																		disabled={serverQuantity < 1}
																	>
																		Subscribe
																	</Button>
																</div>
															)}
														</div>
													</div>
												</section>
											</div>
										);
									})}
								</>
							)}
						</div>
					</CardContent>
				</div>
			</Card>
		</div>
	);
};
