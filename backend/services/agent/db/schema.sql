CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  username VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  UNIQUE (user_id, username)
);

CREATE TABLE available (
  agent_id INTEGER REFERENCES agents(id),
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cases (
  case_id SERIAL PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(id)
);