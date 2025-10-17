"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, User, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignedTo?: string
  dueDate?: string
  tags?: string
}

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void
  onTaskDelete: (taskId: string) => void
}

const columns = [
  { id: "todo" as const, title: "A Fazer", color: "bg-muted" },
  { id: "in-progress" as const, title: "Em Progresso", color: "bg-primary/10" },
  { id: "review" as const, title: "Em Revisão", color: "bg-accent/10" },
  { id: "done" as const, title: "Concluído", color: "bg-accent/20" },
]

export function KanbanBoard({ tasks, onTaskClick, onTaskMove, onTaskDelete }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: Task["status"]) => {
    if (draggedTask) {
      onTaskMove(draggedTask, status)
      setDraggedTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive-foreground border-destructive/30"
      case "medium":
        return "bg-accent/20 text-accent-foreground border-accent/30"
      case "low":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id)

        return (
          <div
            key={column.id}
            className="flex flex-col gap-3"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className={cn("rounded-lg p-3", column.color)}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className="cursor-move hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium leading-tight">{task.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onTaskClick(task)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onTaskDelete(task.id)} className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      {task.tags &&
                        task.tags.split(",").map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                    </div>

                    {(task.assignedTo || task.dueDate) && (
                      <div className="space-y-1.5 pt-2 border-t">
                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{task.assignedTo}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <div
                            className={cn(
                              "flex items-center gap-2 text-xs",
                              isOverdue(task.dueDate) ? "text-destructive" : "text-muted-foreground",
                            )}
                          >
                            {isOverdue(task.dueDate) ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Calendar className="h-3 w-3" />
                            )}
                            <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                            {isOverdue(task.dueDate) && <span className="font-medium">(Atrasada)</span>}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
