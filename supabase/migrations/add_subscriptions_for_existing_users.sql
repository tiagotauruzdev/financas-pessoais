-- Add subscriptions for existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id 
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 
      FROM subscriptions s 
      WHERE s.user_id = u.id
    )
  LOOP
    INSERT INTO subscriptions (
      user_id,
      plan_type,
      status,
      start_date,
      end_date,
      price,
      features
    ) VALUES (
      user_record.id,
      'basic',
      'active',
      TIMEZONE('utc'::text, NOW()),
      TIMEZONE('utc'::text, NOW() + INTERVAL '1 month'),
      29.90,
      '[
        "Controle de gastos ilimitado",
        "Gestão de investimentos",
        "Gestão de dívidas",
        "Metas financeiras",
        "Relatórios básicos"
      ]'::jsonb
    );
  END LOOP;
END;
$$;
