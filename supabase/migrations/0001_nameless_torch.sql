/*
  # Initial Schema Setup for Assignment Management System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
    
    - `regular_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `date_of_birth` (date)
      - `phone` (text)
      - `email` (text)
      - `created_at` (timestamp)
    
    - `assignments`
      - `id` (uuid, primary key)
      - `assignment_id` (text, unique)
      - `pdf_path` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references admin_users)
    
    - `user_assignments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references regular_users)
      - `assignment_id` (uuid, references assignments)
      - `status` (text)
      - `score` (integer)
      - `score_status` (text)
      - `content` (text)
      - `last_saved` (timestamp)
      - `submitted_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin and regular users
*/

-- Create admin_users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create regular_users table
CREATE TABLE regular_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  date_of_birth date NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create assignments table
CREATE TABLE assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id text UNIQUE NOT NULL,
  pdf_path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admin_users(id)
);

-- Create user_assignments table
CREATE TABLE user_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES regular_users(id),
  assignment_id uuid REFERENCES assignments(id),
  status text NOT NULL DEFAULT 'pending',
  score integer,
  score_status text NOT NULL DEFAULT 'pending',
  content text,
  last_saved timestamptz DEFAULT now(),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT score_range CHECK (score >= 0 AND score <= 100)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE regular_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assignments ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admin can manage all users"
  ON regular_users
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can manage all assignments"
  ON assignments
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admin can manage all user assignments"
  ON user_assignments
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Regular user policies
CREATE POLICY "Users can view their own data"
  ON regular_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view assigned assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_assignments ua 
    WHERE ua.assignment_id = assignments.id 
    AND ua.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own assignments"
  ON user_assignments
  TO authenticated
  USING (user_id = auth.uid());