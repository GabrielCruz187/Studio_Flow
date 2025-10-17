"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Clock, TrendingUp, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockContacts = [
  {
    id: "1",
    name: "Maria Silva",
    phone: "+55 11 98765-4321",
    lastMessage: "Obrigada pelas fotos! Ficaram lindas!",
    lastMessageTime: "10:30",
    unreadCount: 0,
    online: true,
  },
  {
    id: "2",
    name: "João Santos",
    phone: "+55 11 97654-3210",
    lastMessage: "Qual o valor do pacote completo?",
    lastMessageTime: "09:15",
    unreadCount: 2,
    online: false,
  },
  {
    id: "3",
    name: "Ana Costa",
    phone: "+55 11 96543-2109",
    lastMessage: "Podemos remarcar para semana que vem?",
    lastMessageTime: "Ontem",
    unreadCount: 1,
    online: false,
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    phone: "+55 11 95432-1098",
    lastMessage: "Perfeito! Até sábado então",
    lastMessageTime: "Ontem",
    unreadCount: 0,
    online: false,
  },
]

const mockMessages = [
  {
    id: "1",
    text: "Olá! Gostaria de agendar um ensaio fotográfico",
    sender: "client" as const,
    timestamp: "10:25",
    read: true,
  },
  {
    id: "2",
    text: "Olá Maria! Claro, temos disponibilidade. Qual tipo de ensaio você procura?",
    sender: "user" as const,
    timestamp: "10:26",
    read: true,
  },
  {
    id: "3",
    text: "Estou pensando em um ensaio externo, no parque",
    sender: "client" as const,
    timestamp: "10:27",
    read: true,
  },
  {
    id: "4",
    text: "Ótima escolha! Temos pacotes a partir de R$ 500. Posso te enviar mais detalhes?",
    sender: "user" as const,
    timestamp: "10:28",
    read: true,
  },
  {
    id: "5",
    text: "Sim, por favor!",
    sender: "client" as const,
    timestamp: "10:29",
    read: true,
  },
]

export default function WhatsAppPage() {
  const [contacts] = useState(mockContacts)
  const [messages, setMessages] = useState(mockMessages)
  const [selectedContact, setSelectedContact] = useState<any>(mockContacts[0])
  const { toast } = useToast()

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: String(messages.length + 1),
      text,
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }
    setMessages([...messages, newMessage])
    toast({
      title: "Mensagem enviada",
      description: "Sua mensagem foi enviada com sucesso.",
    })
  }

  const stats = {
    totalConversations: contacts.length,
    unreadMessages: contacts.reduce((sum, c) => sum + c.unreadCount, 0),
    averageResponseTime: "5 min",
    messagesThisWeek: 142,
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
            <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business</h1>
            <p className="text-muted-foreground">Gerencie suas conversas com clientes</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>

        {/* Stats */}
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

        {/* Integration Notice */}
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

        {/* Chat Interface */}
        <WhatsAppChat
          contacts={contacts}
          messages={messages}
          selectedContact={selectedContact}
          onSelectContact={setSelectedContact}
          onSendMessage={handleSendMessage}
        />
      </div>
    </DashboardLayout>
  )
}
