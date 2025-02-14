-- Drop existing table and its dependencies
DROP TABLE IF EXISTS public.dependents CASCADE;

-- Create updated dependents table
CREATE TABLE IF NOT EXISTS public.dependents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    school_name TEXT,
    school_grade TEXT,
    health_insurance TEXT,
    blood_type TEXT,
    allergies TEXT,
    medications TEXT,
    monthly_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table for dependents
CREATE TABLE IF NOT EXISTS public.dependent_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dependent_id UUID REFERENCES public.dependents(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('medical', 'school', 'birthday', 'other')),
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create expenses table for dependents
CREATE TABLE IF NOT EXISTS public.dependent_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dependent_id UUID REFERENCES public.dependents(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('education', 'health', 'activities', 'other')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    recurrent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for dependents
ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dependents"
    ON public.dependents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dependents"
    ON public.dependents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dependents"
    ON public.dependents
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dependents"
    ON public.dependents
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for dependent events
ALTER TABLE public.dependent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dependent events"
    ON public.dependent_events
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_events.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own dependent events"
    ON public.dependent_events
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_events.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own dependent events"
    ON public.dependent_events
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_events.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own dependent events"
    ON public.dependent_events
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_events.dependent_id
        AND dependents.user_id = auth.uid()
    ));

-- Create RLS policies for dependent expenses
ALTER TABLE public.dependent_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dependent expenses"
    ON public.dependent_expenses
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_expenses.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own dependent expenses"
    ON public.dependent_expenses
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_expenses.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own dependent expenses"
    ON public.dependent_expenses
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_expenses.dependent_id
        AND dependents.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own dependent expenses"
    ON public.dependent_expenses
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.dependents
        WHERE dependents.id = dependent_expenses.dependent_id
        AND dependents.user_id = auth.uid()
    ));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_dependents_updated_at
    BEFORE UPDATE ON public.dependents
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_dependent_events_updated_at
    BEFORE UPDATE ON public.dependent_events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_dependent_expenses_updated_at
    BEFORE UPDATE ON public.dependent_expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
