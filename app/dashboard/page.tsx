import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, DollarSign, CheckSquare, TrendingUp, TrendingDown } from "lucide-react"

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || "User",
    role: profile?.role || "user",
  }
}

async function getDashboardStats(userId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Get today's events count
  const { count: eventsToday } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("start_date", today.toISOString())
    .lt("start_date", tomorrow.toISOString())

  // Get active clients count
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "active")

  // Get this month's income
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "income")
    .gte("date", firstDayOfMonth.toISOString())

  const monthlyIncome = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  // Get pending tasks count
  const { count: pendingTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .neq("status", "done")

  return {
    eventsToday: eventsToday || 0,
    clientsCount: clientsCount || 0,
    monthlyIncome,
    pendingTasks: pendingTasks || 0,
  }
}

async function getTodayEvents(userId: string) {
  const supabase = await createClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      clients (name)
    `)
    .eq("user_id", userId)
    .gte("start_date", today.toISOString())
    .lt("start_date", tomorrow.toISOString())
    .order("start_date", { ascending: true })
    .limit(3)

  return events || []
}

export default async function DashboardPage() {
  const user = await getUser()
  const stats = await getDashboardStats(user.id)
  const todayEvents = await getTodayEvents(user.id)

  const statsCards = [
    {
      title: "Agendamentos Hoje",
      value: stats.eventsToday.toString(),
      change: `${stats.eventsToday} agendados`,
      trend: "up" as const,
      icon: Calendar,
    },
    {
      title: "Clientes Ativos",
      value: stats.clientsCount.toString(),
      change: "Total de clientes",
      trend: "up" as const,
      icon: Users,
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      change: "Este mês",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      title: "Tarefas Pendentes",
      value: stats.pendingTasks.toString(),
      change: "A fazer",
      trend: stats.pendingTasks > 0 ? ("up" as const) : ("down" as const),
      icon: CheckSquare,
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, {user.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-accent" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-accent" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Events */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              {todayEvents.length > 0 ? (
                <div className="space-y-4">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{event.clients?.name || "Cliente"}</p>
                        <p className="text-xs text-muted-foreground">{event.service_type}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-medium">
                          {new Date(event.start_date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            event.status === "confirmed"
                              ? "bg-accent/20 text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {event.status === "confirmed"
                            ? "Confirmado"
                            : event.status === "scheduled"
                              ? "Agendado"
                              : "Pendente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhum agendamento para hoje</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">Sistema configurado</p>
                    <p className="text-xs text-muted-foreground">Pronto para uso</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Comece adicionando clientes e agendamentos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
