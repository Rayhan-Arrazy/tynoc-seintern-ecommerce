-- Add password column to users table for auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS password text;

-- Update the demo user to include password
UPDATE users SET password = 'password123' WHERE email = 'demo@example.com';
