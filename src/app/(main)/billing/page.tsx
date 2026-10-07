import CustomerPortalButton from "@/features/billing/components/CustomerPortalButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const BillingPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/login");
  }
  return (
    <div>
      <CustomerPortalButton />
    </div>
  );
};

export default BillingPage;
