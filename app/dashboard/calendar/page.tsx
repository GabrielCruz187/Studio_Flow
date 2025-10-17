import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CalendarContent } from "@/components/calendar-content"

export default async function CalendarPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: events } = await supabase
    .from("events")
    .select(
      `
      *,
      client:clients(name)
    `,
    )
    .eq("user_id", user.id)
    .order("date", { ascending: true })

  const { data: clients } = await supabase.from("clients").select("id, name").eq("user_id", user.id)

  return <CalendarContent initialEvents={events || []} clients={clients || []} />
}
