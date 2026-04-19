import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/host/listings");
  }
  if (session.role !== "HOST") {
    redirect("/");
  }
  return <>{children}</>;
}
