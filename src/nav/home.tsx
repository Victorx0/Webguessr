import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import supabase from "../Supabase/supabaseClient";
import 'bootstrap/dist/css/bootstrap.min.css';

function Home(){
    const [playset, setPlayset] = useState<Array<{id: number, user_id: string,table_name: string, columns: number}> | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)

    useEffect(() => { 
        const fetchAll = async () => {
            // First fetch playsets
            const {data: playsetData, error: playsetError} = await supabase
            .from('user_custom_tables')
            .select();
            
            if(playsetError) {
            setFetchError('Could not fetch the playsets')
            setPlayset(null)
            console.log(fetchError)
            return // Exit early if there's an error
            }
            
            if(playsetData) {
              setPlayset(playsetData)
              setFetchError(null)
              console.log(playsetData)
            }
        }
        fetchAll()
        }, [])

    return (
        <div className="m">
            <h1>Log in to play</h1>
            {playset && playset.map(item => (
                <Link to={`/game/${item.id}`}><button className="btn btn-primary">{item.table_name.slice(item.user_id.length + 6)}</button></Link>
            ))} 
        </div>
    )
}

export default Home