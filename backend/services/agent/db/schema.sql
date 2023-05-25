CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  UNIQUE (user_id)
);

CREATE TABLE available_agents (
  agent_id INTEGER REFERENCES agents(id),
  added_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cases (
  case_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  customer_id INTEGER,
  agent_id INTEGER REFERENCES agents(id)
);

CREATE TABLE resolved_cases (
  case_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR(255),
  customer_id INTEGER,
  agent_id INTEGER REFERENCES agents(id)
)