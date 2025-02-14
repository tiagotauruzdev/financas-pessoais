-- Criar o bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Avatar Upload Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Public Read Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Update Policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Delete Policy" ON storage.objects;

-- Criar política de armazenamento para permitir upload de avatares
CREATE POLICY "Avatar Upload Policy" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

-- Criar política de armazenamento para permitir leitura pública de avatares
CREATE POLICY "Avatar Public Read Policy" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Criar política de armazenamento para permitir que usuários atualizem seus próprios avatares
CREATE POLICY "Avatar Update Policy" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Criar política de armazenamento para permitir que usuários excluam seus próprios avatares
CREATE POLICY "Avatar Delete Policy" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
