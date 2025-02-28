import supabase from "../Supabase/supabaseClient";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import GameWidget from "./gamewidget";

// Define the type for a playset
interface Playset {
    id: string;
    user_id: string;
    display_name: string;
    // Add other fields as necessary
}

function Dashboard() {
    const [playsets, setPlaysets] = useState<Playset[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            // Fetch playsets
            const { data: playsetData, error: playsetError } = await supabase
                .from('user_custom_tables')
                .select();

            if (playsetError) {
                setFetchError("Could not fetch the playsets");
                setPlaysets([]);
                console.log(fetchError);
                return; // Exit early if there's an error
            }

            if (playsetData) {
                // Fetch user display names for each playset
                const playsetsWithUsers = await Promise.all(playsetData.map(async (item) => {
                    const { data: userData, error: userError } = await supabase
                        .from('profiles')
                        .select('display_name')
                        .eq('id', item.user_id)
                        .single();

                    if (userError) {
                        console.error('Error fetching user:', userError);
                        return { ...item, display_name: 'Unknown' };
                    }

                    return { ...item, display_name: userData.display_name };
                }));

                setPlaysets(playsetsWithUsers as Playset[]);
                setFetchError(null);
            }
        };

        fetchAll();
    }, []);

    return (
        <div className="container p-4">
            <h1 className="display-4 mb-4">Welcome to the Dashboard</h1>
            <p className="lead">Currently logged in</p>

            {fetchError && (
                <div className="alert alert-danger" role="alert">
                    {fetchError}
                </div>
            )}

            {/* Section for creating new playsets */}
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="card-title">Create Your Own Game</h2>
                    <p className="card-text">
                        Ready to create your own custom Game? Click the button below to get started!
                    </p>
                    <Link to="/create" className="btn btn-primary">
                        Go to Create and Edit
                    </Link>
                </div>
            </div>

            {/* Section for current playsets */}
            <div className="mb-4">
                <h2>games</h2>
                <div className="row">
                    {playsets.map((item) => (
                        <GameWidget key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;