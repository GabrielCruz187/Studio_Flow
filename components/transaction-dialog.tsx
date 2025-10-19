"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (transaction: any) => void
  transaction?: any
}

export function TransactionDialog({ open, onOpenChange, onSave, transaction }: TransactionDialogProps) {
  const [clients, setClients] = useState<any[]>([])
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from("clients").select("id, name").order("name")
      setClients(data || [])
    }
    if (open) {
      fetchClients()
    }
  }, [open])

  const [formData, setFormData] = useState(
    transaction || {
      type: "income",
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      payment_method: "",
      client_id: null, // Updated default value to be a non-empty string
    },
  )

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        client_id: transaction.client_id || null, // Updated default value to be a non-empty string
      })
    } else {
      setFormData({
        type: "income",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        payment_method: "",
        client_id: null, // Updated default value to be a non-empty string
      })
    }
  }, [transaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      amount: Number.parseFloat(formData.amount),
      client_id: formData.client_id || null,
    }
    onSave(dataToSave)
    onOpenChange(false)
  }

  const incomeCategories = [
    "Ensaio Fotográfico",
    "Casamento",
    "Formatura",
    "Book Profissional",
    "Evento Corporativo",
    "Edição de Fotos",
    "Aluguel de Equipamento",
    "Outros",
  ]

  const expenseCategories = [
    "Equipamentos",
    "Manutenção",
    "Aluguel",
    "Marketing",
    "Transporte",
    "Software/Assinaturas",
    "Impostos",
    "Salários",
    "Outros",
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{transaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
          <DialogDescription>Registre uma receita ou despesa</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Forma de Pagamento</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                  <SelectItem value="check">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "income" && (
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Nenhum</SelectItem> {/* Updated value prop to be a non-empty string */}
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes da transação"
              rows={3}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Transação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
