-- Backup dos dados existentes
CREATE TABLE budgets_backup AS SELECT * FROM budgets;

-- Atualizar a tabela budgets
ALTER TABLE budgets
DROP COLUMN category,
DROP COLUMN amount,
DROP COLUMN spent,
DROP COLUMN period,
DROP COLUMN year,
DROP COLUMN month;

ALTER TABLE budgets
ADD COLUMN name TEXT NOT NULL,
ADD COLUMN planned DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN actual DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN color TEXT NOT NULL DEFAULT 'bg-blue-500';

-- Migrar dados do backup
INSERT INTO budgets (id, name, planned, actual, color)
SELECT 
  id,
  category as name,
  amount as planned,
  spent as actual,
  'bg-blue-500' as color
FROM budgets_backup;

-- Remover tabela de backup
DROP TABLE budgets_backup;
