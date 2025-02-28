import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap-icons/font/bootstrap-icons.css'; // Optional: for icons

interface DataItem {
    id: number;
    name: string;
    [key: string]: any; // For any additional properties
}

interface ChampionSearchProps {
    dbdata: DataItem[];
    chosen: DataItem[] | null;
    searchHistory: DataItem[];
    addToSearchHistory: (champion: DataItem) => void;
}

function ChampionSearch({ dbdata = [], chosen, searchHistory, addToSearchHistory }: ChampionSearchProps) {
    const headings = dbdata && dbdata.length > 0 ? Object.keys(dbdata[0]) : [];
    const [input, setInput] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value;
        setInput(userInput);

        const matchedData = dbdata.filter((champ) => 
            champ.name.toLowerCase().includes(userInput.toLowerCase())
        );

        setFilteredData(userInput ? matchedData : []);
    };

    const handleSearch = (champion: DataItem) => {
        addToSearchHistory(champion);
        setInput('');
        setFilteredData([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredData.length > 0) {
            handleSearch(filteredData[0]);
        }
    };

    return (
        <div>
            <div className="mb-4 position-relative">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input 
                        type="text" 
                        className="form-control form-control-lg"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a champion name..."
                        aria-label="Search champions"
                    />
                </div>
                
                {filteredData.length > 0 && (
                    <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000 }}>
                        {filteredData.map(champ => (
                            <button 
                                key={champ.id} 
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSearch(champ)}
                            >
                                {champ.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {searchHistory.length > 0 && (
                <div>
                    <div className="mb-3">
                        <h3 className="h5 mb-0">Your Guesses</h3>
                    </div>
                    
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    {headings.map(heading => (
                                        <th key={heading} scope="col">{heading}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {searchHistory.map(champion => (
                                    <tr key={champion.id}>
                                        {headings.map(heading => {
                                            const isCorrect = chosen && 
                                                            chosen[0] && 
                                                            chosen[0][heading] === champion[heading];
                                            
                                            return (
                                                <td 
                                                    key={heading}
                                                    className={isCorrect ? 'text-success fw-bold' : 'text-danger'}
                                                >
                                                    {champion[heading]}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChampionSearch;