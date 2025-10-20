import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TasksContent } from "@/components/tasks-content"

export default async function TasksPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <TasksContent initialTasks={tasks || []} user={user} />
}
