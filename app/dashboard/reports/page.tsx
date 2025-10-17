"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  Users,
  Camera,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { useState } from "react"
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

export default function ReportsPage() {
  const [period, setPeriod] = useState("month")

  const user = {
    name: "Admin User",
    email: "admin@studioflow.com",
    role: "admin",
  }

  const revenueData = [
    { month: "Jan", receita: 18500, despesas: 8200, lucro: 10300 },
    { month: "Fev", receita: 22000, despesas: 9100, lucro: 12900 },
    { month: "Mar", receita: 24500, despesas: 8800, lucro: 15700 },
    { month: "Abr", receita: 21000, despesas: 9500, lucro: 11500 },
    { month: "Mai", receita: 26500, despesas: 10200, lucro: 16300 },
    { month: "Jun", receita: 28000, despesas: 9800, lucro: 18200 },
  ]

  const serviceData = [
    { name: "Casamento", value: 35, revenue: 64000 },
    { name: "Ensaio Externo", value: 25, revenue: 30000 },
    { name: "Book Profissional", value: 20, revenue: 18000 },
    { name: "Formatura", value: 12, revenue: 12000 },
    { name: "Outros", value: 8, revenue: 8000 },
  ]

  const clientGrowthData = [
    { month: "Jan", novos: 8, total: 45 },
    { month: "Fev", novos: 12, total: 57 },
    { month: "Mar", novos: 15, total: 72 },
    { month: "Abr", novos: 10, total: 82 },
    { month: "Mai", novos: 14, total: 96 },
    { month: "Jun", novos: 18, total: 114 },
  ]

  const taskCompletionData = [
    { week: "Sem 1", concluidas: 12, pendentes: 8 },
    { week: "Sem 2", concluidas: 15, pendentes: 6 },
    { week: "Sem 3", concluidas: 18, pendentes: 5 },
    { week: "Sem 4", concluidas: 14, pendentes: 7 },
  ]

  const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "#8b5cf6", "#f59e0b"]

  const exportReport = () => {
    alert("Exportando relatório em PDF...")
  }

  return (
    <DashboardLayout user={user}>
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
              <div className="text-2xl font-bold">R$ 28.000</div>
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+18% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Novos Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+29% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Eventos Realizados</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+14% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Conversão</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+6% vs mês anterior</span>
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
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita por Serviço</CardTitle>
                </CardHeader>
                <CardContent>
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
                    { label: "Receita Total", value: 132000, change: 18, positive: true },
                    { label: "Despesas Totais", value: 55600, change: -5, positive: true },
                    { label: "Lucro Líquido", value: 76400, change: 32, positive: true },
                    { label: "Ticket Médio", value: 4125, change: 8, positive: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xl font-bold">R$ {item.value.toLocaleString()}</span>
                          <span
                            className={`text-xs flex items-center gap-1 ${item.positive ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {Math.abs(item.change)}%
                          </span>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Maria Silva", events: 8, revenue: 32000 },
                      { name: "João Santos", events: 6, revenue: 24000 },
                      { name: "Ana Costa", events: 5, revenue: 20000 },
                      { name: "Pedro Oliveira", events: 4, revenue: 16000 },
                      { name: "Carla Souza", events: 3, revenue: 12000 },
                    ].map((client, index) => (
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
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">114</div>
                  <p className="text-xs text-muted-foreground mt-1">+18 este mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Retenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85%</div>
                  <p className="text-xs text-muted-foreground mt-1">+3% vs mês anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">97</div>
                  <p className="text-xs text-muted-foreground mt-1">85% do total</p>
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
                            width: `${service.value}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Serviço Mais Popular</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Casamento</div>
                  <p className="text-xs text-muted-foreground mt-1">35% dos eventos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Maior Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">Casamento</div>
                  <p className="text-xs text-muted-foreground mt-1">R$ 64.000 total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">R$ 4.125</div>
                  <p className="text-xs text-muted-foreground mt-1">por evento</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Task Reports */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Conclusão de Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="concluidas" fill="hsl(var(--primary))" name="Concluídas" />
                      <Bar dataKey="pendentes" fill="#ef4444" name="Pendentes" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Taxa de Conclusão</span>
                        <span className="text-2xl font-bold">78%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div className="bg-primary h-3 rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Concluídas</span>
                        </div>
                        <p className="text-2xl font-bold">59</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Pendentes</span>
                        </div>
                        <p className="text-2xl font-bold">26</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tempo Médio de Conclusão</p>
                      <p className="text-2xl font-bold">3.5 dias</p>
                      <p className="text-xs text-muted-foreground">-0.5 dias vs mês anterior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tarefas por Prioridade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { priority: "Alta", count: 8, color: "#ef4444" },
                    { priority: "Média", count: 12, color: "#f59e0b" },
                    { priority: "Baixa", count: 6, color: "hsl(var(--primary))" },
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
                              width: `${(item.count / 26) * 100}%`,
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
