import { useState, useEffect } from 'react';

interface Case {
  case_id: number;
  title: string;
  description: string;
  agent_id: number;
  customer_id: number;
}

export function AgentDashboard() {
    const [fetchedCases, setFetchedCases] = useState<Array<Case>>([]);

    function getToken() {
        const cookie = document.cookie
        const token = cookie.substring(8)
        console.log('token agent', token)
        return token
    }

    async function fetchCases() {
        const token = getToken()
      try {
        const response = await fetch('http://localhost:5000/api/agent/case', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const data = await response.json();
        console.log('data from fetch cases', data);
        if(response.ok) {
            setFetchedCases(data.cases);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
    async function handleDelete(caseId: number) {
        const token = getToken()
      try {
        const response = await fetch(`http://localhost:5000/api/agent/case/${caseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        console.log(response);
        setFetchedCases(fetchedCases.filter((c) => c.case_id !== caseId));
      } catch (error) {
        console.error(error);
      }
    }
  
    return (
      <div>
        <h2>Agent Dashboard</h2>
        <button onClick={fetchCases}>Fetch Cases</button>
        {fetchedCases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          <ul>
            {fetchedCases.map((c: Case) => (
              <li key={c.case_id}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <p>Agent ID: {c.agent_id}</p>
                <p>Customer ID: {c.customer_id}</p>
                <button onClick={() => handleDelete(c.case_id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }