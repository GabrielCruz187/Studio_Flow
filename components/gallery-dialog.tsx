"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface GalleryDialogProps {
  trigger: React.ReactNode
  gallery?: any
  clients: any[]
  onSave?: () => void
}

export function GalleryDialog({ trigger, gallery, clients, onSave }: GalleryDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [eventDate, setEventDate] = useState<Date | undefined>(
    gallery?.event_date ? new Date(gallery.event_date) : undefined,
  )
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    gallery?.expiry_date ? new Date(gallery.expiry_date) : undefined,
  )
  const [photos, setPhotos] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      client_id: formData.get("client_id"),
      event_type: formData.get("event_type"),
      event_date: eventDate?.toISOString(),
      password: formData.get("password"),
      expiry_date: expiryDate?.toISOString(),
      description: formData.get("description"),
      status: "active",
    }

    const url = gallery ? `/api/galleries/${gallery.id}` : "/api/galleries"
    const method = gallery ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setOpen(false)
      onSave?.()
      router.refresh()
    }

    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{gallery ? "Editar Galeria" : "Nova Galeria"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente *</Label>
              <Select name="client_id" defaultValue={gallery?.client_id} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_type">Tipo de Evento *</Label>
              <Select name="event_type" defaultValue={gallery?.event_type} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casamento">Casamento</SelectItem>
                  <SelectItem value="Ensaio Externo">Ensaio Externo</SelectItem>
                  <SelectItem value="Ensaio Estúdio">Ensaio Estúdio</SelectItem>
                  <SelectItem value="Book Profissional">Book Profissional</SelectItem>
                  <SelectItem value="Evento Corporativo">Evento Corporativo</SelectItem>
                  <SelectItem value="Aniversário">Aniversário</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Data do Evento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso *</Label>
              <Input
                id="password"
                name="password"
                type="text"
                defaultValue={gallery?.password}
                placeholder="Senha para o cliente"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data de Expiração</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={gallery?.description}
              placeholder="Adicione uma descrição para a galeria..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Upload de Fotos</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
              <Input id="photos" type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              <Label htmlFor="photos" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Clique para selecionar fotos ou arraste aqui</p>
                <p className="text-xs text-muted-foreground mt-1">Suporta JPG, PNG, WEBP (máx. 10MB por foto)</p>
              </Label>
            </div>
            {photos.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium">{photos.length} foto(s) selecionada(s)</p>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md text-sm">
                      <span className="truncate max-w-[200px]">{photo.name}</span>
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : gallery ? "Salvar Alterações" : "Criar Galeria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
