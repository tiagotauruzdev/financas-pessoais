import { supabase } from '@/lib/supabase';

export interface Budget {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
}

export interface BudgetFormData {
  name: string;
  planned: number;
  actual: number;
  color: string;
}

class BudgetService {
  async getBudgets(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('*');

    if (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }

    return data.map(budget => ({
      id: budget.id,
      name: budget.name,
      planned: budget.planned,
      actual: budget.actual,
      color: budget.color || 'bg-blue-500'
    }));
  }

  async createBudget(budgetData: BudgetFormData): Promise<Budget> {
    const { data: budget, error } = await supabase
      .from('budgets')
      .insert({
        name: budgetData.name,
        planned: budgetData.planned,
        actual: budgetData.actual || 0,
        color: budgetData.color || 'bg-blue-500',
        period: 'monthly',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating budget:', error);
      throw error;
    }

    return {
      id: budget.id,
      name: budget.name,
      planned: budget.planned,
      actual: budget.actual,
      color: budget.color
    };
  }

  async updateBudget(id: string, budgetData: Partial<BudgetFormData>): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .update({
        name: budgetData.name,
        planned: budgetData.planned,
        actual: budgetData.actual,
        color: budgetData.color
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  async updateSpent(id: string, spent: number): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .update({ actual: spent })
      .eq('id', id);

    if (error) {
      console.error('Error updating budget spent amount:', error);
      throw error;
    }
  }

  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  async getCurrentMonthBudgets(): Promise<Budget[]> {
    const now = new Date();
    return this.getBudgets();
  }

  async getCurrentYearBudgets(): Promise<Budget[]> {
    const now = new Date();
    return this.getBudgets();
  }
}

export const budgetService = new BudgetService();
