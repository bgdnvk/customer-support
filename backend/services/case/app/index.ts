import express, { Request, Response } from "express";
import { Pool } from "pg";
import { verifyAgent, verifyCustomer } from "./middleware";
import axios from "axios";
import { get } from "http";
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

app.get("/api/test", async (req: Request, res: Response) => {
    console.log("test hit");

    // const url = "http://localhost:5000/api/test";LB_AGENT_SERVICE_HOST
    const url = `http://${process.env.LB_AGENT_SERVICE_HOST}:${process.env.LB_AGENT_SERVICE_PORT}/api/agent/test`;
    console.log(url);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("token", token);
    const headers = {
        authorization: `bearer ${token}`,
    };

    try {
        const response = await axios.get(url, { headers });
        console.log(response.data);
        res.json(response.data);
    } catch (e) {
        console.log("err", e);
    }
});

// app.get("/api/test", async (req: Request, res: Response) => {
//   console.log("test hit");

//   const url = "http://localhost:5000/api/test";

//   const token = req.headers.authorization?.split(" ")[1];

//   console.log("token", token);
//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const options = {
//     headers,
//   };

//   const request = get(url, options, (response) => {
//     let data = "";

//     response.on("data", (chunk) => {
//       data += chunk;
//     });

//     response.on("end", () => {
//       console.log(data);
//       res.json(JSON.parse(data));
//     });
//   });

//   request.on("error", (error) => {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   });

//   request.end();
// });

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
// TODO:
app.post("/api/case", verifyCustomer, async (req: Request, res: Response) => {
    console.log("case hit");
    const { title, description, payload } = req.body;
    const user_id = payload.userId;
    try {
        const { rows } = await pool.query(
            "INSERT INTO cases (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, description, user_id]
        );

        //pass the case to /api/agent

        const url = `http://${process.env.LB_AGENT_SERVICE_HOST}:${process.env.LB_AGENT_SERVICE_PORT}/api/agent/case`;
        // const url = `http://${process.env.lb_agent_service_host}:${process.env.lb_agent_service_port}/api/agent/case`;
        console.log(url);

        const token = req.headers.authorization?.split(" ")[1];

        console.log("token", token);
        const headers = {
            authorization: `bearer ${token}`,
        };
        
        const myCase = rows[0]
        console.log('case is', myCase)
        const data = { case_id: myCase.id }

        const response = await axios.post(url, data, { headers });
        console.log(response.data);
        res.status(201).json(response.data);

        //return inserted case
        // res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update an existing case as an agent (resolve it basically)
app.put("/api/cases/:id", verifyAgent, async (req: Request, res: Response) => {
    const { id } = req.params;
    // const { title, description, resolved } = req.body;
    const { resolved } = req.body;
    try {
        // const { rows } = await pool.query(
        //     "UPDATE cases SET title = $1, description = $2, resolved = $3 WHERE id = $4 RETURNING *",
        //     [title, description, resolved, id]
        // );
        const { rows } = await pool.query(
            "UPDATE cases SET resolved = $1 WHERE id = $2 RETURNING *",
            [resolved, id]
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
