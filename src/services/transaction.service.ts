import { supabase, Tables, InsertTables } from './supabase.service'

export type Transaction = Tables<'transactions'>

export const transactionService = {
  async getTransactions(filters?: {
    startDate?: Date
    endDate?: Date
    type?: 'income' | 'expense'
    category?: string
    status?: 'pending' | 'completed' | 'cancelled'
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate.toISOString().split('T')[0])
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate.toISOString().split('T')[0])
    }
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async createTransaction(transaction: InsertTables<'transactions'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTransaction(id: string, transaction: Partial<Transaction>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteTransaction(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },

  async getTransactionsByPeriod(startDate: Date, endDate: Date) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    return data
  },

  async getTransactionsSummary(startDate: Date, endDate: Date) {
    const transactions = await this.getTransactionsByPeriod(startDate, endDate)
    
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      categorySummary: {} as Record<string, { total: number, count: number }>,
    }

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        summary.totalIncome += Number(transaction.amount)
      } else {
        summary.totalExpense += Number(transaction.amount)
      }

      // Categoria summary
      if (!summary.categorySummary[transaction.category]) {
        summary.categorySummary[transaction.category] = { total: 0, count: 0 }
      }
      summary.categorySummary[transaction.category].total += Number(transaction.amount)
      summary.categorySummary[transaction.category].count += 1
    })

    summary.balance = summary.totalIncome - summary.totalExpense
    return summary
  }
}
