// pages/accept-invitation/[accept-invitation].tsx
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { GetServerSidePropsContext } from "next";

type Props = {
	invitationId: string;
};

const AcceptInvitation = ({ invitationId }: Props) => {
	return (
		<div>
			<Button
				onClick={async () => {
					const result = await authClient.organization.acceptInvitation({
						invitationId,
					});
					console.log(result);
				}}
			>
				Accept Invitation
			</Button>
		</div>
	);
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const invitationId = ctx.params?.["accept-invitation"];

	if (!invitationId || typeof invitationId !== "string") {
		return { notFound: true };
	}

	return {
		props: {
			invitationId,
		},
	};
}

export default AcceptInvitation;
