import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"

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

export default async function SettingsPage() {
  const user = await getUser()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">Configurações serão implementadas em breve</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
