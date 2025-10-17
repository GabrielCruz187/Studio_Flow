"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { KanbanBoard } from "@/components/kanban-board"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ListTodo, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock tasks data
const mockTasks = [
  {
    id: "1",
    title: "Editar fotos do ensaio Maria Silva",
    description: "Selecionar e editar as melhores fotos do ensaio externo realizado no parque",
    status: "in-progress" as const,
    priority: "high" as const,
    assignedTo: "João Editor",
    dueDate: "2024-03-20",
    tags: "edição,urgente",
  },
  {
    id: "2",
    title: "Preparar equipamento para casamento",
    description: "Verificar baterias, cartões de memória e lentes para o casamento de sábado",
    status: "todo" as const,
    priority: "high" as const,
    assignedTo: "Admin User",
    dueDate: "2024-03-18",
    tags: "equipamento,casamento",
  },
  {
    id: "3",
    title: "Enviar fotos para Ana Costa",
    description: "Fazer upload das fotos editadas do book profissional na galeria online",
    status: "review" as const,
    priority: "medium" as const,
    assignedTo: "Admin User",
    dueDate: "2024-03-19",
    tags: "entrega",
  },
  {
    id: "4",
    title: "Atualizar portfólio no site",
    description: "Adicionar fotos recentes dos últimos trabalhos realizados",
    status: "todo" as const,
    priority: "low" as const,
    assignedTo: "Admin User",
    tags: "marketing",
  },
  {
    id: "5",
    title: "Backup das fotos de fevereiro",
    description: "Fazer backup completo de todas as fotos do mês passado",
    status: "done" as const,
    priority: "medium" as const,
    assignedTo: "Admin User",
    dueDate: "2024-03-15",
    tags: "backup",
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const { toast } = useToast()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    const matchesAssignee = filterAssignee === "all" || task.assignedTo === filterAssignee

    return matchesSearch && matchesPriority && matchesAssignee
  })

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length,
  }

  const assignees = Array.from(new Set(tasks.map((t) => t.assignedTo).filter(Boolean)))

  const handleAddTask = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleSaveTask = (taskData: any) => {
    if (selectedTask) {
      setTasks(tasks.map((t) => (t.id === selectedTask.id ? { ...selectedTask, ...taskData } : t)))
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
      })
    } else {
      setTasks([
        ...tasks,
        {
          ...taskData,
          id: String(tasks.length + 1),
        },
      ])
      toast({
        title: "Tarefa criada",
        description: "A nova tarefa foi criada com sucesso.",
      })
    }
  }

  const handleTaskMove = (taskId: string, newStatus: any) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
    toast({
      title: "Tarefa movida",
      description: "O status da tarefa foi atualizado.",
    })
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso.",
      variant: "destructive",
    })
  }

  // Mock user data
  const user = {
    name: "Admin User",
    email: "admin@studioflow.com",
    role: "admin",
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-muted-foreground">Organize suas tarefas em quadros Kanban</p>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">A Fazer</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todo}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Concluídas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.done}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Atrasadas</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {assignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee || ""}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
          onTaskDelete={handleTaskDelete}
        />

        {/* Task Dialog */}
        <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSaveTask} task={selectedTask} />
      </div>
    </DashboardLayout>
  )
}
