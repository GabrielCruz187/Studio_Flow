import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FinanceContent } from "@/components/finance-content"

export default async function FinancePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, client:client_id(name)")
    .order("date", { ascending: false })

  return <FinanceContent initialTransactions={transactions || []} user={user} />
}
