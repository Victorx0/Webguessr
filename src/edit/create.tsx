import { useEffect, useState } from "react";
import supabase from "../Supabase/supabaseClient";
import { Navigate, Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

function Create() {
    const [loading, setLoading] = useState(true)
    const [playset, setPlayset] = useState<Array<{id: number, table_name: string}> | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [session, setSession] = useState<Session|null>(null)

    const getSession = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                setFetchError('No active session found')
                setLoading(false)
                return
            }

            if(session){
                setSession(session);
            }

            const {
                data: playsetData,
                error: playsetError
            } = await supabase
                .from('user_custom_tables')
                .select()
                .eq('user_id', session.user.id)

            if (playsetError) {
                setFetchError('Could not fetch the playsets')
                setPlayset(null)
                console.log(playsetError)
                setLoading(false)
                return
            }
            
            if (playsetData) {
                setPlayset(playsetData)
                setFetchError(null)
                console.log(playsetData)
            }
        } catch (error) {
            setFetchError('An error occurred while fetching data')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSession()
    }, [])

    const handleDelete = async (tableName: string) => {
        try {
            // First, drop the actual table
            const { error: dropError } = await supabase
                .rpc('drop_user_table', {
                    table_name: tableName
                })

            if (dropError) {
                console.error('Error dropping table:', dropError)
                return
            }

            // Then refresh the table list
            getSession()

        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h1>Welcome to Create</h1>
                    {fetchError && <p className="error">{fetchError}</p>}
                    {playset && playset.map(item => (
                        <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <Link to={`/edit/${item.id - 1}`}>
                                <button>{item.table_name.slice(session?.user.id.length + 6)}</button>
                            </Link>
                            <button 
                                onClick={() => handleDelete(item.table_name)}
                                style={{ backgroundColor: 'red', color: 'white' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <Link to="/new_table">
                        <button>Create New Playset</button>
                    </Link>
                </>
            )}
        </>
    )
}

export default Create