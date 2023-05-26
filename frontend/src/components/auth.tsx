'use client'

import Login from "@/app/auth/login/page"
import Register from "@/app/auth/register/page";
import { useState } from "react"
import RoleSelector from "./roleSelector";

export default function Auth({setRole}: {setRole: any}) {
    const [session, setSession] = useState<string>(document.cookie)
    function handleButton () {
        document.cookie = "CStoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setSession('');
        //TODO: check security reason to fully delete the cookie? it disappears after refresh but not b4
        // window.location.reload();
    }
    
    console.log('token', session)

    return(
        <div>
            {session.length > 1 ? 
            <div>
                <p>
                    cookie exists
                </p>
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