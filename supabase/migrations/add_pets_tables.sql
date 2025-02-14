-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.pet_expenses CASCADE;
DROP TABLE IF EXISTS public.pet_events CASCADE;
DROP TABLE IF EXISTS public.pets CASCADE;

-- Create pets table
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
    breed TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0),
    next_vaccine DATE,
    vaccine_type TEXT CHECK (vaccine_type IN ('v8', 'antirrabica', 'giardia', 'gripe', 'leucemia', 'outra')),
    vaccine_notes TEXT,
    next_grooming DATE,
    grooming_type TEXT CHECK (grooming_type IN ('basic', 'complete', 'spa')),
    grooming_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create pet events table (for future events like vet appointments, etc)
CREATE TABLE IF NOT EXISTS public.pet_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('vaccine', 'grooming', 'vet', 'other')),
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create pet expenses table
CREATE TABLE IF NOT EXISTS public.pet_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('food', 'vet', 'medicine', 'grooming', 'other')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies for pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pets"
    ON public.pets
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets"
    ON public.pets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets"
    ON public.pets
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets"
    ON public.pets
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS policies for pet events
ALTER TABLE public.pet_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pet events"
    ON public.pet_events
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own pet events"
    ON public.pet_events
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own pet events"
    ON public.pet_events
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_events.pet_id
        AND pets.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_events.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own pet events"
    ON public.pet_events
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_events.pet_id
        AND pets.user_id = auth.uid()
    ));

-- Create RLS policies for pet expenses
ALTER TABLE public.pet_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pet expenses"
    ON public.pet_expenses
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_expenses.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own pet expenses"
    ON public.pet_expenses
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_expenses.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their own pet expenses"
    ON public.pet_expenses
    FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_expenses.pet_id
        AND pets.user_id = auth.uid()
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_expenses.pet_id
        AND pets.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their own pet expenses"
    ON public.pet_expenses
    FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.pets
        WHERE pets.id = pet_expenses.pet_id
        AND pets.user_id = auth.uid()
    ));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_pet_events_updated_at
    BEFORE UPDATE ON public.pet_events
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_pet_expenses_updated_at
    BEFORE UPDATE ON public.pet_expenses
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
