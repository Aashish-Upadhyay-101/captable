import { InviteMemberModal } from "@/components/stakeholder/invite-member-modal";
import { MemberCard } from "@/components/stakeholder/member-card";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { withServerSession } from "@/server/auth";
import { getMembers, type TypeGetMembers } from "@/server/stakeholder";

const StakeholdersPage = async () => {
  const session = await withServerSession();
  const members = await getMembers(session.user.companyId);
  const currentMembers: TypeGetMembers = [];
  const invitedMembers: TypeGetMembers = [];

  for (const member of members) {
    if (member.isOnboarded && member.status === "ACCEPTED") {
      currentMembers.push(member);
    } else {
      invitedMembers.push(member);
    }
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex  items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h2 className="text-xl font-medium">Stakeholders</h2>
          <p className="text-sm text-muted-foreground">
            Teammates that have access to this project.
          </p>
        </div>

        <div>
          <InviteMemberModal inviteeName={session.user.name} />
        </div>
      </div>
      <Separator />
      <div>
        <Tabs defaultValue="members">
          <div className="pb-4">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invitation">Invitation</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="members">
            <div className="flex flex-col gap-y-6">
              {currentMembers.length
                ? currentMembers.map((item) => (
                    <MemberCard
                      key={item.id}
                      name={item.user?.name}
                      email={item.user?.email}
                      status={item.status}
                      userEmail={session.user.email}
                      membershipId={item.id}
                    />
                  ))
                : null}
            </div>
          </TabsContent>
          <TabsContent value="invitation">
            <div className="flex flex-col gap-y-6">
              {invitedMembers.length
                ? invitedMembers.map((item) => (
                    <MemberCard
                      key={item.id}
                      name={item.user?.name}
                      email={item.invitedEmail}
                      status={item.status}
                      userEmail={session.user.email}
                      membershipId={item.id}
                    />
                  ))
                : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StakeholdersPage;
