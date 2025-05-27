/*
  # Add messaging tables and functions

  1. New Tables
    - `chat_threads`
      - `id` (uuid, primary key)
      - `item_id` (uuid, nullable) - For marketplace items
      - `post_id` (uuid, nullable) - For community posts
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `chat_participants`
      - `thread_id` (uuid)
      - `user_id` (uuid)
      - `last_read_at` (timestamptz)
      - `joined_at` (timestamptz)
      
    - `messages`
      - `id` (uuid, primary key)
      - `thread_id` (uuid)
      - `sender_id` (uuid)
      - `content` (text)
      - `created_at` (timestamptz)
      - `is_seen` (boolean)
      - `seen_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for chat access and message creation
*/

-- Create chat_threads table
CREATE TABLE IF NOT EXISTS chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES marketplace_items(id) ON DELETE CASCADE,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT thread_context_check CHECK (
    (item_id IS NOT NULL AND post_id IS NULL) OR
    (item_id IS NULL AND post_id IS NOT NULL)
  )
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  thread_id uuid REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at timestamptz DEFAULT now(),
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (thread_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_seen boolean DEFAULT false,
  seen_at timestamptz,
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Enable RLS
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat_threads
CREATE POLICY "Users can view threads they participate in"
  ON chat_threads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE thread_id = chat_threads.id
      AND user_id = auth.uid()
    )
  );

-- Policies for chat_participants
CREATE POLICY "Users can view participants in their threads"
  ON chat_participants
  FOR SELECT
  USING (
    thread_id IN (
      SELECT thread_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

-- Policies for messages
CREATE POLICY "Users can view messages in their threads"
  ON messages
  FOR SELECT
  USING (
    thread_id IN (
      SELECT thread_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their threads"
  ON messages
  FOR INSERT
  WITH CHECK (
    thread_id IN (
      SELECT thread_id FROM chat_participants
      WHERE user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Function to update thread's updated_at timestamp
CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_threads
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update thread timestamp on new message
CREATE TRIGGER update_thread_timestamp
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_thread_timestamp();