import {useState} from "react"
import supabase from "../Supabase/supabaseClient"
import { Link } from "react-router-dom"
function Register(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setmessage] = useState("")

    const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setmessage("")

        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if(error){
            setmessage(error.message)
            return
        }

        if(data) {
            setmessage("User account created")
        }
        
        setEmail("")
        setPassword("")
    }
    return (
        <div>
            <h2>Register</h2>
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
                <button type="submit"> Create Account</button>
            </form>
            <span>Already have an account?</span>
            <Link to="/login">Log in</Link>
        </div>
    )
}

export default Register