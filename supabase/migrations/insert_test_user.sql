-- Inserir usuário de teste na tabela auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'teste@exemplo.com',
  crypt('Teste@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Usuário de Teste"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Inserir perfil do usuário na tabela public.profiles
INSERT INTO public.profiles (
  id,
  username,
  full_name,
  avatar_url,
  level,
  xp,
  created_at,
  updated_at
)
SELECT 
  id,
  'usuario_teste',
  'Usuário de Teste',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=teste',
  1,
  0,
  now(),
  now()
FROM auth.users
WHERE email = 'teste@exemplo.com';
