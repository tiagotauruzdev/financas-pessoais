-- Políticas para a tabela debts
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Política para visualização (SELECT)
CREATE POLICY "Users can view their own debts"
ON debts FOR SELECT
USING (auth.uid() = user_id);

-- Política para inserção (INSERT)
CREATE POLICY "Users can create their own debts"
ON debts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para atualização (UPDATE)
CREATE POLICY "Users can update their own debts"
ON debts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para exclusão (DELETE)
CREATE POLICY "Users can delete their own debts"
ON debts FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_debts_updated_at
    BEFORE UPDATE ON debts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
