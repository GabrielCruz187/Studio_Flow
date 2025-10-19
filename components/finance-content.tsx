"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionDialog } from "@/components/transaction-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FinanceContentProps {
  initialTransactions: any[]
  user: any
}

export function FinanceContent({ initialTransactions, user }: FinanceContentProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString())
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType

    const transactionMonth = new Date(transaction.date).getMonth()
    const matchesMonth = filterMonth === "all" || transactionMonth === Number.parseInt(filterMonth)

    return matchesSearch && matchesType && matchesMonth
  })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense
  const monthlyIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const handleAddTransaction = () => {
    setSelectedTransaction(null)
    setDialogOpen(true)
  }

  const handleEditTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setDialogOpen(true)
  }

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (selectedTransaction) {
        const { data, error } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", selectedTransaction.id)
          .select("*, client:client_id(name)")
          .single()

        if (error) throw error

        setTransactions(transactions.map((t) => (t.id === selectedTransaction.id ? data : t)))
        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        })
      } else {
        const { data, error } = await supabase
          .from("transactions")
          .insert([{ ...transactionData, user_id: user.id }])
          .select("*, client:client_id(name)")
          .single()

        if (error) throw error

        setTransactions([data, ...transactions])
        toast({
          title: "Transação registrada",
          description: "A nova transação foi registrada com sucesso.",
        })
      }
    } catch (error) {
      console.error("Error saving transaction:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return

    try {
      const { error } = await supabase.from("transactions").delete().eq("id", transactionToDelete)

      if (error) throw error

      setTransactions(transactions.filter((t) => t.id !== transactionToDelete))
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      })
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setTransactionToDelete(null)
    }
  }

  const confirmDelete = (e: React.MouseEvent, transactionId: string) => {
    e.stopPropagation()
    setTransactionToDelete(transactionId)
    setDeleteDialogOpen(true)
  }

  const paymentMethodLabels: Record<string, string> = {
    cash: "Dinheiro",
    credit: "Crédito",
    debit: "Débito",
    pix: "PIX",
    transfer: "Transferência",
    check: "Cheque",
  }

  const months = [
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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
            <p className="text-muted-foreground">Controle suas receitas e despesas</p>
          </div>
          <Button onClick={handleAddTransaction}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                {balance >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-accent" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span>Receitas - Despesas</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total acumulado</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total acumulado</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Summary */}
        {filterMonth !== "all" && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receitas do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Despesas do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  R$ {monthlyExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Nenhuma transação encontrada</div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors group"
                  >
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" ? "bg-accent/20" : "bg-destructive/20"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-accent" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{paymentMethodLabels[transaction.payment_method]}</span>
                          {transaction.client?.name && (
                            <>
                              <span>•</span>
                              <span>{transaction.client.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            transaction.type === "income" ? "text-accent" : "text-destructive"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}R${" "}
                          {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => confirmDelete(e, transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Dialog */}
        <TransactionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSaveTransaction}
          transaction={selectedTransaction}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTransaction}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  )
}
