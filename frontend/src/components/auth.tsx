'use client'

import Login from "@/app/auth/login/page"
import { useState } from "react"

export default function Auth() {
    const [session, setSession] = useState<string>(document.cookie)
    function handleButton () {
        document.cookie = "CStoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setSession('');
        //TODO: check security reason to fully delete the cookie? it disappears after refresh but not b4
        //window.location.reload(false);
    }
    
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
                <Login setSession={setSession}></Login>
            </div>
            }
        </div>
    )
}