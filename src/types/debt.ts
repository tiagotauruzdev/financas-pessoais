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
