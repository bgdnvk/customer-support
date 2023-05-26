'use client'

import { useState } from "react";

export function CustomerDashboard() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const cookie = document.cookie
    const token = cookie.substring(8)
    console.log('token dashboard', token)
  
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      try {
        const response = await fetch('http://localhost:4000/api/case', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        });
        const data = await response.json();
        console.log(data);

        if(response.ok) {
            setTitle('')
            setDescription('')
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <button type="submit">Create Case</button>
      </form>
    );

}