-- CREATE TABLE cases (
--   id SERIAL PRIMARY KEY,
--   title VARCHAR(255) NOT NULL,
--   description TEXT,
--   resolved BOOLEAN DEFAULT FALSE,
--   user_id INTEGER NOT NULL,
--   created_at TIMESTAMP DEFAULT NOW()
-- );

CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_agent_id UNIQUE (agent_id)
);