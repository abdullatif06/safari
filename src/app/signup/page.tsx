import PageShell from "@/components/PageShell";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; check?: string }>;
}) {
  const { error, check } = await searchParams;
  return (
    <PageShell>
      <AuthForm
        mode="signup"
        hasError={error === "auth"}
        checkEmail={check === "email"}
      />
    </PageShell>
  );
}
