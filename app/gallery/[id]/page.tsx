"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Download, Heart, Grid3x3, List, Search, Camera } from "lucide-react"

export default function ClientGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Mock gallery data
  const gallery = {
    id: "abc123",
    clientName: "Maria Silva",
    eventType: "Ensaio Externo",
    date: "2024-03-15",
    description: "Ensaio fotográfico realizado no parque da cidade com luz natural.",
    photos: Array.from({ length: 24 }, (_, i) => ({
      id: `photo-${i + 1}`,
      url: `/placeholder.svg?height=400&width=400&query=professional photography ${i + 1}`,
      thumbnail: `/placeholder.svg?height=200&width=200&query=professional photography ${i + 1}`,
      name: `IMG_${String(i + 1).padStart(4, "0")}.jpg`,
    })),
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "maria2024") {
      setIsAuthenticated(true)
    } else {
      alert("Senha incorreta!")
    }
  }

  const toggleFavorite = (photoId: string) => {
    setFavorites((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  const toggleSelection = (photoId: string) => {
    setSelectedPhotos((prev) => (prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]))
  }

  const downloadSelected = () => {
    alert(`Baixando ${selectedPhotos.length} foto(s) selecionada(s)...`)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">StudioFlow</h1>
              <p className="text-muted-foreground">Portal do Cliente</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Digite a senha fornecida"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Acessar Galeria
              </Button>
              <p className="text-xs text-center text-muted-foreground">Dica: Use a senha maria2024 para acessar</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredPhotos = gallery.photos.filter((photo) => photo.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{gallery.clientName}</h1>
              <p className="text-sm text-muted-foreground">
                {gallery.eventType} • {new Date(gallery.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline">
              Sair
            </Button>
          </div>
          {gallery.description && <p className="text-sm text-muted-foreground mb-4">{gallery.description}</p>}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fotos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            {selectedPhotos.length > 0 && (
              <Button onClick={downloadSelected}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Selecionadas ({selectedPhotos.length})
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Gallery */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredPhotos.length} foto(s) • {favorites.length} favorita(s)
          </p>
          {favorites.length > 0 && (
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Ver Favoritas
            </Button>
          )}
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group">
              <CardContent className="p-0 relative">
                <img
                  src={photo.thumbnail || "/placeholder.svg"}
                  alt={photo.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => toggleFavorite(photo.id)}>
                    <Heart className={`h-4 w-4 ${favorites.includes(photo.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => alert(`Baixando ${photo.name}...`)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedPhotos.includes(photo.id)}
                    onCheckedChange={() => toggleSelection(photo.id)}
                    className="bg-background"
                  />
                </div>
                {favorites.includes(photo.id) && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    <Heart className="h-3 w-3 fill-current" />
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
