import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientsContent } from "@/components/clients-content"

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || "User",
    role: profile?.role || "user",
  }
}

async function getClients(userId: string) {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from("clients")
    .select(`
      *,
      events:events(count),
      transactions:transactions(amount)
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching clients:", error)
    return []
  }

  return (clients || []).map((client) => ({
    ...client,
    totalEvents: client.events?.[0]?.count || 0,
    totalSpent: client.transactions?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0,
  }))
}

export default async function ClientsPage() {
  const user = await getUser()
  const clients = await getClients(user.id)

  return (
    <DashboardLayout user={user}>
      <ClientsContent initialClients={clients} userId={user.id} user={user} />
    </DashboardLayout>
  )
}
