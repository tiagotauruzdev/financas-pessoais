import { supabase, Tables } from './supabase.service'

export type Subscription = Tables<'subscriptions'>

export const subscriptionService = {
  async getCurrentSubscription() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao obter assinatura:', error)
      throw error
    }
    return data
  },

  async cancelSubscription() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        auto_renew: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao cancelar assinatura:', error)
      throw error
    }
    return data
  },

  async reactivateSubscription() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        auto_renew: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao reativar assinatura:', error)
      throw error
    }
    return data
  }
}
