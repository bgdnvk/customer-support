import { Request, Response } from "express";
import { pool } from "../db/pool";
import { casesToJSON } from "../lib/utils";

//get all cases as an agent
export const getCases = async (req: Request, res: Response) => {
    console.log("cases GET");
    try {
        const cases = await pool.query("SELECT * FROM cases");
        console.log("cases", cases);
        console.log("cases rows", cases.rows);

        if (cases.rows.length === 0 || !cases.rows) {
            res.status(204).json({ message: "no cases" });
        } else {
            const casesJSON = casesToJSON(cases);
            res.status(200).json({ cases: casesJSON });
        }
    } catch (e) {
        res.status(500).json({ message: "internal err" });
    }
};

// get resolved cases
export const getResolvedCases = async (req: Request, res: Response) => {
    console.log("resolved cases GET");
    try {
        const cases = await pool.query("SELECT * FROM resolved_cases");
        console.log("cases", cases);
        console.log("cases rows", cases.rows);

        if (cases.rows.length === 0 || !cases.rows) {
            res.status(204).json({ message: "no cases" });
        } else {
            const casesJSON = casesToJSON(cases);
            res.status(200).json({ cases: casesJSON });
        }
    } catch (e) {
        res.status(500).json({ message: "err, couldn't get all cases" });
    }
};

export const createCase = async (req: Request, res: Response) => {
    const { case_id, title, description, customer_id } = req.body;
    //https://node-postgres.com/features/transactions#asyncawait
    const client = await pool.connect();

    try {
        // Start a transaction
        await client.query("BEGIN");

        // Find the oldest added agent
        const result = await client.query(`
      SELECT agent_id
      FROM available_agents
      ORDER BY added_at ASC
      LIMIT 1
    `);

        //TODO: handle no agents available
        const { agent_id } = result.rows[0];

        // If agent_id is undefined, throw an error
        if (!agent_id) {
            throw new Error("No agents available_agents");
        }

        // Delete the agent from the available_agents table
        await client.query(
            `
      DELETE FROM available_agents
      WHERE agent_id = $1
    `,
            [agent_id]
        );

        // Add the case to the cases table
        await client.query(
            `
      INSERT INTO cases (case_id, agent_id, title, description, customer_id)
      VALUES ($1, $2, $3, $4, $5)
    `,
            [case_id, agent_id, title, description, customer_id]
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
};

export const deleteCase = async (req: Request, res: Response) => {
    const { caseId } = req.params;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const result = await client.query(
            `
        SELECT *
        FROM cases
        WHERE case_id = $1
      `,
            [caseId]
        );

        // get the case info
        const { case_id, title, description, customer_id, agent_id } =
            result.rows[0];

        //delete from the on going cases
        await client.query(
            `
        DELETE FROM cases
        WHERE case_id = $1
      `,
            [caseId]
        );

        // insert into resolved cases
        await client.query(
            `INSERT INTO resolved_cases (case_id, title, description, customer_id, agent_id) 
                VALUES ($1, $2, $3, $4, $5)`,
            [case_id, title, description, customer_id, agent_id]
        );

        //return the agent back into the db of available agents
        await client.query(
            `
        INSERT INTO available_agents (agent_id)
        VALUES ($1)
      `,
            [agent_id]
        );

        await client.query("COMMIT");

        res.status(204).json({ message: `deleted ${caseId}` });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        throw new Error(`Failed to remove ${caseId}`);
    } finally {
        if (client) {
            client.release();
        }
    }
};
