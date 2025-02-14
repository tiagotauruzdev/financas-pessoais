-- Remover usuário de teste existente
DELETE FROM auth.users WHERE email = 'teste@exemplo.com';
DELETE FROM public.profiles WHERE username = 'usuario_teste';

-- Criar novo usuário de teste com credenciais atualizadas
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  'authenticated',
  'authenticated',
  'financas@teste.com',
  crypt('Financas@2024', gen_salt('bf')),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Usuário Sistema"}',
  now(),
  now(),
  '',
  ''
);

-- Inserir novo perfil
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
VALUES (
  'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  'sistema',
  'Usuário Sistema',
  'https://api.dicebear.com/6.x/avataaars/svg?seed=sistema',
  1,
  0,
  now(),
  now()
);
