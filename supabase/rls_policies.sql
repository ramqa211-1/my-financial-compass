-- Enable Row Level Security on all tables
ALTER TABLE financial_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invitations ENABLE ROW LEVEL SECURITY;

-- Financial Items Policies
-- Users can view their own items
CREATE POLICY "Users can view own financial items"
  ON financial_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users with editor/admin permissions can view shared items
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

-- Users can insert their own items
CREATE POLICY "Users can insert own financial items"
  ON financial_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users with editor/admin permissions can insert items for shared user
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

-- Users can update their own items
CREATE POLICY "Users can update own financial items"
  ON financial_items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users with editor/admin permissions can update shared items
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

-- Users can delete their own items
CREATE POLICY "Users can delete own financial items"
  ON financial_items FOR DELETE
  USING (auth.uid() = user_id);

-- Only admins can delete shared items
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
-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Shared users can view alerts
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

-- Users can insert their own alerts
CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own alerts
CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Shared editors can update alerts
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
-- Users can view their own documents
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

-- Shared users can view documents
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

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Shared editors can insert documents
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

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- User Permissions Policies
-- Users can view permissions where they are the owner or shared user
CREATE POLICY "Users can view own permissions"
  ON user_permissions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = shared_with_user_id);

-- Users can insert permissions (share with others)
CREATE POLICY "Users can insert permissions"
  ON user_permissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update permissions they own
CREATE POLICY "Users can update own permissions"
  ON user_permissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete permissions they own
CREATE POLICY "Users can delete own permissions"
  ON user_permissions FOR DELETE
  USING (auth.uid() = user_id);

-- Pending Invitations Policies
-- Users can view invitations they created
CREATE POLICY "Users can view own invitations"
  ON pending_invitations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert invitations
CREATE POLICY "Users can insert invitations"
  ON pending_invitations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete invitations they created
CREATE POLICY "Users can delete own invitations"
  ON pending_invitations FOR DELETE
  USING (auth.uid() = user_id);
