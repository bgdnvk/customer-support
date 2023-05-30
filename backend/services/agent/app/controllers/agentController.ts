import { Request, Response } from "express";
import { pool } from "../db/pool";

//create a new agent and add it to the available list
export const createAgent = async (req: Request, res: Response) => {
    console.log("api agent hit");
    const { user_id, name, title, description } = req.body;

    console.log("user id", user_id);
    try {
        const agentResult = await pool.query(
            "INSERT INTO agents (user_id, name, title, description) VALUES ($1, $2, $3, $4) RETURNING id",
            [user_id, name, title, description]
        );

        const agentId = agentResult.rows[0].id;

        await pool.query(
            "INSERT INTO available_agents (agent_id) VALUES ($1)",
            [agentId]
        );

        res.status(201).json({ message: "Agent created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all agents regardless if they are busy or not
export const getAgents = async (req: Request, res: Response) => {
    try {
        const agents = await pool.query("SELECT * FROM agents");
        res.json({ agents: agents.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "couldn't get agents" });
    }
};

// update the agent
// note that you can't update the id or the username
export const editAgent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, title, description } = req.body;

    try {
        const result = await pool.query(
            "UPDATE agents SET name = $1, title = $2, description = $3 WHERE id = $4 RETURNING *",
            [name, title, description, id]
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
};

export const removeAgent = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        //make sure to delete only when agent doesn't have assigned cases
        const caseAgent = await pool.query(
            "SELECT * FROM cases WHERE agent_id=$1",
            [id]
        );

        if (caseAgent.rowCount >= 1) {
            res.status(403).json({
                message: "this agent is assigned to a case",
            });
        } else {
            const result = await pool.query(
                "DELETE FROM agents WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rowCount === 0) {
                res.status(404).json({
                    message: "Agent not found",
                });
            }
            //deleted successfully
            res.status(204);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
