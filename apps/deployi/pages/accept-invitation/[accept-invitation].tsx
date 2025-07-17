import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";

const AcceptInvitation = () => {
	const { query } = useRouter();
	const invitationId = query.invitationId as string;

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Button
				onClick={async () => {
					try {
						const result = await authClient.organization.acceptInvitation({
							invitationId,
						});
						console.log("Invitation accepted:", result);
					} catch (error) {
						console.error("Failed to accept invitation:", error);
					}
				}}
			>
				Accept Invitation
			</Button>
		</div>
	);
};

export default AcceptInvitation;

// ✅ Force this page to be rendered at request time, avoiding static generation
export async function getServerSideProps() {
	return { props: {} };
}
