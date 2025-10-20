"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Download, DollarSign, Users, Camera, CheckCircle2, Clock } from "lucide-react"
import { useState, useMemo } from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
  payment_method: string
  client_id: string | null
  client?: {
    name: string
  }
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  events: any[]
  transactions: any[]
}

interface Event {
  id: string
  title: string
  service_type: string
  start_time: string
  end_time: string
  location: string
  status: string
  client_id: string
  client?: {
    name: string
  }
}

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
}

interface ReportsContentProps {
  transactions: Transaction[]
  clients: Client[]
  events: Event[]
  tasks: Task[]
}

export function ReportsContent({ transactions, clients, events, tasks }: ReportsContentProps) {
  const [period, setPeriod] = useState("month")

  const financialData = useMemo(() => {
    const monthlyData: Record<string, { receita: number; despesas: number; lucro: number }> = {}

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = date.toLocaleDateString("pt-BR", { month: "short" })

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { receita: 0, despesas: 0, lucro: 0 }
      }

      if (transaction.type === "income") {
        monthlyData[monthKey].receita += transaction.amount
      } else {
        monthlyData[monthKey].despesas += transaction.amount
      }
      monthlyData[monthKey].lucro = monthlyData[monthKey].receita - monthlyData[monthKey].despesas
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }))
  }, [transactions])

  const serviceData = useMemo(() => {
    const serviceCount: Record<string, { count: number; revenue: number }> = {}

    events.forEach((event) => {
      const service = event.service_type || "Outros"
      if (!serviceCount[service]) {
        serviceCount[service] = { count: 0, revenue: 0 }
      }
      serviceCount[service].count++

      // Calculate revenue from transactions linked to this event's client
      const clientTransactions = transactions.filter((t) => t.client_id === event.client_id && t.type === "income")
      clientTransactions.forEach((t) => {
        serviceCount[service].revenue += t.amount
      })
    })

    return Object.entries(serviceCount)
      .map(([name, data]) => ({
        name,
        value: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [events, transactions])

  const clientGrowthData = useMemo(() => {
    const monthlyClients: Record<string, { novos: number; total: number }> = {}
    let cumulativeTotal = 0

    clients
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach((client) => {
        const date = new Date(client.created_at)
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short" })

        if (!monthlyClients[monthKey]) {
          monthlyClients[monthKey] = { novos: 0, total: 0 }
        }

        monthlyClients[monthKey].novos++
        cumulativeTotal++
        monthlyClients[monthKey].total = cumulativeTotal
      })

    return Object.entries(monthlyClients).map(([month, data]) => ({
      month,
      ...data,
    }))
  }, [clients])

  const taskMetrics = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "done").length
    const pending = tasks.filter((t) => t.status !== "done").length
    const total = tasks.length

    const byPriority = {
      high: tasks.filter((t) => t.priority === "high" && t.status !== "done").length,
      medium: tasks.filter((t) => t.priority === "medium" && t.status !== "done").length,
      low: tasks.filter((t) => t.priority === "low" && t.status !== "done").length,
    }

    return {
      completed,
      pending,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority,
    }
  }, [tasks])

  const totalRevenue = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  // Top clients by revenue
  const topClients = useMemo(() => {
    return clients
      .map((client) => {
        const clientRevenue = transactions
          .filter((t) => t.client_id === client.id && t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0)
        const eventCount = events.filter((e) => e.client_id === client.id).length

        return {
          name: client.name,
          events: eventCount,
          revenue: clientRevenue,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [clients, transactions, events])

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "#8b5cf6", "#f59e0b"]

  const exportReport = () => {
    alert("Exportando relatório em PDF...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Insights e métricas do seu negócio</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>{transactions.filter((t) => t.type === "income").length} transações</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Base de clientes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eventos Realizados</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3" />
              <span>Total de agendamentos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conclusão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskMetrics.completionRate}%</div>
            <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{taskMetrics.completed} tarefas concluídas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="tasks">Tarefas</TabsTrigger>
        </TabsList>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita vs Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                {financialData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="lucro" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Nenhuma transação registrada ainda
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                {serviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Nenhum evento registrado ainda
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Receita Total", value: totalRevenue, positive: true },
                  { label: "Despesas Totais", value: totalExpenses, positive: false },
                  { label: "Lucro Líquido", value: netProfit, positive: netProfit >= 0 },
                  {
                    label: "Ticket Médio",
                    value: events.length > 0 ? Math.round(totalRevenue / events.length) : 0,
                    positive: true,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">R$ {item.value.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Client Reports */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {clientGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clientGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="novos" fill="hsl(var(--primary))" name="Novos Clientes" />
                      <Bar dataKey="total" fill="hsl(var(--accent))" name="Total Acumulado" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Nenhum cliente cadastrado ainda
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {topClients.length > 0 ? (
                  <div className="space-y-3">
                    {topClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.events} eventos</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {client.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Nenhum cliente com receita ainda
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Base total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clients.filter((c) => c.events && c.events.length > 0).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Com eventos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {clients.length > 0 ? Math.round(totalRevenue / clients.length).toLocaleString() : 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Por cliente</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Service Reports */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {serviceData.length > 0 ? (
                <div className="space-y-4">
                  {serviceData.map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {service.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{service.value} eventos</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(service.value / events.length) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Nenhum serviço registrado ainda
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Serviço Mais Popular</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{serviceData[0]?.name || "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {serviceData[0] ? `${serviceData[0].value} eventos` : "Sem dados"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Maior Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{serviceData[0]?.name || "N/A"}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {serviceData[0] ? `R$ ${serviceData[0].revenue.toLocaleString()}` : "Sem dados"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{events.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Agendamentos</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Task Reports */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Tarefas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taxa de Conclusão</span>
                      <span className="text-2xl font-bold">{taskMetrics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full"
                        style={{ width: `${taskMetrics.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Concluídas</span>
                      </div>
                      <p className="text-2xl font-bold">{taskMetrics.completed}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Pendentes</span>
                      </div>
                      <p className="text-2xl font-bold">{taskMetrics.pending}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tarefas por Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { priority: "Alta", count: taskMetrics.byPriority.high, color: "#ef4444" },
                    { priority: "Média", count: taskMetrics.byPriority.medium, color: "#f59e0b" },
                    { priority: "Baixa", count: taskMetrics.byPriority.low, color: "hsl(var(--primary))" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.priority}</span>
                          <span className="text-sm text-muted-foreground">{item.count} tarefas</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${taskMetrics.pending > 0 ? (item.count / taskMetrics.pending) * 100 : 0}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground">Total de Tarefas</p>
                  <p className="text-2xl font-bold mt-1">{taskMetrics.total}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                  <p className="text-2xl font-bold mt-1">{taskMetrics.completed}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold mt-1">{taskMetrics.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
