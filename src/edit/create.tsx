import { useEffect, useState } from "react";
import supabase from "../Supabase/supabaseClient";
import { Link } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import 'bootstrap/dist/css/bootstrap.min.css';

function Create() {
    const [loading, setLoading] = useState(true);
    const [playset, setPlayset] = useState<Array<{ id: number, table_name: string }> | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    const getSession = async () => {
        try {
            const {
                data: { session },
                error: sessionError
            } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            if (!session) {
                setFetchError('No active session found');
                setLoading(false);
                return;
            }

            setSession(session);

            const {
                data: playsetData,
                error: playsetError
            } = await supabase
                .from('user_custom_tables')
                .select()
                .eq('user_id', session.user.id);

            if (playsetError) throw playsetError;

            setPlayset(playsetData);
            setFetchError(null);
        } catch (error) {
            setFetchError('An error occurred while fetching data');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSession();
    }, []);

    const handleDelete = async (tableName: string) => {
        try {
            setDeleteError(null);
            setLoading(true);

            const { error: deleteError } = await supabase
                .from('user_custom_tables')
                .delete()
                .eq('table_name', tableName)
                .eq('user_id', session?.user.id);

            if (deleteError) {
                console.error('Delete error:', deleteError);
                setDeleteError(`Failed to delete record: ${deleteError.message}`);
                return;
            }

            await getSession();

        } catch (error) {
            console.error('Delete error:', error);
            setDeleteError('An unexpected error occurred while deleting the record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-4">
            {loading && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    <h1 className="display-4 mb-4 text-center">Welcome to Create</h1>

                    <div className="text-center mb-4">
                        <span className="badge bg-secondary">
                            Create your own Games to share with friends
                        </span>
                    </div>

                    {fetchError && (
                        <div className="alert alert-danger text-center" role="alert">
                            {fetchError}
                        </div>
                    )}

                    {deleteError && (
                        <div className="alert alert-danger text-center" role="alert">
                            {deleteError}
                        </div>
                    )}

                    <div className="row">
                        {playset && playset.map(item => (
                            <div key={item.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <Link to={`/edit/${item.id - 1}`} className="text-decoration-none flex-grow-1">
                                            <button className="btn btn-primary w-100 h-100 d-flex align-items-center justify-content-center">
                                                Edit {session && session.user.id.length &&
                                                    item.table_name.slice(session.user.id.length + 6)
                                                }
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.table_name)}
                                            className="btn btn-danger btn-sm mt-2"
                                            disabled={loading}
                                        >
                                            {loading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-4">
                        <span className="badge bg-secondary">
                            {playset ? `${playset.length}/3 Used` : '0/3 Used'}
                        </span>
                    </div>

                    <div className="text-center">
                        <Link to="/new_table" className="text-decoration-none">
                            <button className="btn btn-success">
                                Create New Game
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default Create;