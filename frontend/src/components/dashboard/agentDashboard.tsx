import getToken from '@/lib/utils';
import { Case } from '@/types/types';
import { useState, useEffect } from 'react';

export function AgentDashboard() {
    const [fetchedCases, setFetchedCases] = useState<Array<Case>>([]);
    const [resolvedCases, setResolvedCases] = useState<Array<Case>>([]);

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
    
    async function fetchResolvedCases() {
        const token = getToken()
      try {
        const response = await fetch('http://localhost:5000/api/agent/case/resolved', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const data = await response.json();
        console.log('data from fetch resolved cases', data);
        if(response.ok) {
            setResolvedCases(data.cases);
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
        <button onClick={fetchCases}>Fetch Ongoing Cases</button>
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
                <button onClick={() => handleDelete(c.case_id)}>Resolve</button>
              </li>
            ))}
          </ul>
        )}
        
        <button onClick={fetchResolvedCases}>Fetch RESOLVED Cases</button>
        {resolvedCases.length === 0 ? (
          <p>No cases found.</p>
        ) : (
          <ul>
            {resolvedCases.map((c: Case) => (
              <li key={c.case_id}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <p>Agent ID: {c.agent_id}</p>
                <p>Customer ID: {c.customer_id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }