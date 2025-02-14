import { supabase } from '../lib/supabase';

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  remaining_amount: number;
  created_at: string;
  updated_at: string;
  card_last_digits?: string;
  card_color?: string;
  card_brand?: string;
  interest_rate: number;
  due_date: string;
  payment_day: number;
  category: 'credit_card' | 'loan' | 'financing' | 'other';
  status: 'active' | 'paid' | 'defaulted';
  priority: 'low' | 'medium' | 'high';
}

export interface CreateDebtDTO {
  name: string;
  amount: number;
  remaining_amount: number;
  interest_rate: number;
  due_date: string;
  payment_day: number;
  category: Debt['category'];
  status?: Debt['status'];
  priority?: Debt['priority'];
  card_last_digits?: string;
  card_color?: string;
  card_brand?: string;
}

class DebtsService {
  async getAllDebts(): Promise<Debt[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createDebt(debt: CreateDebtDTO): Promise<Debt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('debts')
      .insert([{
        ...debt,
        user_id: user.id,
        status: 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating debt:', error);
      throw error;
    }

    return data;
  }

  async updateDebt(id: string, debt: Partial<CreateDebtDTO>): Promise<Debt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('debts')
      .update({
        ...debt,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating debt:', error);
      throw error;
    }

    return data;
  }

  async deleteDebt(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('debts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting debt:', error);
      throw error;
    }
  }

  async updateDebtStatus(id: string, status: Debt['status']): Promise<Debt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('debts')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getDebts(): Promise<Debt[]> {
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching debts:', error);
      throw error;
    }

    return data || [];
  }

  async updateDebtPriority(id: string, priority: Debt['priority']): Promise<Debt> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('debts')
      .update({ priority })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const debtsService = new DebtsService();
