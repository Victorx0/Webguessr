import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../Supabase/supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import GameWidget from "./gamewidget";

function Home() {
    const [playset, setPlayset] = useState<Array<{ id: number, user_id: string, table_name: string, columns: number }> | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            // Fetch playsets
            const { data: playsetData, error: playsetError } = await supabase
                .from("user_custom_tables")
                .select();

            if (playsetError) {
                setFetchError("Could not fetch the playsets");
                setPlayset(null);
                console.log(fetchError);
                return; // Exit early if there's an error
            }

            if (playsetData) {
                setPlayset(playsetData);
                setFetchError(null);
                console.log(playsetData);
            }
        };

        fetchAll();
    }, []);

    return (
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1 className="display-4">Welcome to Webguessr</h1>
                <p className="lead">Guess anything playing user created Games!</p>
                <p className="lead">Login to play and create your own Games!</p>
                <Link to="/login" className="btn btn-primary btn-lg">
                    Log In
                </Link>
            </div>

            {fetchError && (
                <div className="alert alert-danger text-center" role="alert">
                    {fetchError}
                </div>
            )}

            <div className="mb-4">
                <h2>games</h2>
                <div className="row">
                    {playset && playset.map((item) => (
                        <GameWidget key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
