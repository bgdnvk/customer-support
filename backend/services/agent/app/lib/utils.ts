import { QueryResult } from "pg";

export const casesToJSON = (cases: QueryResult<any>) => {
    const casesJSON: string | any = [];

    for (let i = 0; i < cases.rows.length; i++) {
        const case_id = cases.rows[i].case_id;
        const title = cases.rows[i].title;
        const description = cases.rows[i].description;
        const agent_id = cases.rows[i].agent_id;
        const customer_id = cases.rows[i].customer_id;

        casesJSON.push({
            case_id,
            title,
            description,
            agent_id,
            customer_id,
        });
    }

    return casesJSON;
};
