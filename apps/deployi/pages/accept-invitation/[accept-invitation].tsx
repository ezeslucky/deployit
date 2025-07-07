import { GetServerSideProps } from "next";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface AcceptInvitationPageProps {
  invitationId: string;
}

export default function AcceptInvitationPage({ invitationId }: AcceptInvitationPageProps) {
  const handleAccept = async () => {
    const result = await authClient.organization.acceptInvitation({ invitationId });
    console.log(result);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleAccept}>Accept Invitation</Button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const invitationId = context.params?.["accept-invitation"];

  if (!invitationId || typeof invitationId !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      invitationId,
    },
  };
};
