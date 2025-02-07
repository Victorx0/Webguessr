import {useState} from "react"
import supabase from "../Supabase/supabaseClient"
import { Link, useNavigate } from "react-router-dom"

function Login(){
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setmessage] = useState("")

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setmessage("")

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if(error){
            setmessage(error.message)
            setEmail("")
            setPassword("")
            return
        }

        if(data) {
            navigate("/dashboard")
            return null
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <br></br>
            {message && <span>{message}</span>}
            <form onSubmit={handleSubmit}>
                <input 
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email" 
                placeholder="Email" />
                <input
                required
                onChange={(e) => setPassword(e.target.value)}
                value= {password}
                type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <span>Don't have an account?</span>
            <Link to="/register">Register</Link>
        </div>
    )
}

export default Login