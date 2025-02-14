-- Enable RLS
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy for inserting debts (users can only insert their own debts)
CREATE POLICY "Users can insert their own debts"
ON debts FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for selecting debts (users can only view their own debts)
CREATE POLICY "Users can view their own debts"
ON debts FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy for updating debts (users can only update their own debts)
CREATE POLICY "Users can update their own debts"
ON debts FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for deleting debts (users can only delete their own debts)
CREATE POLICY "Users can delete their own debts"
ON debts FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);
