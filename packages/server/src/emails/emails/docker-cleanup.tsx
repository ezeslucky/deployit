import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export type TemplateProps = {
	message: string;
	date: string;
};

export const DockerCleanupEmail = ({
	message = "Docker cleanup for deployi",
	date = "2023-05-01T00:00:00.000Z",
}: TemplateProps) => {
	const previewText = "Docker cleanup for deployi";
	return (
		<Html>
			<Preview>{previewText}</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: "#007291",
							},
						},
					},
				}}
			>
				<Head />

				<Body className="bg-white my-auto mx-auto font-sans px-2">
					<Container className="border border-solid border-[#eaeaea] rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px]">
						<Section className="mt-[32px]">
							<Img
								src={
									"https://raw.githubusercontent.com/ezeslucky/deployi/refs/heads/canary/apps/deployi/logo.png"
								}
								width="100"
								height="50"
								alt="deployi"
								className="my-0 mx-auto"
							/>
						</Section>
						<Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
							Docker cleanup for <strong>deployi</strong>
						</Heading>
						<Text className="text-black text-[14px] leading-[24px]">
							Hello,
						</Text>
						<Text className="text-black text-[14px] leading-[24px]">
							The docker cleanup for <strong>deployi</strong> was successful ✅
						</Text>

						<Section className="flex text-black text-[14px]  leading-[24px] bg-[#F4F4F5] rounded-lg p-2">
							<Text className="!leading-3 font-bold">Details: </Text>
							<Text className="!leading-3">
								Message: <strong>{message}</strong>
							</Text>
							<Text className="!leading-3">
								Date: <strong>{date}</strong>
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default DockerCleanupEmail;
