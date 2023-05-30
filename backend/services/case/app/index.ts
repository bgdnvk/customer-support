import express, { Request, Response } from "express";
import { Pool } from "pg";
import { verifyAgent, verifyCustomer } from "./middleware";
import axios from "axios";
import cors from "cors";

const pool = new Pool({
    user: "admin",
    host: process.env.POSTGRES_CASE_SERVICE_HOST,
    database: "postgres",
    password: "password",
    port: 5432,
});

const app = express();
app.use(cors());
app.use(express.json());

// Get all cases as an agent
app.get("/api/case", verifyAgent, async (req: Request, res: Response) => {
    try {
        const { rows } = await pool.query("SELECT * FROM cases");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new case as a customer
app.post("/api/case", verifyCustomer, async (req: Request, res: Response) => {
    console.log("case hit");
    const { title, description, payload } = req.body;
    const user_id = payload.userId;
    try {
        const { rows } = await pool.query(
            "INSERT INTO cases (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description, user_id]
        );

        const url = `http://${process.env.LB_AGENT_SERVICE_HOST}:${process.env.LB_AGENT_SERVICE_PORT}/api/agent/case`;
        const token = req.headers.authorization?.split(" ")[1];

        console.log("token", token);
        const headers = {
            authorization: `bearer ${token}`,
        };

        const myCase = rows[0];
        console.log("case is", myCase);
        const data = {
            case_id: myCase.id,
            title: myCase.title,
            description: myCase.description,
            customer_id: myCase.user_id,
        };

        const response = await axios.post(url, data, { headers });
        console.log(response.data);
        res.status(201).json(response.data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not assign a case" });
    }
});

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
