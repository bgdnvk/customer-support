import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { verifyAdmin, verifyAgent, verifyCustomer } from "./middleware";
import {
    createCase,
    deleteCase,
    getCases,
    getResolvedCases,
} from "./controllers/caseController";
import {
    createAgent,
    editAgent,
    getAgents,
    removeAgent,
} from "./controllers/agentController";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//get all cases as an agent
app.get("/api/agent/case", verifyAgent, getCases);

//get all resolved cases as an agent
app.get("/api/agent/case/resolved", verifyAgent, getResolvedCases);

// EXTERNAL endpoint
// With a new case an agent will be assigned
// the call comes from the customer service that adds a case
app.post("/api/agent/case", verifyCustomer, createCase);

//delete case aka put it as resolved
app.delete("/api/agent/case/:caseId", verifyAgent, deleteCase);

// EXTERNAL endpoint
// when a new user is registered with the role of agent it gets called
// create agent and make the agent available_agents
app.post("/api/agent/agents", createAgent);

// Edit agent
app.put("/api/agent/agents/:id", editAgent);

// Remove agent
app.delete("/api/agent/agents/:id", verifyAdmin, removeAgent);

// get agents as admin
app.get("/api/agent/agents", getAgents);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
