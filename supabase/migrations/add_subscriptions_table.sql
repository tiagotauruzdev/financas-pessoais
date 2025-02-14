-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  price NUMERIC(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb
);

-- Create RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- Create function to add default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (
    user_id,
    plan_type,
    status,
    start_date,
    end_date,
    price,
    features
  ) VALUES (
    NEW.id,
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
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to add default subscription when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Add subscriptions for existing users
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
