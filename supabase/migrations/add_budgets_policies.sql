-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios orçamentos" ON budgets;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios orçamentos" ON budgets;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios orçamentos" ON budgets;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios orçamentos" ON budgets;

-- Habilitar RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Usuários podem ver seus próprios orçamentos"
ON budgets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios orçamentos"
ON budgets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios orçamentos"
ON budgets FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios orçamentos"
ON budgets FOR DELETE
USING (auth.uid() = user_id);
