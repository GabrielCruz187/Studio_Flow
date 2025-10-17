"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  title: string
  clientName: string
  date: string
  time: string
  duration: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  type: string
  location?: string
  notes?: string
}

interface CalendarViewProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onAddEvent: () => void
}

export function CalendarView({ events, onEventClick, onAddEvent }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const today = new Date()
  const isToday = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button variant={view === "month" ? "secondary" : "ghost"} size="sm" onClick={() => setView("month")}>
              Mês
            </Button>
            <Button variant={view === "week" ? "secondary" : "ghost"} size="sm" onClick={() => setView("week")}>
              Semana
            </Button>
            <Button variant={view === "day" ? "secondary" : "ghost"} size="sm" onClick={() => setView("day")}>
              Dia
            </Button>
          </div>
          <Button onClick={onAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day)
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-24 p-2 border border-border rounded-lg",
                    !day && "bg-muted/30",
                    isToday(day) && "border-primary border-2",
                  )}
                >
                  {day && (
                    <>
                      <div className={cn("text-sm font-medium mb-1", isToday(day) && "text-primary font-bold")}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <button
                            key={event.id}
                            onClick={() => onEventClick(event)}
                            className={cn(
                              "w-full text-left text-xs p-1 rounded truncate",
                              event.status === "confirmed" && "bg-primary/20 text-primary-foreground",
                              event.status === "pending" && "bg-muted text-muted-foreground",
                              event.status === "completed" && "bg-accent/20 text-accent-foreground",
                              event.status === "cancelled" && "bg-destructive/20 text-destructive-foreground",
                            )}
                          >
                            {event.time} - {event.title}
                          </button>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} mais</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
