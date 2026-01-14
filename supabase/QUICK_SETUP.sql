-- ========================================
-- הרצה מהירה - העתק והדבק את כל הקובץ הזה ב-Supabase SQL Editor
-- ========================================

-- שלב 1: יצירת הטבלאות
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Financial Items Table
CREATE TABLE IF NOT EXISTS financial_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  product_type TEXT,
  value NUMERIC(15, 2) DEFAULT 0,
  category TEXT NOT NULL CHECK (category IN ('finance', 'insurance', 'investments', 'assets', 'documents')),
  subcategory TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'expired')),
  expiry_date DATE,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('urgent', 'warning', 'info')),
  category TEXT NOT NULL CHECK (category IN ('insurance', 'document', 'subscription', 'investment', 'finance')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('finance', 'insurance', 'investments', 'assets', 'documents')),
  file_url TEXT,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Permissions Table (for sharing)
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shared_with_user_id)
);

-- Pending Invitations Table (for users who haven't logged in yet)
CREATE TABLE IF NOT EXISTS pending_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  permission_type TEXT NOT NULL CHECK (permission_type IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, invited_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_financial_items_user_id ON financial_items(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_items_category ON financial_items(category);
CREATE INDEX IF NOT EXISTS idx_financial_items_subcategory ON financial_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_shared_with ON user_permissions(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_pending_invitations_user_id ON pending_invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_invitations_email ON pending_invitations(invited_email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_financial_items_updated_at ON financial_items;
CREATE TRIGGER update_financial_items_updated_at
  BEFORE UPDATE ON financial_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alerts_updated_at ON alerts;
CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_permissions_updated_at ON user_permissions;
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- שלב 2: הפעלת RLS
ALTER TABLE financial_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invitations ENABLE ROW LEVEL SECURITY;

-- שלב 3: יצירת מדיניות RLS

-- Financial Items Policies
DROP POLICY IF EXISTS "Users can view own financial items" ON financial_items;
CREATE POLICY "Users can view own financial items"
  ON financial_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared users can view financial items" ON financial_items;
CREATE POLICY "Shared users can view financial items"
  ON financial_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = financial_items.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor', 'viewer')
    )
  );

DROP POLICY IF EXISTS "Users can insert own financial items" ON financial_items;
CREATE POLICY "Users can insert own financial items"
  ON financial_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared editors can insert financial items" ON financial_items;
CREATE POLICY "Shared editors can insert financial items"
  ON financial_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = financial_items.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can update own financial items" ON financial_items;
CREATE POLICY "Users can update own financial items"
  ON financial_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared editors can update financial items" ON financial_items;
CREATE POLICY "Shared editors can update financial items"
  ON financial_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = financial_items.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can delete own financial items" ON financial_items;
CREATE POLICY "Users can delete own financial items"
  ON financial_items FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete shared financial items" ON financial_items;
CREATE POLICY "Admins can delete shared financial items"
  ON financial_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = financial_items.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type = 'admin'
    )
  );

-- Alerts Policies
DROP POLICY IF EXISTS "Users can view own alerts" ON alerts;
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared users can view alerts" ON alerts;
CREATE POLICY "Shared users can view alerts"
  ON alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = alerts.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor', 'viewer')
    )
  );

DROP POLICY IF EXISTS "Users can insert own alerts" ON alerts;
CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own alerts" ON alerts;
CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared editors can update alerts" ON alerts;
CREATE POLICY "Shared editors can update alerts"
  ON alerts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = alerts.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor')
    )
  );

-- Documents Policies
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared users can view documents" ON documents;
CREATE POLICY "Shared users can view documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = documents.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor', 'viewer')
    )
  );

DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Shared editors can insert documents" ON documents;
CREATE POLICY "Shared editors can insert documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_permissions.user_id = documents.user_id
      AND user_permissions.shared_with_user_id = auth.uid()
      AND user_permissions.permission_type IN ('admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can update own documents" ON documents;
CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- User Permissions Policies
DROP POLICY IF EXISTS "Users can view own permissions" ON user_permissions;
CREATE POLICY "Users can view own permissions"
  ON user_permissions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = shared_with_user_id);

DROP POLICY IF EXISTS "Users can insert permissions" ON user_permissions;
CREATE POLICY "Users can insert permissions"
  ON user_permissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own permissions" ON user_permissions;
CREATE POLICY "Users can update own permissions"
  ON user_permissions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own permissions" ON user_permissions;
CREATE POLICY "Users can delete own permissions"
  ON user_permissions FOR DELETE
  USING (auth.uid() = user_id);

-- Pending Invitations Policies
DROP POLICY IF EXISTS "Users can view own invitations" ON pending_invitations;
CREATE POLICY "Users can view own invitations"
  ON pending_invitations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert invitations" ON pending_invitations;
CREATE POLICY "Users can insert invitations"
  ON pending_invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own invitations" ON pending_invitations;
CREATE POLICY "Users can delete own invitations"
  ON pending_invitations FOR DELETE
  USING (auth.uid() = user_id);

-- הצלחה! עכשיו בדוק שהכל עבד:
SELECT 'Tables created successfully!' as message;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
