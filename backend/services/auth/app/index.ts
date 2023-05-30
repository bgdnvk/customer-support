import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

console.log("JWT secret", process.env.JWT_SECRET);
console.log("postgres service host", process.env.POSTGRES_SERVICE_HOST);

// Create a PostgreSQL pool
const pool = new Pool({
    user: "admin",
    host: process.env.POSTGRES_SERVICE_HOST,
    database: "postgres",
    password: "password",
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Register a new user
app.post("/api/register", async (req: Request, res: Response) => {
    console.log("register hit");
    console.log("red body", req.body);
    try {
        const { username, password, role } = req.body;

        // Check if username already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id",
            [username, hashedPassword, role]
        );

        // transform this into an event
        // if the user is an agent then call the agent service
        if (role === "agent") {
            const url = `http://${process.env.LB_AGENT_SERVICE_HOST}:${process.env.LB_AGENT_SERVICE_PORT}/api/agent/agents`;
            console.log("user is agent");
            const userId = newUser.rows[0].id;
            const data = { user_id: userId };
            const response = await axios.post(url, data);
            console.log("res from agent", response);
            res.status(201).json({ message: "Agend added" });
        } else {
            //for any other type of user
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// User login
app.post("/api/login", async (req: Request, res: Response) => {
    console.log("login hit");
    console.log("req body", req.body);
    try {
        const { username, password } = req.body;

        // Retrieve the user from the database
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Verify the password
        const passwordMatch = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.rows[0].id, role: user.rows[0].role },
            `${process.env.JWT_SECRET}`,
            { expiresIn: "1h" } // Token expiration time
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
