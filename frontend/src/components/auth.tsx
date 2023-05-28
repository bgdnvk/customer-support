'use client'

import Login from "@/app/auth/login/page"
import Register from "@/app/auth/register/page";
import { useEffect, useState } from "react"
import RoleSelector from "./roleSelector";
import { AgentDashboard } from "./dashboard/agentDashboard";
import { CustomerDashboard } from "./dashboard/customerDashboard";
import AdminDashboard from "./dashboard/adminDashboard";

export default function Auth() {

    const [session, setSession] = useState<string>('')

    useEffect(() => {
      if(typeof window !== undefined) {
        const currCookie: string = document.cookie || '' 
        setSession(currCookie)
      }
    }, [])

    function handleButton () {
        document.cookie = "CStoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setSession('');
        //TODO: check security reason to fully delete the cookie? it disappears after refresh but not b4
        // window.location.reload();
    }
    
    const [role, setRole] = useState<string>('')
    console.log('token', session)

    let dashboardComponent;

    switch (role) {
      case 'agent':
        dashboardComponent = <AgentDashboard />;
        break;
      case 'customer':
        dashboardComponent = <CustomerDashboard />;
        break;
      case 'admin':
        dashboardComponent = <AdminDashboard />;
        break;
      default:
        dashboardComponent = <h1> please select a role </h1>;
        break;
    }
    
    return(
        <div>
            {session.length > 1 ? 
            <div>
                {dashboardComponent}
                <button onClick={handleButton}>
                    LOG OFF
                </button>
            </div>
            :
            <div>
                <RoleSelector setRole={setRole}></RoleSelector>
                <Login setSession={setSession}></Login>
                <br></br>
                <Register></Register>
            </div>
            }
        </div>
    )
}