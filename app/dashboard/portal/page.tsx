"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GalleryDialog } from "@/components/gallery-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ImageIcon, Download, Calendar, Lock, Search, Copy, ExternalLink, Trash2 } from "lucide-react"
import { useState } from "react"

export default function PortalPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const user = {
    name: "Admin User",
    email: "admin@studioflow.com",
    role: "admin",
  }

  const [mockGalleries, setMockGalleries] = useState([
    {
      id: "1",
      clientName: "Maria Silva",
      eventType: "Ensaio Externo",
      date: "2024-03-15",
      photos: 45,
      status: "active",
      views: 23,
      password: "maria2024",
      link: "https://studioflow.app/gallery/abc123",
    },
    {
      id: "2",
      clientName: "João Santos",
      eventType: "Casamento",
      date: "2024-03-10",
      photos: 320,
      status: "active",
      views: 156,
      password: "joao2024",
      link: "https://studioflow.app/gallery/def456",
    },
    {
      id: "3",
      clientName: "Ana Costa",
      eventType: "Book Profissional",
      date: "2024-03-05",
      photos: 78,
      status: "expired",
      views: 45,
      password: "ana2024",
      link: "https://studioflow.app/gallery/ghi789",
    },
  ])

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert("Link copiado para a área de transferência!")
  }

  const deleteGallery = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta galeria?")) {
      setMockGalleries(mockGalleries.filter((g) => g.id !== id))
    }
  }

  const filteredGalleries = mockGalleries.filter(
    (gallery) =>
      gallery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gallery.eventType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portal do Cliente</h1>
            <p className="text-muted-foreground">Gerencie galerias e acesso dos clientes</p>
          </div>
          <GalleryDialog
            trigger={
              <Button>
                <ImageIcon className="h-4 w-4 mr-2" />
                Nova Galeria
              </Button>
            }
            onSave={(data) => {
              console.log("[v0] New gallery data:", data)
              // Here you would save to database
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Galerias Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.456</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Favoritas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Notice */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Portal Exclusivo para Clientes</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Crie galerias privadas onde seus clientes podem visualizar, selecionar favoritas e fazer download das
                  fotos. Cada galeria possui link único e senha de acesso.
                </p>
                <GalleryDialog
                  trigger={<Button size="sm">Criar Primeira Galeria</Button>}
                  onSave={(data) => console.log("[v0] Gallery created:", data)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou tipo de evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Galleries List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Galerias ({filteredGalleries.length})</h2>
          {filteredGalleries.map((gallery) => (
            <Card key={gallery.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{gallery.clientName}</h3>
                        <Badge variant={gallery.status === "active" ? "default" : "secondary"}>
                          {gallery.status === "active" ? "Ativa" : "Expirada"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{gallery.eventType}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(gallery.date).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          {gallery.photos} fotos
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {gallery.views} visualizações
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Senha: {gallery.password}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyLink(gallery.link)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Link
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(gallery.link, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <GalleryDialog
                      trigger={<Button size="sm">Gerenciar</Button>}
                      gallery={gallery}
                      onSave={(data) => console.log("[v0] Gallery updated:", data)}
                    />
                    <Button variant="outline" size="sm" onClick={() => deleteGallery(gallery.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
