-- Drop subject column from lectures table
ALTER TABLE lectures DROP COLUMN IF EXISTS subject;

-- Drop subject index if exists
DROP INDEX IF EXISTS idx_lectures_subject;
