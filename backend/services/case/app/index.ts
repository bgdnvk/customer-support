import express, { Request, Response } from "express";
import { Pool } from "pg";
import { verifyAgent, verifyCustomer } from "./middleware";

const pool = new Pool({
    user: "admin",
    host: process.env.POSTGRES_CASE_SERVICE_HOST,
    database: "postgres",
    password: "password",
    port: 5432,
});

const app = express();
app.use(express.json());

// Get all cases as an agent
app.get("/api/cases", verifyAgent, async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query("SELECT * FROM cases");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a single case by ID
// app.get("/cases/:id", async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const { rows } = await pool.query("SELECT * FROM cases WHERE id = $1", [
//             id,
//         ]);
//         if (rows.length === 0) {
//             res.status(404).json({ error: "Case not found" });
//         } else {
//             res.json(rows[0]);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// Create a new case as a customer
app.post("/api/cases", verifyCustomer, async (req: Request, res: Response) => {
    //TODO: add user_id in req from middleware
    const { title, description, payload } = req.body;
    const user_id = payload.userId;
    try {
        const { rows } = await pool.query(
            "INSERT INTO cases (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description, user_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an existing case as an agent (resolve it basically)
app.put("/cases/:id", verifyAgent, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, resolved } = req.body;
    try {
        const { rows } = await pool.query(
            "UPDATE cases SET title = $1, description = $2, resolved = $3 WHERE id = $4 RETURNING *",
            [title, description, resolved, id]
        );
        if (rows.length === 0) {
            res.status(404).json({ error: "Case not found" });
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a case by ID
// app.delete("/cases/:id", async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const { rows } = await pool.query(
//             "DELETE FROM cases WHERE id = $1 RETURNING *",
//             [id]
//         );
//         if (rows.length === 0) {
//             res.status(404).json({ error: "Case not found" });
//         } else {
//             res.json(rows[0]);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
