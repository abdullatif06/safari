import { requireAccountUser } from "@/lib/auth-guards";
import SettingsView from "@/components/account/SettingsView";
import { updatePassword, updateLanguage, deleteAccount } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ pw?: string; lang?: string; del?: string }>;
}) {
  const { me, accountUser } = await requireAccountUser("/account/settings");
  const { pw, lang, del } = await searchParams;

  return (
    <SettingsView
      user={accountUser}
      currentLang={me.lang}
      status={{ pw, lang, del }}
      passwordAction={updatePassword}
      languageAction={updateLanguage}
      deleteAction={deleteAccount}
    />
  );
}
