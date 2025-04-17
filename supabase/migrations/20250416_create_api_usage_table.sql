-- Create API usage tracking table
-- This table tracks daily API usage for each user

-- Create the api_usage table
CREATE TABLE IF NOT EXISTS api_usage (
  -- Unique identifier for each usage record
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User ID (foreign key to auth.users)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Date of usage (YYYY-MM-DD format)
  date DATE NOT NULL,
  
  -- Count of API calls for this user on this date
  count INTEGER NOT NULL DEFAULT 1,
  
  -- When the record was created
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- When the record was last updated
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint to ensure one record per user per day
  UNIQUE(user_id, date)
);

-- Create an index for faster lookups by user_id and date
CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON api_usage(user_id, date);

-- Add RLS (Row Level Security) policies
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read only their own usage data
CREATE POLICY "Users can view their own usage data"
  ON api_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow the service role to manage all usage data
CREATE POLICY "Service role can manage all usage data"
  ON api_usage
  USING (auth.role() = 'service_role');

-- Add comment to the table
COMMENT ON TABLE api_usage IS 'Tracks API usage per user per day for subscription plan limits';
