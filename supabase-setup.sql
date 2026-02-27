-- CREATE THE HABITS TABLE
CREATE TABLE IF NOT EXISTS habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  goal INTEGER DEFAULT 10,
  color TEXT DEFAULT '#4ade80', -- The color for the checkbox ('#4ade80' for green, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- CREATE THE HABIT LOGS TABLE FOR DAILY TRACKING
CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  UNIQUE(habit_id, completed_date) -- Prevents duplicate logs for the same day
);

-- ENABLE ROW LEVEL SECURITY FOR SECURITY
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- CLEAR EXISTING POLICIES (if ran multiple times)
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

DROP POLICY IF EXISTS "Users can view their own logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can insert their own logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can update their own logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can delete their own logs" ON habit_logs;

-- HABITS POLICIES
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- HABIT LOGS POLICIES
CREATE POLICY "Users can view their own logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);
