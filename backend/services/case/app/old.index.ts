import express from "express";
import cors from "cors";
import { verifyAdmin, verifyAgent, verifyCustomer, verifyUser } from "./middleware";

const app = express();
app.use(cors());
app.use(express.json());

interface Case {
    id: number;
    title: string;
    description: string;
}

let cases: Case[] = [
    { id: 1, title: "Case 1", description: "This is case 1" },
    { id: 2, title: "Case 2", description: "This is case 2" },
    { id: 3, title: "Case 3", description: "This is case 3" },
];

app.get("/verify", verifyUser, (req, res) => {
    res.json("success")
})

app.get("/verify/customer", verifyCustomer, (req, res) => {
    res.json("customer verified")
})

app.get("/verify/agent", verifyAgent, (req, res) => {
    res.json("agent verified")
})

app.get("/verify/admin", verifyAdmin, (req, res) => {
    res.json("admin verified")
})

app.get("/cases", (req, res) => {
    res.json(cases);
});

app.post("/cases", (req, res) => {
    const { title, description } = req.body;
    const id = cases.length + 1;
    const newCase = { id, title, description };
    cases.push(newCase);
    res.json(newCase);
});

app.put("/cases/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;
    const index = cases.findIndex((c) => c.id === id);
    if (index !== -1) {
        cases[index] = { id, title, description };
        res.json(cases[index]);
    } else {
        res.status(404).json({ message: `Case with id ${id} not found` });
    }
});

app.delete("/cases/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = cases.findIndex((c) => c.id === id);
    if (index !== -1) {
        cases.splice(index, 1);
        res.json({ message: `Case with id ${id} deleted` });
    } else {
        res.status(404).json({ message: `Case with id ${id} not found` });
    }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
