import { requireAccountUser } from "@/lib/auth-guards";
import EditProfileView from "@/components/account/EditProfileView";
import { updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ me, accountUser }, { error }] = await Promise.all([
    requireAccountUser("/account/edit"),
    searchParams,
  ]);

  return (
    <EditProfileView
      user={accountUser}
      action={updateProfile}
      initial={{
        fullName: me.fullName ?? "",
        phone: me.phone ?? "",
        city: me.city ?? "",
        avatarUrl: me.avatarUrl,
      }}
      saveError={error === "save"}
    />
  );
}
