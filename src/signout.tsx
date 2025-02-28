import { useNavigate } from "react-router-dom"
import supabase from "./Supabase/supabaseClient"
import 'bootstrap/dist/css/bootstrap.min.css';

function Signout(){
    const navigate = useNavigate()

    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if(error) throw error;
        navigate("/login");
    }
    return (
    <footer className="bg-dark text-white text-center p-3 fixed-bottom">
      <button className="w-30" onClick={signOut}>
        Sign Out
      </button>
    </footer>
    )
}

export default Signout