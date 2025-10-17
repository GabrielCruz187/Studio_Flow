"use client"

import { useState } from "react"
import { ClientDialog } from "@/components/client-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreVertical, Mail, Phone, MapPin, Calendar, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ClientsContentProps {
  initialClients: any[]
  userId: string
  user: any
}

export function ClientsContent({ initialClients, userId }: ClientsContentProps) {
  const [clients, setClients] = useState(initialClients)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery),
  )

  const handleAddClient = () => {
    setSelectedClient(null)
    setDialogOpen(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setDialogOpen(true)
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setDetailsOpen(true)
  }

  const handleSaveClient = async (clientData: any) => {
    try {
      if (selectedClient) {
        // Update existing client
        const { error } = await supabase
          .from("clients")
          .update({
            ...clientData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedClient.id)
          .eq("user_id", userId)

        if (error) throw error

        setClients(clients.map((c) => (c.id === selectedClient.id ? { ...c, ...clientData } : c)))
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        })
      } else {
        // Create new client
        const { data, error } = await supabase
          .from("clients")
          .insert({
            ...clientData,
            user_id: userId,
            status: "active",
          })
          .select()
          .single()

        if (error) throw error

        setClients([{ ...data, totalEvents: 0, totalSpent: 0 }, ...clients])
        toast({
          title: "Cliente cadastrado",
          description: "O novo cliente foi cadastrado com sucesso.",
        })
      }
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase.from("clients").delete().eq("id", clientId).eq("user_id", userId)

      if (error) throw error

      setClients(clients.filter((c) => c.id !== clientId))
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting client:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
        <Button onClick={handleAddClient}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                clients.filter((c) => {
                  const createdDate = new Date(c.created_at)
                  const now = new Date()
                  return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.filter((c) => c.status === "active").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes por nome, email ou telefone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {client.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{client.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Cliente desde {new Date(client.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewClient(client)}>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditClient(client)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClient(client.id)} className="text-destructive">
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2" onClick={() => handleViewClient(client)}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{client.phone}</span>
                </div>
                {client.city && client.state && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {client.city}, {client.state}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{client.totalEvents}</span>
                    <span className="text-muted-foreground">eventos</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">R$ {client.totalSpent.toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado ainda"}
          </p>
          {!searchQuery && (
            <Button onClick={handleAddClient}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Cliente
            </Button>
          )}
        </div>
      )}

      {/* Client Dialog */}
      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSaveClient} client={selectedClient} />

      {/* Client Details Dialog */}
      {selectedClient && detailsOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setDetailsOpen(false)}>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {selectedClient.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{selectedClient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Cliente desde {new Date(selectedClient.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Telefone</p>
                    <p className="text-sm font-medium">{selectedClient.phone}</p>
                  </div>
                  {selectedClient.cpf && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">CPF</p>
                      <p className="text-sm font-medium">{selectedClient.cpf}</p>
                    </div>
                  )}
                  {selectedClient.zip_code && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">CEP</p>
                      <p className="text-sm font-medium">{selectedClient.zip_code}</p>
                    </div>
                  )}
                </div>

                {selectedClient.address && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Endereço</p>
                    <p className="text-sm font-medium">
                      {selectedClient.address}
                      {selectedClient.city && selectedClient.state && (
                        <>
                          <br />
                          {selectedClient.city}, {selectedClient.state}
                        </>
                      )}
                    </p>
                  </div>
                )}

                {selectedClient.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{selectedClient.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{selectedClient.totalEvents}</p>
                        <p className="text-sm text-muted-foreground">Eventos Realizados</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">R$ {selectedClient.totalSpent.toLocaleString("pt-BR")}</p>
                        <p className="text-sm text-muted-foreground">Total Gasto</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => {
                      setDetailsOpen(false)
                      handleEditClient(selectedClient)
                    }}
                    className="flex-1"
                  >
                    Editar Cliente
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteClient(selectedClient.id)
                      setDetailsOpen(false)
                    }}
                    variant="destructive"
                    className="flex-1"
                  >
                    Excluir Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
