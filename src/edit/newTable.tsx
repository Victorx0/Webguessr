import { useState } from "react";
import supabase from "../Supabase/supabaseClient";
import { useNavigate } from "react-router-dom";

const NewTable = () => {
    const [tableName, setTableName] = useState('');
    const [columns, setColumns] = useState<Array<{name: string; type: string}>>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate()

    const handleCreateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Convert columns array to object
            const columnData = columns.reduce((acc, col) => {
                acc[col.name] = col.type;
                return acc;
            }, {} as Record<string, string>);

            const { data, error } = await supabase
                .rpc('create_user_table', {
                    custom_table_name: tableName,
                    columns: columnData
                });

            if (error) {
                setError(error.message);
                return;
            }

            console.log('Table created:', data);
            // Reset form
            setTableName('');
            setColumns([]);

            if(data){
                setSuccess("successfully made table")
                navigate("/create")
            }
            
        } catch (error) {
            setError('Failed to create table');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleCreateTable}>
            <div>
                <label>Table Name:</label>
                <input 
                    type="text" 
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    required
                />
            </div>

            {columns.map((col, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Column name"
                        value={col.name}
                        onChange={(e) => {
                            const newColumns = [...columns];
                            newColumns[index].name = e.target.value;
                            setColumns(newColumns);
                        }}
                    />
                    <select
                        value={col.type}
                        onChange={(e) => {
                            const newColumns = [...columns];
                            newColumns[index].type = e.target.value;
                            setColumns(newColumns);
                        }}
                    >
                        <option value="text">Text</option>
                        <option value="integer">Integer</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                        <option value="timestamp">Timestamp</option>
                    </select>
                </div>
            ))}

            <button 
                type="button" 
                onClick={() => setColumns([...columns, { name: '', type: 'text' }])}
            >
                Add Column
            </button>

            <button type="submit">Create Table</button>

            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </form>
    );
};
export default NewTable