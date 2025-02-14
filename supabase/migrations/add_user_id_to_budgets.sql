-- Adicionar coluna user_id
ALTER TABLE budgets
ADD COLUMN IF NOT EXISTS user_id UUID NOT NULL DEFAULT auth.uid();

-- Adicionar constraint de chave estrangeira
ALTER TABLE budgets
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) 
REFERENCES auth.users (id);
