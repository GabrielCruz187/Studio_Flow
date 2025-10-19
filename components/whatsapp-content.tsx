"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Clock, TrendingUp, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface WhatsAppContentProps {
  initialMessages: any[]
  initialContacts: any[]
  user: any
}

export function WhatsAppContent({ initialMessages, initialContacts, user }: WhatsAppContentProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [messages, setMessages] = useState(initialMessages)
  const [selectedContact, setSelectedContact] = useState<any>(initialContacts[0] || null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleSendMessage = async (text: string) => {
    if (!selectedContact) return

    try {
      const { data, error } = await supabase
        .from("whatsapp_messages")
        .insert({
          user_id: user.id,
          contact_name: selectedContact.name,
          contact_phone: selectedContact.phone,
          message: text,
          sender: "user",
          read: false,
        })
        .select()
        .single()

      if (error) throw error

      setMessages([...messages, data])

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      })
    }
  }

  const selectedMessages = messages.filter((msg) => msg.contact_phone === selectedContact?.phone)

  const stats = {
    totalConversations: contacts.length,
    unreadMessages: contacts.reduce((sum: number, c: any) => sum + c.unreadCount, 0),
    averageResponseTime: "5 min",
    messagesThisWeek: messages.length,
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business</h1>
            <p className="text-muted-foreground">Gerencie suas conversas com clientes</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversas Ativas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Não Lidas</CardTitle>
              <MessageSquare className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.unreadMessages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Esta Semana</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messagesThisWeek}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Integração com WhatsApp Business API</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Para conectar sua conta do WhatsApp Business, você precisará configurar a API oficial do WhatsApp.
                  Esta interface demonstra como o sistema funcionará após a integração.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">Conectar WhatsApp</Button>
                  <Button size="sm" variant="outline">
                    Documentação
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <WhatsAppChat
          contacts={contacts}
          messages={selectedMessages}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          onSendMessage={handleSendMessage}
        />
      </div>
    </DashboardLayout>
  )
}
