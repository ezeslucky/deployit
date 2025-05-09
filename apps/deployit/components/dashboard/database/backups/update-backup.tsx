import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDown, PenBoxIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateBackupSchema = z.object({
	destinationId: z.string().min(1, "Destination required"),
	schedule: z.string().min(1, "Schedule (Cron) required"),
	prefix: z.string().min(1, "Prefix required"),
	enabled: z.boolean(),
	database: z.string().min(1, "Database required"),
	keepLatestCount: z.coerce.number().optional(),
});

type UpdateBackup = z.infer<typeof UpdateBackupSchema>;

interface Props {
	backupId: string;
	refetch: () => void;
}

export const UpdateBackup = ({ backupId, refetch }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data, isLoading } = api.destination.all.useQuery();
	const { data: backup } = api.backup.one.useQuery(
		{
			backupId,
		},
		{
			enabled: !!backupId,
		},
	);

	const { mutateAsync, isLoading: isLoadingUpdate } =
		api.backup.update.useMutation();

	const form = useForm<UpdateBackup>({
		defaultValues: {
			database: "",
			destinationId: "",
			enabled: true,
			prefix: "/",
			schedule: "",
			keepLatestCount: undefined,
		},
		resolver: zodResolver(UpdateBackupSchema),
	});

	useEffect(() => {
		if (backup) {
			form.reset({
				database: backup.database,
				destinationId: backup.destinationId,
				enabled: backup.enabled || false,
				prefix: backup.prefix,
				schedule: backup.schedule,
				keepLatestCount: backup.keepLatestCount
					? Number(backup.keepLatestCount)
					: undefined,
			});
		}
	}, [form, form.reset, backup]);

	const onSubmit = async (data: UpdateBackup) => {
		await mutateAsync({
			backupId,
			destinationId: data.destinationId,
			prefix: data.prefix,
			schedule: data.schedule,
			enabled: data.enabled,
			database: data.database,
			keepLatestCount: data.keepLatestCount as number | null,
		})
			.then(async () => {
				toast.success("Backup Updated");
				refetch();
				setIsOpen(false);
			})
			.catch(() => {
				toast.error("Error updating the Backup");
			});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="group hover:bg-blue-500/10 "
				>
					<PenBoxIcon className="size-3.5  text-primary group-hover:text-blue-500" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen  overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Update Backup</DialogTitle>
					<DialogDescription>Update the backup</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						id="hook-form-update-backup"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid w-full gap-4"
					>
						<div className="grid grid-cols-1 gap-4">
							<FormField
								control={form.control}
								name="destinationId"
								render={({ field }) => (
									<FormItem className="">
										<FormLabel>Destination</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full justify-between !bg-input",
															!field.value && "text-muted-foreground",
														)}
													>
														{isLoading
															? "Loading...."
															: field.value
																? data?.find(
																		(destination) =>
																			destination.destinationId === field.value,
																	)?.name
																: "Select Destination"}

														<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="p-0" align="start">
												<Command>
													<CommandInput
														placeholder="Search Destination..."
														className="h-9"
													/>
													{isLoading && (
														<span className="py-6 text-center text-sm">
															Loading Destinations....
														</span>
													)}
													<CommandEmpty>No destinations found.</CommandEmpty>
													<ScrollArea className="h-64">
														<CommandGroup>
															{data?.map((destination) => (
																<CommandItem
																	value={destination.destinationId}
																	key={destination.destinationId}
																	onSelect={() => {
																		form.setValue(
																			"destinationId",
																			destination.destinationId,
																		);
																	}}
																>
																	{destination.name}
																	<CheckIcon
																		className={cn(
																			"ml-auto h-4 w-4",
																			destination.destinationId === field.value
																				? "opacity-100"
																				: "opacity-0",
																		)}
																	/>
																</CommandItem>
															))}
														</CommandGroup>
													</ScrollArea>
												</Command>
											</PopoverContent>
										</Popover>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="database"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Database</FormLabel>
											<FormControl>
												<Input placeholder={"deployit"} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="schedule"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Schedule (Cron)</FormLabel>
											<FormControl>
												<Input placeholder={"0 0 * * *"} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="prefix"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Prefix Destination</FormLabel>
											<FormControl>
												<Input placeholder={"deployit/"} {...field} />
											</FormControl>
											<FormDescription>
												Use if you want to back up in a specific path of your
												destination/bucket
											</FormDescription>

											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="keepLatestCount"
								render={({ field }) => {
									return (
										<FormItem>
											<FormLabel>Keep the latest</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder={"keeps all the backups if left empty"}
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Optional. If provided, only keeps the latest N backups
												in the cloud.
											</FormDescription>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								control={form.control}
								name="enabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 ">
										<div className="space-y-0.5">
											<FormLabel>Enabled</FormLabel>
											<FormDescription>
												Enable or disable the backup
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button
								isLoading={isLoadingUpdate}
								form="hook-form-update-backup"
								type="submit"
							>
								Update
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
