import { FormEvent, useEffect, useState } from "react";

interface Agent {
    id: number;
    user_id: number;
    name: string | null;
    title: string | null;
    description: string | null;
}

interface Edit {
    flag: boolean;
    agent: Agent | null;
}

export default function AdminDashboard() {

    const [agents, setAgents] = useState<Array<Agent>>([])
    const [token, setToken] = useState('')
    const [edit, setEdit] = useState<Edit>({
        flag: false,
        agent: null
    })
    const [updateAgent, setUpdateAgent] = useState<Agent>()

    function getToken() {
        const cookie = document.cookie
        const token = cookie.substring(8)
        console.log('cookie token', token)
        return token
    }
    
    useEffect(() => {
        const myToken = getToken()
        setToken(myToken)
    }, [token, agents])

    async function fetchAgents() {
        console.log('token from admin dashboard', token)

        try {
            const response = await fetch('http://localhost:5000/api/agent/agents', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json()
            console.log('data from agents', data)
            console.log('agents', data.agents)
            setAgents(data.agents)
        } catch (e) {
            console.error(e)
        }
    }
    
    async function handleDelete(id: number) {

        console.log('deleting', id)
        const newAgents = agents.filter((a) => a.id !== id)
        console.log('new Agents', newAgents)
        setAgents(newAgents)

        try {
            await fetch(`http://localhost:5000/api/agent/agents/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
    
    function editAgent(agent: Agent) {
        setEdit({agent: agent, flag : true})
        setUpdateAgent(agent)
    }
    
    async function handleForm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log('agent is', updateAgent)
        try {
            await fetch(`http://localhost:5000/api/agent/agents/${updateAgent?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: updateAgent?.name,
                    description: updateAgent?.description,
                    title: updateAgent?.title
                })
            })
        } catch (e) {
            console.error(e)
        }
    }
    
    return(
        <div>
            <h2>Admin Dashboard</h2>
            {agents.length === 0 ? (
                <p>No agents found</p>
            ): (
                <ul>
                    {agents.map((a: Agent) => (
                        <li key={a.id}>
                            <h3>name: {a.name}</h3>
                            <p>title: {a.title}</p>
                            <p>description: {a.description}</p>
                            <p>ID: {a.id}</p>
                            <p>user ID: {a.user_id}</p>
                            <button onClick={() => handleDelete(a.id)}>delete agent {a.name}</button>
                            <button onClick={() => editAgent(a)}>edit this agent</button>
                        </li>
                    ))}
                </ul>
            )}
            {edit.flag ? (
                <form onSubmit={(e) => handleForm(e)}>
                    <label>
                        Title:
                        <input
                        type="text"
                        value={updateAgent?.title|| ''}
                        onChange={(e) => {
                            setUpdateAgent({
                                ...updateAgent!,
                                title: e.target.value,
                            })
                        }}
                        ></input>
                    </label>
                    <label>
                        Name:
                        <input
                        type="text"
                        value={updateAgent?.name || ''}
                        onChange={(e) => {
                            setUpdateAgent({
                                ...updateAgent!,
                                name: e.target.value,
                            })
                        }}
                        ></input>
                    </label>
                    <label>
                        Description:
                        <input
                        type="text"
                        value={updateAgent?.description|| ''}
                        onChange={(e) => {
                            setUpdateAgent({
                                ...updateAgent!,
                                description: e.target.value,
                            })
                        }}
                        ></input>
                    </label>
                    <button type="submit"> update Agent</button>
                </form>
            ): (
                null
            )}
            <br></br>
            <button onClick={fetchAgents}>getAgents</button>
        </div>
    )
}