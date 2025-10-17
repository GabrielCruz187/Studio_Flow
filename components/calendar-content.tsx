"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CalendarView } from "@/components/calendar-view"
import { EventDialog } from "@/components/event-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  client_id: string
  date: string
  time: string
  duration: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  type: string
  location?: string
  notes?: string
  client?: { name: string }
}

interface Client {
  id: string
  name: string
}

interface CalendarContentProps {
  initialEvents: Event[]
  clients: Client[]
}

export function CalendarContent({ initialEvents, clients }: CalendarContentProps) {
  const [events, setEvents] = useState(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setDialogOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setDetailsOpen(true)
  }

  const handleSaveEvent = async (eventData: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      if (selectedEvent) {
        const { error } = await supabase
          .from("events")
          .update({
            title: eventData.title,
            client_id: eventData.client_id,
            date: eventData.date,
            time: eventData.time,
            duration: eventData.duration,
            type: eventData.type,
            location: eventData.location,
            notes: eventData.notes,
            status: eventData.status,
          })
          .eq("id", selectedEvent.id)

        if (error) throw error

        toast({
          title: "Agendamento atualizado",
          description: "O agendamento foi atualizado com sucesso.",
        })
      } else {
        const { error } = await supabase.from("events").insert({
          user_id: user.id,
          title: eventData.title,
          client_id: eventData.client_id,
          date: eventData.date,
          time: eventData.time,
          duration: eventData.duration,
          type: eventData.type,
          location: eventData.location,
          notes: eventData.notes,
          status: eventData.status,
        })

        if (error) throw error

        toast({
          title: "Agendamento criado",
          description: "O novo agendamento foi criado com sucesso.",
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o agendamento.",
        variant: "destructive",
      })
    }
  }

  const handleEditEvent = () => {
    setDetailsOpen(false)
    setDialogOpen(true)
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return

    try {
      const { error } = await supabase.from("events").delete().eq("id", selectedEvent.id)

      if (error) throw error

      setDetailsOpen(false)
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o agendamento.",
        variant: "destructive",
      })
    }
  }

  const user = {
    name: "Admin User",
    email: "admin@studioflow.com",
    role: "admin",
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-muted-foreground">Gerencie seus agendamentos e eventos</p>
        </div>

        <CalendarView events={events} onEventClick={handleEventClick} onAddEvent={handleAddEvent} />

        <EventDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveEvent}
          event={selectedEvent}
          clients={clients}
        />

        {selectedEvent && (
          <div
            className={`fixed inset-0 z-50 ${detailsOpen ? "block" : "hidden"}`}
            onClick={() => setDetailsOpen(false)}
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
              <Card onClick={(e) => e.stopPropagation()}>
                <CardHeader>
                  <CardTitle>{selectedEvent.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.client?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString("pt-BR")} às {selectedEvent.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.duration} minutos</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  {selectedEvent.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Observações:</p>
                      <p className="text-sm">{selectedEvent.notes}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleEditEvent} className="flex-1">
                      Editar
                    </Button>
                    <Button onClick={handleDeleteEvent} variant="destructive" className="flex-1">
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
