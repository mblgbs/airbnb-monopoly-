import { LoginForm } from "@/components/LoginForm";

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>
      <LoginForm nextPath={sp.next} />
    </div>
  );
}
