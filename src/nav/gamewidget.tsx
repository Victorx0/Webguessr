import { Link } from "react-router-dom";

// Define the type for the item prop
interface GameWidgetItem {
    id: number;
    table_name: string;
    user_id: string;
    // Add other fields as necessary
}

function GameWidget({ item }: { item: GameWidgetItem }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.table_name.slice(item.user_id.length + 6)}</h5>
                    <p className="card-text">Created by: {item.user_id}</p>
                    <div className="mt-auto">
                        <Link to={`/play/${item.id}`} className="btn btn-primary w-100">
                            Play
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GameWidget;