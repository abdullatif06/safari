import PageShell from "@/components/PageShell";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <PageShell>
      <AuthForm mode="login" hasError={error === "auth"} />
    </PageShell>
  );
}
