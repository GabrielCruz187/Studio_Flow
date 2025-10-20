import { DashboardLayout } from "@/components/dashboard-layout"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportsContent } from "@/components/reports-content"

export default async function ReportsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch transactions for financial data
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, client:clients(*)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  // Fetch clients for client analytics
  const { data: clients } = await supabase
    .from("clients")
    .select("*, events(*), transactions(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch events for service analytics
  const { data: events } = await supabase
    .from("events")
    .select("*, client:clients(*)")
    .eq("user_id", user.id)
    .order("start_time", { ascending: false })

  // Fetch tasks for task analytics
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const userData = {
    name: profile?.name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    role: "admin",
  }

  return (
    <DashboardLayout user={userData}>
      <ReportsContent
        transactions={transactions || []}
        clients={clients || []}
        events={events || []}
        tasks={tasks || []}
      />
    </DashboardLayout>
  )
}
