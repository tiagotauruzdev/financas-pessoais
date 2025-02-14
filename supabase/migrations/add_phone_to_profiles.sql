-- Adicionar coluna phone à tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT;
