import express, { Request, Response } from "express";
import { Pool } from "pg";
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

// app.get("/api/agent/test", verifyCustomer, async (req, res) => {
//     res.send("Hello, World!");
// });

app.use(express.json());

// const pool = new Pool({
//     user: "admin",
//     host: process.env.POSTGRES_AGENT_SERVICE_HOST,
//     database: "postgres",
//     password: "password",
//     port: 5432,
// });

//get all cases as an agent
app.get("/api/agent/case", verifyAgent, getCases);

// app.get("/api/agent/case", verifyAgent, async (req: Request, res: Response) => {
//     console.log("cases GET");
//     try {
//         const cases = await pool.query("SELECT * FROM cases");
//         console.log("cases", cases);
//         console.log("cases rows", cases.rows);

//         if (cases.rows.length === 0 || !cases.rows) {
//             res.status(204).send();
//         }

//         const casesJSON: string | any = [];
//         for (let i = 0; i < cases.rows.length; i++) {
//             const case_id = cases.rows[i].case_id;
//             const title = cases.rows[i].title;
//             const description = cases.rows[i].description;
//             const agent_id = cases.rows[i].agent_id;
//             const customer_id = cases.rows[i].customer_id;

//             casesJSON.push({
//                 case_id,
//                 title,
//                 description,
//                 agent_id,
//                 customer_id,
//             });
//         }

//         res.status(200).json({ cases: casesJSON });
//     } catch (e) {
//         res.status(500).json({ message: "internal err" });
//     }
// });

app.get("/api/agent/case/resolved", verifyAgent, getResolvedCases);
//get all resolved cases as an agent
// app.get(
//     "/api/agent/case/resolved",
//     verifyAgent,
//     async (req: Request, res: Response) => {
//         console.log("resolved cases GET");
//         try {
//             const cases = await pool.query("SELECT * FROM resolved_cases");
//             console.log("cases", cases);
//             console.log("cases rows", cases.rows);

//             if (cases.rows.length === 0 || !cases.rows) {
//                 res.status(204).send();
//             }

//             const casesJSON: string | any = [];
//             for (let i = 0; i < cases.rows.length; i++) {
//                 const case_id = cases.rows[i].case_id;
//                 const title = cases.rows[i].title;
//                 const description = cases.rows[i].description;
//                 const agent_id = cases.rows[i].agent_id;
//                 const customer_id = cases.rows[i].customer_id;

//                 casesJSON.push({
//                     case_id,
//                     title,
//                     description,
//                     agent_id,
//                     customer_id,
//                 });
//             }

//             res.status(200).json({ cases: casesJSON });
//         } catch (e) {
//             res.status(500).json({ message: "err, couldn't get all cases" });
//         }
//     }
// );

// EXTERNAL endpoint
// With a new case an agent will be assigned
// the call comes from the customer service that adds a case
app.post("/api/agent/case", verifyCustomer, createCase);

// EXTERNAL endpoint
// With a new case an agent will be assigned
// the call comes from the customer service that adds a case
// app.post(
//     "/api/agent/case",
//     verifyCustomer,
//     async (req: Request, res: Response) => {
//         const { case_id, title, description, customer_id } = req.body;
//         //https://node-postgres.com/features/transactions#asyncawait
//         const client = await pool.connect();

//         try {
//             // Start a transaction
//             await client.query("BEGIN");

//             // Find the oldest added agent
//             const result = await client.query(`
//       SELECT agent_id
//       FROM available_agents
//       ORDER BY added_at ASC
//       LIMIT 1
//     `);

//             //TODO: handle no agents available
//             const { agent_id } = result.rows[0];

//             // If agent_id is undefined, throw an error
//             if (!agent_id) {
//                 throw new Error("No agents available_agents");
//             }

//             // Delete the agent from the available_agents table
//             await client.query(
//                 `
//       DELETE FROM available_agents
//       WHERE agent_id = $1
//     `,
//                 [agent_id]
//             );

//             // Add the case to the cases table
//             await client.query(
//                 `
//       INSERT INTO cases (case_id, agent_id, title, description, customer_id)
//       VALUES ($1, $2, $3, $4, $5)
//     `,
//                 [case_id, agent_id, title, description, customer_id]
//             );

//             // Commit the transaction
//             await client.query("COMMIT");

//             res.status(200).send(
//                 `Case ${case_id} assigned to agent ${agent_id}`
//             );
//         } catch (err) {
//             // Rollback the transaction on error
//             await client.query("ROLLBACK");
//             console.error(err);
//             res.status(500).send("Error assigning case");
//         } finally {
//             if (client) {
//                 client.release();
//             }
//         }
//     }
// );

//delete case aka put it as resolved
app.delete("/api/agent/case/:caseId", verifyAgent, deleteCase);

//delete case aka put it as resolved
// app.delete(
//     "/api/agent/case/:caseId",
//     verifyAgent,
//     async (req: Request, res: Response) => {
//         const { caseId } = req.params;

//         const client = await pool.connect();

//         try {
//             await client.query("BEGIN");

//             const result = await client.query(
//                 `
//         SELECT *
//         FROM cases
//         WHERE case_id = $1
//       `,
//                 [caseId]
//             );

//             // get the case info
//             const { case_id, title, description, customer_id, agent_id } =
//                 result.rows[0];

//             //delete from the on going cases
//             await client.query(
//                 `
//         DELETE FROM cases
//         WHERE case_id = $1
//       `,
//                 [caseId]
//             );

//             // insert into resolved cases
//             await client.query(
//                 `INSERT INTO resolved_cases (case_id, title, description, customer_id, agent_id)
//                 VALUES ($1, $2, $3, $4, $5)`,
//                 [case_id, title, description, customer_id, agent_id]
//             );

//             //return the agent back into the db of available agents
//             await client.query(
//                 `
//         INSERT INTO available_agents (agent_id)
//         VALUES ($1)
//       `,
//                 [agent_id]
//             );

//             await client.query("COMMIT");

//             res.status(204).json({ message: `deleted ${caseId}` });
//         } catch (err) {
//             await client.query("ROLLBACK");
//             console.error(err);
//             throw new Error(`Failed to remove ${caseId}`);
//         } finally {
//             if (client) {
//                 client.release();
//             }
//         }
//     }
// );

// EXTERNAL endpoint
// when a new user is registered with the role of agent it gets called
// create agent and make the agent available_agents
app.post("/api/agent/agents", createAgent);
// EXTERNAL endpoint
// when a new user is registered with the role of agent it gets called
// create agent and make the agent available_agents
// app.post("/api/agent/agents", async (req: Request, res: Response) => {
//     console.log("api agent hit");
//     const { user_id, name, title, description } = req.body;

//     console.log("user id", user_id);
//     try {
//         const agentResult = await pool.query(
//             "INSERT INTO agents (user_id, name, title, description) VALUES ($1, $2, $3, $4) RETURNING id",
//             [user_id, name, title, description]
//         );

//         const agentId = agentResult.rows[0].id;

//         await pool.query(
//             "INSERT INTO available_agents (agent_id) VALUES ($1)",
//             [agentId]
//         );

//         res.status(201).json({ message: "Agent created successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

app.put("/api/agent/agents/:id", editAgent);
// Edit agent
// app.put(
//     "/api/agent/agents/:id",
//     verifyAdmin,
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const { name, title, description } = req.body;

//         try {
//             const result = await pool.query(
//                 "UPDATE agents SET name = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
//                 [name, title, description, id]
//             );

//             if (result.rowCount === 0) {
//                 res.status(404).json({ message: "Agent not found" });
//             } else {
//                 res.json(result.rows[0]);
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }
// );

app.delete("/api/agent/agents/:id", verifyAdmin, removeAgent);

// Remove agent
// app.delete(
//     "/api/agent/agents/:id",
//     verifyAdmin,
//     async (req: Request, res: Response) => {
//         const { id } = req.params;

//         try {
//             //make sure to delete only when agent doesn't have assigned cases
//             const caseAgent = await pool.query(
//                 "SELECT * FROM cases WHERE agent_id=$1",
//                 [id]
//             );

//             if (caseAgent.rowCount >= 1) {
//                 res.status(403).json({
//                     message: "this agent is assigned to a case",
//                 });
//             } else {
//                 const result = await pool.query(
//                     "DELETE FROM agents WHERE id = $1 RETURNING *",
//                     [id]
//                 );

//                 if (result.rowCount === 0) {
//                     res.status(404).json({
//                         message: "Agent not found",
//                     });
//                 }
//                 //deleted successfully
//                 res.status(204);
//             }
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "Internal server error" });
//         }
//     }
// );

app.get("/api/agent/agents", getAgents);
// get agents as admin
// app.get(
//     "/api/agent/agents",
//     verifyAdmin,
//     async (req: Request, res: Response) => {
//         try {
//             const agents = await pool.query("SELECT * FROM agents");
//             res.json({ agents: agents.rows });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: "couldn't get agents" });
//         }
//     }
// );

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
