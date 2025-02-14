import { supabase } from '@/lib/supabase';

export interface Dependent {
  id: string;
  name: string;
  birthDate: string;
  schoolName?: string;
  schoolGrade?: string;
  healthInsurance?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  monthlyExpenses: number;
  nextEvent?: {
    type: 'medical' | 'school' | 'birthday' | 'other';
    date: string;
    description: string;
  };
  expenses: {
    id: string;
    type: 'education' | 'health' | 'activities' | 'other';
    description: string;
    amount: number;
    date: string;
    recurrent: boolean;
  }[];
}

export interface DependentFormData {
  name: string;
  birthDate: string;
  schoolName?: string;
  schoolGrade?: string;
  healthInsurance?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  monthlyCost: number;
}

class DependentService {
  async getDependents(): Promise<Dependent[]> {
    const { data: dependents, error } = await supabase
      .from('dependents')
      .select(`
        *,
        dependent_events (
          id,
          type,
          date,
          description
        ),
        dependent_expenses (
          id,
          type,
          description,
          amount,
          date,
          recurrent
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dependents:', error);
      throw error;
    }

    return dependents.map(dependent => ({
      id: dependent.id,
      name: dependent.name,
      birthDate: dependent.birth_date,
      schoolName: dependent.school_name,
      schoolGrade: dependent.school_grade,
      healthInsurance: dependent.health_insurance,
      bloodType: dependent.blood_type,
      allergies: dependent.allergies,
      medications: dependent.medications,
      monthlyExpenses: dependent.monthly_cost,
      nextEvent: this.getNextEvent(dependent.dependent_events),
      expenses: dependent.dependent_expenses.map(expense => ({
        id: expense.id,
        type: expense.type,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        recurrent: expense.recurrent
      }))
    }));
  }

  private getNextEvent(events: any[]) {
    if (!events || events.length === 0) return undefined;

    const futureEvents = events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (futureEvents.length === 0) return undefined;

    const nextEvent = futureEvents[0];
    return {
      type: nextEvent.type,
      date: nextEvent.date,
      description: nextEvent.description
    };
  }

  async createDependent(data: DependentFormData): Promise<Dependent> {
    const { data: dependent, error } = await supabase
      .from('dependents')
      .insert({
        name: data.name,
        birth_date: data.birthDate,
        school_name: data.schoolName,
        school_grade: data.schoolGrade,
        health_insurance: data.healthInsurance,
        blood_type: data.bloodType,
        allergies: data.allergies,
        medications: data.medications,
        monthly_cost: data.monthlyCost
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dependent:', error);
      throw error;
    }

    return {
      id: dependent.id,
      name: dependent.name,
      birthDate: dependent.birth_date,
      schoolName: dependent.school_name,
      schoolGrade: dependent.school_grade,
      healthInsurance: dependent.health_insurance,
      bloodType: dependent.blood_type,
      allergies: dependent.allergies,
      medications: dependent.medications,
      monthlyExpenses: dependent.monthly_cost,
      expenses: []
    };
  }

  async updateDependent(id: string, data: DependentFormData): Promise<void> {
    const { error } = await supabase
      .from('dependents')
      .update({
        name: data.name,
        birth_date: data.birthDate,
        school_name: data.schoolName,
        school_grade: data.schoolGrade,
        health_insurance: data.healthInsurance,
        blood_type: data.bloodType,
        allergies: data.allergies,
        medications: data.medications,
        monthly_cost: data.monthlyCost
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating dependent:', error);
      throw error;
    }
  }

  async deleteDependent(id: string): Promise<void> {
    const { error } = await supabase
      .from('dependents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting dependent:', error);
      throw error;
    }
  }

  async addDependentEvent(dependentId: string, event: { type: string; date: string; description: string }): Promise<void> {
    const { error } = await supabase
      .from('dependent_events')
      .insert({
        dependent_id: dependentId,
        type: event.type,
        date: event.date,
        description: event.description
      });

    if (error) {
      console.error('Error adding dependent event:', error);
      throw error;
    }
  }

  async addDependentExpense(
    dependentId: string,
    expense: { type: string; description: string; amount: number; date: string; recurrent: boolean }
  ): Promise<void> {
    const { error } = await supabase
      .from('dependent_expenses')
      .insert({
        dependent_id: dependentId,
        type: expense.type,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        recurrent: expense.recurrent
      });

    if (error) {
      console.error('Error adding dependent expense:', error);
      throw error;
    }
  }
}

export const dependentService = new DependentService();
