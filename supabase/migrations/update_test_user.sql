-- Atualizar a senha do usuário existente
UPDATE auth.users
SET 
  encrypted_password = crypt('Teste@123', gen_salt('bf')),
  updated_at = now(),
  last_sign_in_at = now()
WHERE email = 'teste@exemplo.com';

-- Atualizar ou inserir o perfil do usuário
INSERT INTO public.profiles (
  id,
  name,
  email,
  avatar_url,
  level,
  xp,
  created_at,
  updated_at
)
SELECT 
  id,
  'Usuário de Teste',
  'teste@exemplo.com',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=teste',
  1,
  0,
  now(),
  now()
FROM auth.users
WHERE email = 'teste@exemplo.com'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = now();
