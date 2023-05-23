import express, { Request, Response } from "express";
import { Pool } from "pg";
import cors from "cors";
import dotenv from "dotenv";
import { verifyAgent, verifyCustomer } from "./middleware";

dotenv.config();

const app = express();

app.use(cors());

app.get("/api/agent/test", verifyCustomer, async (req, res) => {
    res.send("Hello, World!");
});

app.use(express.json());

const pool = new Pool({
    user: "admin",
    host: process.env.POSTGRES_AGENT_SERVICE_HOST,
    database: "postgres",
    password: "password",
    port: 5432,
});

// With a new case an agent will be assigned
app.post("/api/agent/case", async (req: Request, res: Response) => {
    const { case_id } = req.body;
    //https://node-postgres.com/features/transactions#asyncawait
    const client = await pool.connect();

    try {
        // Start a transaction
        await client.query("BEGIN");

        // Find the oldest added agent
        const result = await client.query(`
      SELECT agent_id
      FROM available
      ORDER BY added_at ASC
      LIMIT 1
    `);

        const { agent_id } = result.rows[0];

        // Delete the agent from the available table
        await client.query(
            `
      DELETE FROM available
      WHERE agent_id = $1
    `,
            [agent_id]
        );

        // Add the case to the cases table
        await client.query(
            `
      INSERT INTO cases (case_id, agent_id)
      VALUES ($1, $2)
    `,
            [case_id, agent_id]
        );

        // Commit the transaction
        await client.query("COMMIT");

        res.status(200).send(`Case ${case_id} assigned to agent ${agent_id}`);
    } catch (err) {
        // Rollback the transaction on error
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).send("Error assigning case");
    } finally {
        if (client) {
            client.release();
        }
    }
});

// create agent and make the agent available
app.post("/api/agent/create", verifyAgent, async (req: Request, res: Response) => {
    const { user_id, username, name, title, description } = req.body;

    try {
        const agentResult = await pool.query(
            "INSERT INTO agents (user_id, username, name, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [user_id, username, name, title, description]
        );

        const agentId = agentResult.rows[0].id;

        await pool.query("INSERT INTO available (agent_id) VALUES ($1)", [
            agentId,
        ]);

        res.status(201).json({ message: "Agent created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add agent
// app.post("/api/agent/new", verifyAgent, async (req: Request, res: Response) => {
//     const { user_id, username, name, title, description } = req.body;

//     try {
//         const result = await pool.query(
//             "INSERT INTO agents (user_id, username, name, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//             [user_id, username, name, title, description]
//         );

//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });

// Edit agent
app.put("/api/agent/agents/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, username, name, title, description } = req.body;

    try {
        const result = await pool.query(
            "UPDATE agents SET user_id = $1, username = $2, name = $3, title = $4, description = $5 WHERE id = $6 RETURNING *",
            [user_id, username, name, title, description, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Agent not found" });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove agent
app.delete("/api/agent/agents/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM agents WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Agent not found" });
        } else {
            res.json({ message: "Agent deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
