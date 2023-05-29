import { useState } from "react";

interface Agent {
    agent_id: number;
    user_id: number;
    name: string;
    title: string;
    description: string;
}

export default function AdminDashboard() {

    
    const [agents, setAgents] = useState<Array<Agent>>([])

    function getToken() {
        const cookie = document.cookie
        const token = cookie.substring(8)
        console.log('token agent', token)
        return token
    }

    async function fetchAgents() {
        const token = getToken()

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
        } catch (e) {
            console.error(e)
        }
    }
    
    return(
        <div>
            <button onClick={fetchAgents}>getAgents</button>
        </div>
    )
}