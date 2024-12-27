/*
  # Update admin users table

  1. Changes
    - Add username and email columns to admin_users table
    - Make username and email required
    - Add unique constraints
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to admin_users
ALTER TABLE admin_users 
ADD COLUMN username text NOT NULL,
ADD COLUMN email text NOT NULL;

-- Add unique constraints
ALTER TABLE admin_users
ADD CONSTRAINT admin_users_username_key UNIQUE (username),
ADD CONSTRAINT admin_users_email_key UNIQUE (email);