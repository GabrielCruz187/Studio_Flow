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
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface TasksContentProps {
  initialTasks: any[]
  user: any
}

export function TasksContent({ initialTasks, user }: TasksContentProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient()

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority

    const matchesAssignee = filterAssignee === "all" || task.assigned_to === filterAssignee

    return matchesSearch && matchesPriority && matchesAssignee
  })

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter((t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "done").length,
  }

  const assignees = Array.from(new Set(tasks.map((t) => t.assigned_to).filter(Boolean)))

  const handleAddTask = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleSaveTask = async (taskData: any) => {
    try {
      if (selectedTask) {
        const { error } = await supabase
          .from("tasks")
          .update({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assigned_to: taskData.assignedTo,
            due_date: taskData.dueDate || null,
            tags: taskData.tags,
          })
          .eq("id", selectedTask.id)

        if (error) throw error

        setTasks(
          tasks.map((t) =>
            t.id === selectedTask.id
              ? {
                  ...t,
                  title: taskData.title,
                  description: taskData.description,
                  status: taskData.status,
                  priority: taskData.priority,
                  assigned_to: taskData.assignedTo,
                  due_date: taskData.dueDate || null,
                  tags: taskData.tags,
                }
              : t,
          ),
        )

        toast({
          title: "Tarefa atualizada",
          description: "A tarefa foi atualizada com sucesso.",
        })
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            user_id: user.id,
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assigned_to: taskData.assignedTo,
            due_date: taskData.dueDate || null,
            tags: taskData.tags,
          })
          .select()
          .single()

        if (error) throw error

        setTasks([data, ...tasks])

        toast({
          title: "Tarefa criada",
          description: "A nova tarefa foi criada com sucesso.",
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error saving task:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a tarefa.",
        variant: "destructive",
      })
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: any) => {
    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

      if (error) throw error

      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))

      toast({
        title: "Tarefa movida",
        description: "O status da tarefa foi atualizado.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error moving task:", error)
      toast({
        title: "Erro",
        description: "Não foi possível mover a tarefa.",
        variant: "destructive",
      })
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error

      setTasks(tasks.filter((t) => t.id !== taskId))

      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
        variant: "destructive",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa.",
        variant: "destructive",
      })
    }
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
