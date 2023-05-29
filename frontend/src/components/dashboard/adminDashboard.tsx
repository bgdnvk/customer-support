import { useEffect, useState } from "react";

interface Agent {
    id: number;
    user_id: number;
    name: string | null;
    title: string | null;
    description: string | null;
}

export default function AdminDashboard() {

    const [agents, setAgents] = useState<Array<Agent>>([])
    const [token, setToken] = useState('')

    function getToken() {
        const cookie = document.cookie
        const token = cookie.substring(8)
        console.log('cookie token', token)
        return token
    }
    
    useEffect(() => {
        const myToken = getToken()
        setToken(myToken)
    }, [token])

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
        try {
            const response = await fetch(`http://localhost:5000/api/agent/agents/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('response', response)
            const data = await response.json()
            
        } catch (e) {

        }
        const newAgents = agents.filter((a) => a.id !== id)

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
                            <p>description: {a.description}</p>
                            <p>ID: {a.id}</p>
                            <p>user ID: {a.user_id}</p>
                            <button onClick={() => handleDelete(a.id)}>delete agent {a.name}</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={fetchAgents}>getAgents</button>
        </div>
    )
}