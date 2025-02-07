import { useEffect, useState } from "react";
import supabase from "./Supabase/supabaseClient";
import { Navigate } from "react-router-dom";

function Wrapper({children}){
    const [authenicated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            setAuthenticated(!!session)
            setLoading(false)
        }

        getSession()
    }, [])

    if(loading) {
        return <div>Loading...</div>
    } else {
        if (authenicated) {
            return <>{children}</>
        }
        return <Navigate to="/login" />
    }
}

export default Wrapper